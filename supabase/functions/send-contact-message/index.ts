// Contact form handler — sends customer message to shop owner
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const SHOP_EMAIL = "barbato.electronics@gmail.com";
const FROM_EMAIL = "noreply@info.webstudiocg.de";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as ContactPayload;

    // Server-side validation
    const name = String(body.name ?? "").trim().slice(0, 100);
    const email = String(body.email ?? "").trim().slice(0, 255);
    const subject = String(body.subject ?? "").trim().slice(0, 200);
    const message = String(body.message ?? "").trim().slice(0, 2000);

    if (name.length < 2 || subject.length < 3 || message.length < 10) {
      return new Response(JSON.stringify({ error: "Ungültige Eingaben" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Ungültige E-Mail" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY missing");
      return new Response(
        JSON.stringify({ error: "E-Mail-Service nicht konfiguriert" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const escape = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111;">
        <h2 style="margin:0 0 16px;font-size:18px;">📬 Neue Kontaktanfrage</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">
          <tr><td style="padding:6px 0;color:#666;width:120px;">Name:</td><td style="padding:6px 0;font-weight:600;">${escape(name)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">E-Mail:</td><td style="padding:6px 0;"><a href="mailto:${escape(email)}">${escape(email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#666;">Betreff:</td><td style="padding:6px 0;font-weight:600;">${escape(subject)}</td></tr>
        </table>
        <div style="border-top:1px solid #eee;padding-top:16px;">
          <div style="color:#666;font-size:12px;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">Nachricht</div>
          <div style="white-space:pre-wrap;font-size:14px;line-height:1.6;">${escape(message)}</div>
        </div>
        <p style="margin-top:24px;color:#999;font-size:12px;">Antworte direkt auf diese E-Mail, um dem Kunden zu antworten.</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Barbato Electronics Kontakt <${FROM_EMAIL}>`,
        to: [SHOP_EMAIL],
        reply_to: email,
        subject: `[Kontakt] ${subject}`,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", errText);
      return new Response(JSON.stringify({ error: "E-Mail konnte nicht gesendet werden" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-contact-message error:", err);
    return new Response(JSON.stringify({ error: "Interner Fehler" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
