import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiting per IP
const ipRequests = new Map<string, number[]>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const times = (ipRequests.get(ip) || []).filter((t) => now - t < RATE_WINDOW);
  if (times.length >= RATE_LIMIT) {
    ipRequests.set(ip, times);
    return false;
  }
  times.push(now);
  ipRequests.set(ip, times);
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Zu viele Anfragen. Bitte warte einen Moment." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Service role client for DB queries
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Try to get user from auth header, but don't require it
    let userId = "guest";
    let userEmail: string | undefined;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      // Use anon client with user's token for auth
      const userClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user }, error } = await userClient.auth.getUser(token);
      if (user && !error) {
        userId = user.id;
        userEmail = user.email;
      }
    }

    const body = await req.json();
    const { items, successUrl, cancelUrl } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || items.length > 50) {
      return new Response(JSON.stringify({ error: "Ungültige Artikelliste" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const item of items) {
      if (
        !item.listingId || typeof item.listingId !== "string" ||
        !item.quantity || typeof item.quantity !== "number" ||
        item.quantity < 1 || item.quantity > 100 || !Number.isInteger(item.quantity)
      ) {
        return new Response(JSON.stringify({ error: "Ungültiges Artikelformat" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const listingIds = items.map((i: { listingId: string }) => i.listingId);
    const { data: listings, error: listingsError } = await adminClient
      .from("listings")
      .select("id, title, price, images, status")
      .in("id", listingIds)
      .eq("status", "ACTIVE");

    if (listingsError || !listings || listings.length === 0) {
      return new Response(JSON.stringify({ error: "Ungültige Produkte" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (listings.length !== listingIds.length) {
      return new Response(
        JSON.stringify({ error: "Einige Produkte sind nicht mehr verfügbar" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    let customerId: string | undefined;
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: userEmail,
          metadata: { supabase_user_id: userId },
        });
        customerId = customer.id;
      }
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
      customer_email: customerId ? undefined : userEmail,
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: { allowed_countries: ["DE", "AT", "CH"] },
      phone_number_collection: { enabled: true },
      billing_address_collection: "required",
      success_url: successUrl || `${req.headers.get("origin") || "https://signal-swap-spot.lovable.app"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin") || "https://signal-swap-spot.lovable.app"}/checkout/cancel`,
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
    return new Response(JSON.stringify({ error: "Ein Fehler ist aufgetreten" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
