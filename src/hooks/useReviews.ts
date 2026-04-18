import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_id: string;
  order_id: string;
  reviewer?: { display_name: string | null } | null;
}

/**
 * Lädt alle Reviews für ein Listing.
 * Da Reviews nicht direkt mit listings, sondern mit orders verknüpft sind,
 * holen wir zuerst alle order_ids für das Listing und dann die zugehörigen Reviews.
 */
export function useListingReviews(listingId: string | undefined) {
  return useQuery({
    queryKey: ["listing-reviews", listingId],
    enabled: !!listingId,
    queryFn: async () => {
      // 1) Alle Bestell-IDs zum Listing
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id")
        .eq("listing_id", listingId!);

      if (ordersError) throw ordersError;
      const orderIds = (orders ?? []).map((o) => o.id);
      if (orderIds.length === 0) return [] as ReviewRow[];

      // 2) Reviews zu diesen Bestellungen
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, reviewer_id, order_id")
        .in("order_id", orderIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const reviews = data ?? [];
      if (reviews.length === 0) return [] as ReviewRow[];

      // 3) Anzeigenamen der Reviewer (Profile sind public lesbar)
      const reviewerIds = Array.from(new Set(reviews.map((r) => r.reviewer_id)));
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", reviewerIds);

      const profileMap = new Map(
        (profiles ?? []).map((p) => [p.user_id, p.display_name])
      );

      return reviews.map((r) => ({
        ...r,
        reviewer: { display_name: profileMap.get(r.reviewer_id) ?? null },
      })) as ReviewRow[];
    },
    staleTime: 60_000,
  });
}

/**
 * Aggregiert Bewertungen pro Listing (Durchschnitt + Anzahl) für eine Liste von Listings.
 * Wird auf der Shop-Übersicht eingesetzt.
 */
export function useListingsRatings(listingIds: string[]) {
  return useQuery({
    queryKey: ["listings-ratings", [...listingIds].sort().join(",")],
    enabled: listingIds.length > 0,
    queryFn: async () => {
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, listing_id")
        .in("listing_id", listingIds);

      if (ordersError) throw ordersError;
      const orderToListing = new Map(
        (orders ?? []).map((o) => [o.id, o.listing_id])
      );
      const orderIds = Array.from(orderToListing.keys());
      if (orderIds.length === 0) return {} as Record<string, { avg: number; count: number }>;

      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("rating, order_id")
        .in("order_id", orderIds);

      if (error) throw error;

      const acc: Record<string, { sum: number; count: number }> = {};
      (reviews ?? []).forEach((r) => {
        const lid = orderToListing.get(r.order_id);
        if (!lid) return;
        if (!acc[lid]) acc[lid] = { sum: 0, count: 0 };
        acc[lid].sum += r.rating;
        acc[lid].count += 1;
      });

      const result: Record<string, { avg: number; count: number }> = {};
      Object.entries(acc).forEach(([lid, { sum, count }]) => {
        result[lid] = { avg: sum / count, count };
      });
      return result;
    },
    staleTime: 60_000,
  });
}
