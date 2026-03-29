import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Try to get user from auth header, but don't require it
    let userId = "guest";
    let email = "guest@test.com";
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData } = await supabase.auth.getClaims(token);
      if (claimsData?.claims) {
        userId = claimsData.claims.sub as string;
        email = claimsData.claims.email as string;
      }
    }

    const { items, successUrl, cancelUrl } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify listings exist and get current prices from DB
    const listingIds = items.map((i: { listingId: string }) => i.listingId);
    const { data: listings, error: listingsError } = await supabase
      .from("listings")
      .select("id, title, price, images, status")
      .in("id", listingIds)
      .eq("status", "ACTIVE");

    if (listingsError || !listings || listings.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid listings" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const email = claimsData.claims.email as string;
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
    }

    const lineItems = items.map((item: { listingId: string; quantity: number }) => {
      const listing = listings.find((l) => l.id === item.listingId);
      if (!listing) throw new Error(`Listing ${item.listingId} not found`);
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: listing.title,
            images: listing.images?.slice(0, 1) || [],
          },
          unit_amount: Math.round(listing.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/checkout/cancel`,
      metadata: {
        supabase_user_id: userId,
        listing_ids: JSON.stringify(listingIds),
        quantities: JSON.stringify(items.map((i: { quantity: number }) => i.quantity)),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
