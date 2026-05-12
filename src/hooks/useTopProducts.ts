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
      // 1) Fetch all order listing_ids (only completed/shipped/pending count as "ordered")
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("listing_id, status");
      if (ordersError) throw ordersError;

      // Count orders per listing
      const counts = new Map<string, number>();
      (orders ?? []).forEach((o) => {
        if (!o.listing_id) return;
        counts.set(o.listing_id, (counts.get(o.listing_id) ?? 0) + 1);
      });

      // 2) Fetch active listings excluding "zubehoer"
      const { data: listings, error: listingsError } = await supabase
        .from("listings")
        .select(
          "id, title, description, price, original_price, stock, condition, images, specs, seller_id, status, created_at, categories!inner(slug)"
        )
        .eq("status", "ACTIVE")
        .neq("categories.slug", EXCLUDED_CATEGORY_SLUG);
      if (listingsError) throw listingsError;

      const mapped = (listings ?? []).map(mapListing);

      // 3) Sort by order count desc, fallback to created_at desc
      const sorted = mapped
        .map((l) => ({ l, c: counts.get(l.id) ?? 0 }))
        .sort((a, b) => {
          if (b.c !== a.c) return b.c - a.c;
          return new Date(b.l.createdAt).getTime() - new Date(a.l.createdAt).getTime();
        })
        .slice(0, limit)
        .map((x) => x.l);

      return sorted;
    },
    staleTime: 60_000,
  });
}
