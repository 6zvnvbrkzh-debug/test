import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Guide {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  reading_time_minutes: number;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Public list of published guides, ordered by sort_order then newest. */
export function usePublishedGuides() {
  return useQuery({
    queryKey: ["guides", "published"],
    queryFn: async (): Promise<Guide[]> => {
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Guide[];
    },
  });
}

/** Single guide by slug (only published; admins should use useGuideById). */
export function useGuideBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["guide", "slug", slug],
    enabled: !!slug,
    queryFn: async (): Promise<Guide | null> => {
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("slug", slug as string)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Guide | null;
    },
  });
}

/** Admin-only: all guides incl. drafts. RLS already restricts this to admins. */
export function useAllGuidesAdmin() {
  return useQuery({
    queryKey: ["guides", "admin", "all"],
    queryFn: async (): Promise<Guide[]> => {
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Guide[];
    },
  });
}
