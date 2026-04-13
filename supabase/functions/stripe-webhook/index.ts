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
      // Use async version to avoid SubtleCryptoProvider error in Deno
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    console.log(`Received event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const userId = metadata.supabase_user_id;
      const listingIds: string[] = JSON.parse(metadata.listing_ids || "[]");
      const quantities: number[] = JSON.parse(metadata.quantities || "[]");

      for (let i = 0; i < listingIds.length; i++) {
        const { data: listing } = await supabase
          .from("listings")
          .select("price, seller_id")
          .eq("id", listingIds[i])
          .single();

        if (listing) {
          const qty = quantities[i] || 1;
          
          // Create order for each unit so serial number assignment works
          for (let q = 0; q < qty; q++) {
            await supabase.from("orders").insert({
              buyer_id: userId,
              seller_id: listing.seller_id,
              listing_id: listingIds[i],
              amount: listing.price,
              status: "COMPLETED",
              stripe_session_id: session.id,
            });
          }
        }
      }

      console.log(`Orders created for session ${session.id}`);
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
