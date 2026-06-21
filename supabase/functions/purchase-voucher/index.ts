import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_AMOUNTS = [10, 25, 50, 100];

function genCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 10; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `GIFT-${s.slice(0, 5)}-${s.slice(5)}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body.amount);
    const recipientEmail = typeof body.recipient_email === "string" ? body.recipient_email.trim() : "";

    if (!ALLOWED_AMOUNTS.includes(amount)) {
      return new Response(
        JSON.stringify({ error: "Ungültiger Gutscheinbetrag." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Identify caller — vouchers purchased while logged in are bound to that account.
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id ?? null;
    }

    // Generate a unique code (retry on collision)
    let code = "";
    for (let i = 0; i < 5; i++) {
      const candidate = genCode();
      const { data: existing } = await supabase
        .from("vouchers")
        .select("id")
        .eq("code", candidate)
        .maybeSingle();
      if (!existing) {
        code = candidate;
        break;
      }
    }
    if (!code) throw new Error("Konnte keinen eindeutigen Code generieren");

    // Pre-create voucher (inactive, balance 0) — activated by webhook on payment
    const { data: voucher, error: vErr } = await supabase
      .from("vouchers")
      .insert({
        code,
        balance: 0,
        initial_amount: amount,
        currency: "EUR",
        is_active: false,
        user_id: userId,
        note: `Geschenkgutschein-Kauf (ausstehend)${recipientEmail ? ` – für ${recipientEmail}` : ""}`,
      })
      .select()
      .single();
    if (vErr || !voucher) throw vErr ?? new Error("Voucher-Insert fehlgeschlagen");


    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://b-electronics.shop";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: amount * 100,
            product_data: {
              name: `Barbato Electronics Geschenkgutschein – ${amount}\u00A0€`,
              description: `Aufladbarer Gutschein im Wert von ${amount} €. Code wird nach Zahlung per E-Mail versendet und auf der Bestätigungsseite angezeigt.`,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: recipientEmail || undefined,
      billing_address_collection: "required",
      success_url: `${origin}/checkout/success?gift=1&code=${encodeURIComponent(code)}&amount=${amount}`,
      cancel_url: `${origin}/?gift_cancel=1`,
      metadata: {
        voucher_purchase: "1",
        voucher_id: voucher.id,
        voucher_code: code,
        voucher_amount: String(amount),
        recipient_email: recipientEmail,
      },
    });

    return new Response(JSON.stringify({ url: session.url, code }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("purchase-voucher error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
