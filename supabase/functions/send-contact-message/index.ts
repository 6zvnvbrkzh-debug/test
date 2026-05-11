// Contact form handler — enqueues message via Lovable Emails
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as ContactPayload;

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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const idempotencyKey = `contact-${crypto.randomUUID()}`;

    const { error } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "contact-message",
        idempotencyKey,
        templateData: { name, email, subject, message },
      },
    });

    if (error) {
      console.error("send-transactional-email error:", error);
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
