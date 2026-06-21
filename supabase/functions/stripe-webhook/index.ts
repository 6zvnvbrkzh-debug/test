import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("webhook_stripe");

    // STRICT signature verification — never trust unsigned payloads.
    if (!webhookSecret || !signature) {
      console.error("Webhook rejected: missing signature or secret");
      return new Response(
        JSON.stringify({ error: "Missing webhook signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(`Received event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const sessionRaw = event.data.object as Stripe.Checkout.Session;
      
      // Retrieve the full session - shipping_details and customer_details are included by default
      const session = await stripe.checkout.sessions.retrieve(sessionRaw.id);
      
      const metadata = session.metadata || {};

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const rawUserId = metadata.supabase_user_id;
      // Guests pass "guest" — store as NULL since buyer_id is a uuid column
      const userId =
        rawUserId && rawUserId !== "guest" && /^[0-9a-f-]{36}$/i.test(rawUserId)
          ? rawUserId
          : null;
      const listingIds: string[] = JSON.parse(metadata.listing_ids || "[]");
      const quantities: number[] = JSON.parse(metadata.quantities || "[]");

      // Extract customer details from full Stripe session
      const customerName = session.customer_details?.name || (session as any).shipping_details?.name || null;
      const customerEmail = session.customer_details?.email || null;
      
      const shippingDetails = (session as any).shipping_details;
      const shippingAddr = shippingDetails?.address;
      const shippingAddress = shippingAddr ? {
        name: shippingDetails?.name || customerName,
        line1: shippingAddr.line1,
        line2: shippingAddr.line2,
        city: shippingAddr.city,
        postal_code: shippingAddr.postal_code,
        state: shippingAddr.state,
        country: shippingAddr.country,
      } : null;
      
      console.log("Customer:", customerName, customerEmail);
      console.log("Shipping address:", JSON.stringify(shippingAddress));

      let insertedCount = 0;
      let expectedCount = 0;
      for (let i = 0; i < listingIds.length; i++) {
        const { data: listing } = await supabase
          .from("listings")
          .select("price, seller_id")
          .eq("id", listingIds[i])
          .single();

        if (listing) {
          const qty = quantities[i] || 1;
          expectedCount += qty;

          for (let q = 0; q < qty; q++) {
            const { error: insErr } = await supabase.from("orders").insert({
              buyer_id: userId,
              seller_id: listing.seller_id,
              listing_id: listingIds[i],
              amount: listing.price,
              status: "PENDING",
              stripe_session_id: session.id,
              customer_name: customerName,
              customer_email: customerEmail,
              shipping_address: shippingAddress,
            });
            if (insErr) {
              console.error(
                `Order insert failed (listing=${listingIds[i]}, unit ${q + 1}/${qty}):`,
                insErr,
              );
            } else {
              insertedCount++;
            }
          }
        } else {
          console.error(`Listing not found: ${listingIds[i]}`);
        }
      }

      if (insertedCount !== expectedCount) {
        console.error(
          `ORDER COUNT MISMATCH for session ${session.id}: expected ${expectedCount}, inserted ${insertedCount}. Manual check required!`,
        );
      }

      console.log(`Orders created for session ${session.id}`);

      // ---- Redeem voucher (if used) ----
      if (metadata.voucher_id && metadata.voucher_amount) {
        const amountUsed = Number(metadata.voucher_amount);
        if (Number.isFinite(amountUsed) && amountUsed > 0) {
          // Find first order for this session to link
          const { data: firstOrder } = await supabase
            .from("orders")
            .select("id")
            .eq("stripe_session_id", session.id)
            .limit(1)
            .maybeSingle();

          const { data: redeemed, error: redeemErr } = await supabase.rpc("redeem_voucher", {
            _voucher_id: metadata.voucher_id,
            _amount: amountUsed,
            _stripe_session_id: session.id,
            _order_id: firstOrder?.id ?? null,
            _customer_email: customerEmail,
          });
          if (redeemErr) {
            console.error("Voucher redemption failed:", redeemErr);
          } else {
            console.log(`Voucher ${metadata.voucher_code} redeemed: ${amountUsed} EUR (success=${redeemed})`);
          }
        }
      }

      // Send order notification email to shop owner via Lovable Emails
      try {
        const { data: orderListings } = await supabase
          .from("listings")
          .select("id, title, price")
          .in("id", listingIds);

        const items = listingIds.map((id, i) => {
          const l = orderListings?.find((x) => x.id === id);
          const qty = quantities[i] || 1;
          const price = l ? Number(l.price) : 0;
          return {
            title: l?.title || id,
            quantity: qty,
            subtotal: price * qty,
          };
        });

        const total = ((session.amount_total ?? 0) / 100)
          .toFixed(2)
          .replace(".", ",");
        const phone = (session.customer_details as any)?.phone || "";

        // Call send-transactional-email with the service-role key — the
        // function rejects anon callers to prevent phishing abuse.
        const FN_URL = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-transactional-email`;
        const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
        const invokeEmail = async (payload: Record<string, unknown>) => {
          const res = await fetch(FN_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: ANON,
              Authorization: `Bearer ${SERVICE_KEY}`,
            },
            body: JSON.stringify(payload),
          });
          const text = await res.text();
          if (!res.ok) throw new Error(`${res.status}: ${text}`);
          return text;
        };

        try {
          await invokeEmail({
            templateName: "order-notification",
            idempotencyKey: `order-${session.id}`,
            templateData: {
              sessionId: session.id,
              customerName: customerName || "",
              customerEmail: customerEmail || "",
              customerPhone: phone,
              shippingAddress,
              items,
              total,
            },
          });
          console.log("Order notification email enqueued");
        } catch (e) {
          console.error("Order notification email failed:", (e as Error).message);
        }

        // Kunden-Bestätigungsmail deaktiviert – Stripe versendet bereits eine Quittung/Rechnung an den Kunden.
      } catch (mailErr) {
        console.error("Order email error:", mailErr);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
