import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { Category, Listing } from "@/lib/mock-data";

const VALID_CATEGORIES: Category[] = ["formuler-geraete", "octagon-geraete", "zubehoer", "highlights"];
const EXCLUDED_CATEGORY_SLUG = "zubehoer";

const normalizeCategory = (slug?: string | null): Category =>
  slug && VALID_CATEGORIES.includes(slug as Category) ? (slug as Category) : "zubehoer";

const normalizeSpecs = (specs: Json | null): Record<string, string> => {
  if (!specs || Array.isArray(specs) || typeof specs !== "object") return {};
  return Object.fromEntries(
    Object.entries(specs).map(([k, v]) => [k, typeof v === "string" ? v : String(v)])
  );
};

const mapListing = (row: any): Listing => {
  const cat = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    condition: row.condition,
    category: normalizeCategory(cat?.slug),
    images: row.images ?? [],
    specs: normalizeSpecs(row.specs),
    sellerId: row.seller_id,
    sellerName: "",
    sellerAvatar: undefined,
    status: row.status,
    createdAt: row.created_at,
    stock: row.stock ?? 0,
  };
};

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: ["top-products", limit],
    queryFn: async (): Promise<Listing[]> => {
      // 1) Sales counts per listing
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("listing_id, status");
      if (ordersError) throw ordersError;

      const salesCounts = new Map<string, number>();
      (orders ?? []).forEach((o) => {
        if (!o.listing_id) return;
        salesCounts.set(o.listing_id, (salesCounts.get(o.listing_id) ?? 0) + 1);
      });

      // 2) View counts per listing
      const { data: viewRows } = await supabase
        .from("listing_view_counts")
        .select("listing_id, views");

      const viewCounts = new Map<string, number>();
      (viewRows ?? []).forEach((v: any) => {
        viewCounts.set(v.listing_id, Number(v.views) ?? 0);
      });

      // 3) Active listings excluding "zubehoer"
      const { data: listings, error: listingsError } = await supabase
        .from("listings")
        .select(
          "id, title, description, price, original_price, stock, condition, images, specs, seller_id, status, created_at, categories!inner(slug)"
        )
        .eq("status", "ACTIVE")
        .neq("categories.slug", EXCLUDED_CATEGORY_SLUG);
      if (listingsError) throw listingsError;

      const mapped = (listings ?? []).map(mapListing);

      // 4) Combined popularity score: each sale weighs 5× a view
      const SALE_WEIGHT = 5;
      const sorted = mapped
        .map((l) => {
          const sales = salesCounts.get(l.id) ?? 0;
          const views = viewCounts.get(l.id) ?? 0;
          return { l, score: sales * SALE_WEIGHT + views };
        })
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(b.l.createdAt).getTime() - new Date(a.l.createdAt).getTime();
        })
        .slice(0, limit)
        .map((x) => x.l);

      return sorted;
    },
    staleTime: 60_000,
  });
}
