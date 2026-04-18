import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select("id, listing_id, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const ids = new Set(items.map((i) => i.listing_id));

  const toggle = useMutation({
    mutationFn: async (listingId: string) => {
      if (!user) throw new Error("AUTH_REQUIRED");
      const exists = items.find((i) => i.listing_id === listingId);
      if (exists) {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("id", exists.id);
        if (error) throw error;
        return { added: false };
      } else {
        const { error } = await supabase
          .from("wishlists")
          .insert({ user_id: user.id, listing_id: listingId });
        if (error) throw error;
        return { added: true };
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", user?.id] });
      toast.success(res.added ? "Zur Wunschliste hinzugefügt" : "Aus Wunschliste entfernt");
    },
    onError: (err: Error) => {
      if (err.message === "AUTH_REQUIRED") {
        toast.error("Bitte zuerst anmelden", {
          description: "Logge dich ein, um Produkte zu speichern.",
        });
      } else {
        toast.error("Fehler", { description: err.message });
      }
    },
  });

  return {
    items,
    ids,
    isLoading,
    isInWishlist: (listingId: string) => ids.has(listingId),
    toggle: (listingId: string) => toggle.mutate(listingId),
    isPending: toggle.isPending,
  };
}
