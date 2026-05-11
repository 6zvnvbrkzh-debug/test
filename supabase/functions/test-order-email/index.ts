// Temporary: sends a sample order notification email
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!RESEND_API_KEY || !LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "Email keys missing" }), { status: 500, headers: corsHeaders });
  }

  const SHOP_EMAIL = "carlos.gabrail@hotmail.com";
  const FROM_EMAIL = "onboarding@resend.dev";

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111;">
      <h2 style="margin:0 0 16px;font-size:20px;">🛒 Neue Bestellung eingegangen (TEST)</h2>
      <p style="color:#666;font-size:13px;margin:0 0 20px;">Session: cs_test_demo_123</p>

      <h3 style="font-size:14px;margin:20px 0 8px;text-transform:uppercase;letter-spacing:0.5px;color:#666;">Kunde</h3>
      <table style="width:100%;font-size:14px;">
        <tr><td style="padding:4px 0;color:#666;width:120px;">Name:</td><td style="padding:4px 0;font-weight:600;">Max Mustermann</td></tr>
        <tr><td style="padding:4px 0;color:#666;">E-Mail:</td><td style="padding:4px 0;"><a href="mailto:max@example.com">max@example.com</a></td></tr>
        <tr><td style="padding:4px 0;color:#666;">Telefon:</td><td style="padding:4px 0;">+49 170 1234567</td></tr>
      </table>

      <h3 style="font-size:14px;margin:20px 0 8px;text-transform:uppercase;letter-spacing:0.5px;color:#666;">Lieferadresse</h3>
      <div style="font-size:14px;line-height:1.5;">Max Mustermann<br/>Musterstraße 12<br/>10115 Berlin<br/>DE</div>

      <h3 style="font-size:14px;margin:20px 0 8px;text-transform:uppercase;letter-spacing:0.5px;color:#666;">Artikel</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="border-bottom:2px solid #111;">
            <th style="text-align:left;padding:8px 0;">Produkt</th>
            <th style="text-align:center;padding:8px 0;">Menge</th>
            <th style="text-align:right;padding:8px 0;">Summe</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee;">Formuler Z11 Pro Max 4K UHD Android IPTV Box</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">1</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">229.00&nbsp;€</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px 0;text-align:right;font-weight:600;font-size:16px;">Gesamt:</td>
            <td style="padding:12px 0;text-align:right;font-weight:700;font-size:16px;">229.00&nbsp;€</td>
          </tr>
        </tfoot>
      </table>

      <p style="margin-top:24px;color:#999;font-size:12px;">⚠️ Dies ist eine Test-E-Mail — keine echte Bestellung.</p>
    </div>
  `;

  const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Barbato Electronics Bestellungen <${FROM_EMAIL}>`,
      to: [SHOP_EMAIL],
      subject: `🛒 [TEST] Neue Bestellung – 229,00\u00A0€ – Max Mustermann`,
      html,
    }),
  });

  const text = await res.text();
  return new Response(JSON.stringify({ ok: res.ok, status: res.status, body: text }), {
    status: res.ok ? 200 : 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
