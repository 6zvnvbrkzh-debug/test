import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { Category, Listing } from "@/lib/mock-data";

const FALLBACK_CATEGORY: Category = "accessories";
const VALID_CATEGORIES: Category[] = ["streaming-box", "receiver", "accessories", "remote"];

const normalizeCategory = (slug?: string | null): Category => {
  if (slug && VALID_CATEGORIES.includes(slug as Category)) {
    return slug as Category;
  }

  return FALLBACK_CATEGORY;
};

const normalizeSpecs = (specs: Json | null): Record<string, string> => {
  if (!specs || Array.isArray(specs) || typeof specs !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(specs).map(([key, value]) => [
      key,
      typeof value === "string" ? value : String(value),
    ])
  );
};

const mapListing = (row: any): Listing => {
  const categoryData = Array.isArray(row.categories) ? row.categories[0] : row.categories;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    condition: row.condition,
    category: normalizeCategory(categoryData?.slug),
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

export function useActiveListings() {
  return useQuery({
    queryKey: ["active-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(
          "id, title, description, price, original_price, condition, images, specs, seller_id, status, created_at, categories(slug)"
        )
        .eq("status", "ACTIVE")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data ?? []).map(mapListing);
    },
    staleTime: 60_000,
  });
}
