import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Company details (Kleinunternehmer §19 UStG)
const COMPANY = {
  name: "Barbato Electronics",
  owner: "Petros Barbato Manousos",
  street: "Kemptnerstraße 11",
  city: "89079 Ulm",
  country: "Deutschland",
  email: "info@webstudiocg.de",
  phone: "+49 731 16578436",
  vatNote: "Gemäß §19 UStG wird keine Umsatzsteuer berechnet.",
};

const fmtEur = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

interface OrderRow {
  id: string;
  buyer_id: string;
  amount: number;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
  shipping_address: any;
  stripe_session_id: string | null;
  invoice_number: string | null;
  listings: { title: string } | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("order_id");
    const sessionId = url.searchParams.get("session_id");

    if (!orderId && !sessionId) {
      return new Response(JSON.stringify({ error: "order_id or session_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth: try to identify user (optional — guests can use session_id)
    // Token can come from Authorization header OR `?token=` query param
    // (window.open cannot set custom headers, so we accept both).
    const authHeader = req.headers.get("Authorization");
    const tokenParam = url.searchParams.get("token");
    const anonClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
    let userId: string | null = null;
    const token = tokenParam || (authHeader ? authHeader.replace("Bearer ", "") : null);
    if (token) {
      const { data } = await anonClient.auth.getUser(token);
      userId = data.user?.id ?? null;
    }

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Fetch all orders that match. A single Stripe session may produce multiple order rows
    // (one per quantity unit), so for session_id lookups we group them all into one invoice.
    let query = admin
      .from("orders")
      .select(
        "id, buyer_id, amount, created_at, customer_name, customer_email, shipping_address, stripe_session_id, invoice_number, listings(title)",
      )
      .order("created_at", { ascending: true });

    if (orderId) {
      query = query.eq("id", orderId);
    } else {
      query = query.eq("stripe_session_id", sessionId!);
    }

    const { data: orders, error } = await query;
    if (error || !orders || orders.length === 0) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = orders as OrderRow[];
    const primary = rows[0];

    // Authorization check: buyer or admin
    if (userId && userId !== primary.buyer_id) {
      const { data: roleRow } = await admin
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleRow) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    // If no auth at all, require session_id (proves the user just completed checkout)
    if (!userId && !sessionId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get/create invoice number — anchor on first order in the group
    const { data: invNum, error: invErr } = await admin.rpc("get_or_create_invoice_number", { _order_id: primary.id });
    if (invErr) throw invErr;
    const invoiceNumber = invNum as string;

    // Aggregate line items: same listing → bundle qty
    const lineMap = new Map<string, { title: string; qty: number; unit: number }>();
    for (const o of rows) {
      const title = o.listings?.title || "Produkt";
      const key = `${title}|${o.amount}`;
      const ex = lineMap.get(key);
      if (ex) ex.qty += 1;
      else lineMap.set(key, { title, qty: 1, unit: Number(o.amount) });
    }
    const lines = [...lineMap.values()];
    const subtotal = rows.reduce((s, o) => s + Number(o.amount), 0);
    const shippingFee = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shippingFee;

    // Build PDF
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = 210;
    const margin = 20;
    let y = margin;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(COMPANY.name, margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`${COMPANY.owner} · ${COMPANY.street} · ${COMPANY.city}`, margin, y);
    y += 4;
    doc.text(`${COMPANY.email} · ${COMPANY.phone}`, margin, y);
    doc.setTextColor(0);

    // Invoice meta (right side)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Rechnung", pageW - margin, margin, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nr. ${invoiceNumber}`, pageW - margin, margin + 6, { align: "right" });
    doc.text(`Datum: ${fmtDate(primary.created_at)}`, pageW - margin, margin + 11, {
      align: "right",
    });

    // Customer block
    y = 55;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Rechnungsempfänger:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const addr = primary.shipping_address || {};
    const customerLines = [
      primary.customer_name || addr.name || "—",
      addr.line1,
      addr.line2,
      [addr.postal_code, addr.city].filter(Boolean).join(" "),
      addr.country,
      primary.customer_email,
    ].filter(Boolean) as string[];
    for (const line of customerLines) {
      doc.text(line, margin, y);
      y += 4.5;
    }

    // Items table
    y = Math.max(y + 8, 100);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y - 4, pageW - margin * 2, 7, "F");
    doc.text("Pos.", margin + 2, y);
    doc.text("Bezeichnung", margin + 14, y);
    doc.text("Menge", pageW - margin - 55, y, { align: "right" });
    doc.text("Einzelpreis", pageW - margin - 25, y, { align: "right" });
    doc.text("Summe", pageW - margin - 2, y, { align: "right" });
    y += 6;
    doc.setFont("helvetica", "normal");
    let pos = 1;
    for (const ln of lines) {
      doc.text(String(pos++), margin + 2, y);
      const titleLines = doc.splitTextToSize(ln.title, 80);
      doc.text(titleLines, margin + 14, y);
      doc.text(String(ln.qty), pageW - margin - 55, y, { align: "right" });
      doc.text(fmtEur(ln.unit), pageW - margin - 25, y, { align: "right" });
      doc.text(fmtEur(ln.unit * ln.qty), pageW - margin - 2, y, { align: "right" });
      y += Math.max(5, titleLines.length * 5);
    }

    // Totals
    y += 4;
    doc.setDrawColor(220);
    doc.line(pageW - margin - 70, y, pageW - margin, y);
    y += 5;
    doc.text("Zwischensumme:", pageW - margin - 70, y);
    doc.text(fmtEur(subtotal), pageW - margin - 2, y, { align: "right" });
    y += 5;
    doc.text("Versand:", pageW - margin - 70, y);
    doc.text(shippingFee === 0 ? "Kostenlos" : fmtEur(shippingFee), pageW - margin - 2, y, {
      align: "right",
    });
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Gesamtbetrag:", pageW - margin - 70, y);
    doc.text(fmtEur(total), pageW - margin - 2, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    // §19 UStG note
    y += 12;
    doc.setTextColor(80);
    doc.text(COMPANY.vatNote, margin, y);
    y += 5;
    doc.text("Zahlung erfolgte per Kreditkarte/Stripe. Vielen Dank für deinen Einkauf!", margin, y);
    doc.setTextColor(0);

    // Footer
    const footerY = 280;
    doc.setDrawColor(220);
    doc.line(margin, footerY - 4, pageW - margin, footerY - 4);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`${COMPANY.name} · ${COMPANY.owner} · ${COMPANY.street}, ${COMPANY.city}`, pageW / 2, footerY, {
      align: "center",
    });
    doc.text(`${COMPANY.email} · ${COMPANY.phone}`, pageW / 2, footerY + 4, { align: "center" });

    const arrayBuffer = doc.output("arraybuffer");
    const filename = `Rechnung-${invoiceNumber}.pdf`;

    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("generate-invoice error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
