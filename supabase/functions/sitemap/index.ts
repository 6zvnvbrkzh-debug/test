import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const BASE_URL = "https://b-electronics.shop";

const staticPages = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/produkte", changefreq: "daily", priority: "0.9" },
  { loc: "/faq", changefreq: "weekly", priority: "0.6" },
  { loc: "/faq?tab=ratgeber", changefreq: "weekly", priority: "0.6" },
  { loc: "/kontakt", changefreq: "monthly", priority: "0.4" },
  { loc: "/impressum", changefreq: "monthly", priority: "0.3" },
  { loc: "/datenschutz", changefreq: "monthly", priority: "0.3" },
  { loc: "/agb", changefreq: "monthly", priority: "0.3" },
  { loc: "/widerrufsrecht", changefreq: "monthly", priority: "0.3" },
];

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  const { data: listings } = await supabase
    .from("listings")
    .select("id, updated_at")
    .eq("status", "ACTIVE")
    .order("updated_at", { ascending: false });

  const { data: guides } = await supabase
    .from("guides")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  const toW3CDate = (iso: string) => iso.split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  if (listings) {
    for (const listing of listings) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/produkt/${listing.id}</loc>\n`;
      xml += `    <lastmod>${toW3CDate(listing.updated_at)}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }
  }

  if (guides) {
    for (const guide of guides) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/ratgeber/${guide.slug}</loc>\n`;
      xml += `    <lastmod>${toW3CDate(guide.updated_at)}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
});
