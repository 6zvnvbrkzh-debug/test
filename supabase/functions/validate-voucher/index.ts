import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

function jsonRes(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return jsonRes({ error: "Zu viele Versuche. Bitte warte einen Moment." }, 429);
  }

  try {
    const body = await req.json().catch(() => ({}));
    const codeRaw = typeof body?.code === "string" ? body.code : "";
    const orderTotal = Number(body?.orderTotal);
    const code = codeRaw.trim().toUpperCase();

    if (!code || code.length < 3 || code.length > 64) {
      return jsonRes({ valid: false, error: "Bitte gib einen gültigen Gutschein-Code ein." });
    }
    if (!Number.isFinite(orderTotal) || orderTotal < 0) {
      return jsonRes({ valid: false, error: "Ungültiger Bestellbetrag." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Identify the calling user (if any) via the forwarded Authorization header.
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id ?? null;
    }

    const { data: voucher, error } = await supabase
      .from("vouchers")
      .select("id, code, balance, valid_from, valid_until, is_active, user_id")
      .eq("code", code)
      .maybeSingle();

    if (error) {
      console.error("validate-voucher db error", error);
      return jsonRes({ valid: false, error: "Gutschein konnte nicht geprüft werden." });
    }
    if (!voucher) {
      return jsonRes({ valid: false, error: "Gutschein-Code unbekannt." });
    }

    const now = Date.now();
    if (!voucher.is_active) {
      return jsonRes({ valid: false, error: "Dieser Gutschein ist deaktiviert." });
    }
    if (voucher.valid_from && now < new Date(voucher.valid_from).getTime()) {
      return jsonRes({ valid: false, error: "Dieser Gutschein ist noch nicht gültig." });
    }
    if (voucher.valid_until && now > new Date(voucher.valid_until).getTime()) {
      return jsonRes({ valid: false, error: "Dieser Gutschein ist abgelaufen." });
    }

    // Account binding: if voucher already belongs to a user, only they may use it.
    if (voucher.user_id && voucher.user_id !== userId) {
      return jsonRes({
        valid: false,
        error: "Dieser Gutschein ist einem anderen Konto zugeordnet. Bitte melde dich mit dem passenden Konto an.",
      });
    }

    // Bind to current user (claim) if logged in and voucher is unclaimed.
    if (userId && !voucher.user_id) {
      try {
        await supabase.rpc("claim_voucher", { _code: voucher.code, _user_id: userId });
        voucher.user_id = userId;
      } catch (e) {
        console.warn("claim_voucher failed:", (e as Error).message);
      }
    }

    const balance = Number(voucher.balance);
    if (balance <= 0) {
      return jsonRes({ valid: false, error: "Dieser Gutschein hat kein Guthaben mehr." });
    }

    const applicable = Math.min(balance, orderTotal);
    const remainingAfter = Math.max(balance - applicable, 0);

    return jsonRes({
      valid: true,
      code: voucher.code,
      balance,
      applicableAmount: Math.round(applicable * 100) / 100,
      remainingAfter: Math.round(remainingAfter * 100) / 100,
      // True if voucher already bound OR will leave residual balance —
      // in both cases the client must require a logged-in checkout.
      requiresAccount: Boolean(voucher.user_id) || remainingAfter > 0.005,
      boundToCurrentUser: Boolean(userId && voucher.user_id === userId),
    });
  } catch (e) {
    console.error("validate-voucher error", e);
    return jsonRes({ valid: false, error: "Ein Fehler ist aufgetreten." }, 500);
  }
});
