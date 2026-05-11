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

    let event: Stripe.Event;

    if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
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

      const userId = metadata.supabase_user_id;
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

      for (let i = 0; i < listingIds.length; i++) {
        const { data: listing } = await supabase
          .from("listings")
          .select("price, seller_id")
          .eq("id", listingIds[i])
          .single();

        if (listing) {
          const qty = quantities[i] || 1;
          
          for (let q = 0; q < qty; q++) {
            await supabase.from("orders").insert({
              buyer_id: userId,
              seller_id: listing.seller_id,
              listing_id: listingIds[i],
              amount: listing.price,
              status: "COMPLETED",
              stripe_session_id: session.id,
              customer_name: customerName,
              customer_email: customerEmail,
              shipping_address: shippingAddress,
            });
          }
        }
      }

      console.log(`Orders created for session ${session.id}`);

      // Send order notification email to shop owner
      try {
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        if (RESEND_API_KEY) {
          const SHOP_EMAIL = "barbato.electronics@gmail.com";
          const FROM_EMAIL = "noreply@info.webstudiocg.de";

          // Fetch listing titles for the email
          const { data: orderListings } = await supabase
            .from("listings")
            .select("id, title, price")
            .in("id", listingIds);

          const escape = (s: string) =>
            String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

          const itemsRows = listingIds.map((id, i) => {
            const l = orderListings?.find((x) => x.id === id);
            const qty = quantities[i] || 1;
            const price = l ? Number(l.price) : 0;
            return `<tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;">${escape(l?.title || id)}</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${qty}</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${(price * qty).toFixed(2)}&nbsp;€</td>
            </tr>`;
          }).join("");

          const total = ((session.amount_total ?? 0) / 100).toFixed(2);

          const addr = shippingAddress;
          const addrHtml = addr
            ? `${escape(addr.name || "")}<br/>${escape(addr.line1 || "")}${addr.line2 ? "<br/>" + escape(addr.line2) : ""}<br/>${escape(addr.postal_code || "")} ${escape(addr.city || "")}<br/>${escape(addr.country || "")}`
            : "—";

          const phone = (session.customer_details as any)?.phone || "—";

          const html = `
            <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111;">
              <h2 style="margin:0 0 16px;font-size:20px;">🛒 Neue Bestellung eingegangen</h2>
              <p style="color:#666;font-size:13px;margin:0 0 20px;">Session: ${escape(session.id)}</p>

              <h3 style="font-size:14px;margin:20px 0 8px;text-transform:uppercase;letter-spacing:0.5px;color:#666;">Kunde</h3>
              <table style="width:100%;font-size:14px;">
                <tr><td style="padding:4px 0;color:#666;width:120px;">Name:</td><td style="padding:4px 0;font-weight:600;">${escape(customerName || "—")}</td></tr>
                <tr><td style="padding:4px 0;color:#666;">E-Mail:</td><td style="padding:4px 0;"><a href="mailto:${escape(customerEmail || "")}">${escape(customerEmail || "—")}</a></td></tr>
                <tr><td style="padding:4px 0;color:#666;">Telefon:</td><td style="padding:4px 0;">${escape(phone)}</td></tr>
              </table>

              <h3 style="font-size:14px;margin:20px 0 8px;text-transform:uppercase;letter-spacing:0.5px;color:#666;">Lieferadresse</h3>
              <div style="font-size:14px;line-height:1.5;">${addrHtml}</div>

              <h3 style="font-size:14px;margin:20px 0 8px;text-transform:uppercase;letter-spacing:0.5px;color:#666;">Artikel</h3>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <thead>
                  <tr style="border-bottom:2px solid #111;">
                    <th style="text-align:left;padding:8px 0;">Produkt</th>
                    <th style="text-align:center;padding:8px 0;">Menge</th>
                    <th style="text-align:right;padding:8px 0;">Summe</th>
                  </tr>
                </thead>
                <tbody>${itemsRows}</tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding:12px 0;text-align:right;font-weight:600;font-size:16px;">Gesamt:</td>
                    <td style="padding:12px 0;text-align:right;font-weight:700;font-size:16px;">${total}&nbsp;€</td>
                  </tr>
                </tfoot>
              </table>

              <p style="margin-top:24px;color:#999;font-size:12px;">Diese E-Mail wurde automatisch von Barbato Electronics versendet.</p>
            </div>
          `;

          const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: `Barbato Electronics Bestellungen <${FROM_EMAIL}>`,
              to: [SHOP_EMAIL],
              reply_to: customerEmail || undefined,
              subject: `🛒 Neue Bestellung – ${total}\u00A0€ – ${customerName || "Kunde"}`,
              html,
            }),
          });

          if (!emailRes.ok) {
            console.error("Order notification email failed:", await emailRes.text());
          } else {
            console.log("Order notification email sent");
          }
        } else {
          console.warn("RESEND_API_KEY not configured, skipping order email");
        }
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
