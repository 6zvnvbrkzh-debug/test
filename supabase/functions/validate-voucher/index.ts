import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple per-IP rate limit
const ipRequests = new Map<string, number[]>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string) {
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

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Zu viele Versuche. Bitte warte einen Moment." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const codeRaw = typeof body?.code === "string" ? body.code : "";
    const orderTotal = Number(body?.orderTotal);
    const code = codeRaw.trim().toUpperCase();

    if (!code || code.length < 3 || code.length > 64) {
      return new Response(
        JSON.stringify({ valid: false, error: "Bitte gib einen gültigen Gutschein-Code ein." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!Number.isFinite(orderTotal) || orderTotal < 0) {
      return new Response(
        JSON.stringify({ valid: false, error: "Ungültiger Bestellbetrag." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: voucher, error } = await supabase
      .from("vouchers")
      .select("id, code, balance, valid_from, valid_until, is_active")
      .eq("code", code)
      .maybeSingle();

    if (error) {
      console.error("validate-voucher db error", error);
      return new Response(
        JSON.stringify({ valid: false, error: "Gutschein konnte nicht geprüft werden." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!voucher) {
      return new Response(
        JSON.stringify({ valid: false, error: "Gutschein-Code unbekannt." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const now = Date.now();
    if (!voucher.is_active) {
      return new Response(
        JSON.stringify({ valid: false, error: "Dieser Gutschein ist deaktiviert." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (voucher.valid_from && now < new Date(voucher.valid_from).getTime()) {
      return new Response(
        JSON.stringify({ valid: false, error: "Dieser Gutschein ist noch nicht gültig." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (voucher.valid_until && now > new Date(voucher.valid_until).getTime()) {
      return new Response(
        JSON.stringify({ valid: false, error: "Dieser Gutschein ist abgelaufen." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const balance = Number(voucher.balance);
    if (balance <= 0) {
      return new Response(
        JSON.stringify({ valid: false, error: "Dieser Gutschein hat kein Guthaben mehr." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Maximum discount = min(balance, orderTotal)
    const applicable = Math.min(balance, orderTotal);

    return new Response(
      JSON.stringify({
        valid: true,
        code: voucher.code,
        balance,
        applicableAmount: Math.round(applicable * 100) / 100,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("validate-voucher error", e);
    return new Response(
      JSON.stringify({ valid: false, error: "Ein Fehler ist aufgetreten." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
