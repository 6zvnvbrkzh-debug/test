import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/reviews/StarRating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Search, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_id: string;
  seller_id: string;
  order_id: string;
};

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ReviewRow[];
    },
  });

  const reviewerIds = Array.from(new Set(reviews?.map((r) => r.reviewer_id) ?? []));
  const orderIds = Array.from(new Set(reviews?.map((r) => r.order_id) ?? []));

  const { data: profiles } = useQuery({
    queryKey: ["admin-reviews-profiles", reviewerIds],
    queryFn: async () => {
      if (reviewerIds.length === 0) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", reviewerIds);
      if (error) throw error;
      return data;
    },
    enabled: reviewerIds.length > 0,
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-reviews-orders", orderIds],
    queryFn: async () => {
      if (orderIds.length === 0) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("id, listing_id, customer_email, customer_name")
        .in("id", orderIds);
      if (error) throw error;
      return data;
    },
    enabled: orderIds.length > 0,
  });

  const listingIds = Array.from(new Set(orders?.map((o) => o.listing_id) ?? []));

  const { data: listings } = useQuery({
    queryKey: ["admin-reviews-listings", listingIds],
    queryFn: async () => {
      if (listingIds.length === 0) return [];
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, images")
        .in("id", listingIds);
      if (error) throw error;
      return data;
    },
    enabled: listingIds.length > 0,
  });

  const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) ?? []);
  const orderMap = new Map(orders?.map((o) => [o.id, o]) ?? []);
  const listingMap = new Map(listings?.map((l) => [l.id, l]) ?? []);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bewertung gelöscht");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setToDelete(null);
    },
    onError: (err: Error) => {
      toast.error("Fehler beim Löschen", { description: err.message });
    },
  });

  const filtered = reviews?.filter((r) => {
    if (filterRating !== null && r.rating !== filterRating) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const order = orderMap.get(r.order_id);
    const listing = order ? listingMap.get(order.listing_id) : null;
    const profile = profileMap.get(r.reviewer_id);
    return (
      r.comment?.toLowerCase().includes(q) ||
      listing?.title?.toLowerCase().includes(q) ||
      profile?.display_name?.toLowerCase().includes(q) ||
      order?.customer_email?.toLowerCase().includes(q) ||
      order?.customer_name?.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: reviews?.length ?? 0,
    avg: reviews?.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2)
      : "—",
    withComment: reviews?.filter((r) => r.comment?.trim()).length ?? 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bewertungen verwalten</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Moderiere alle Kundenbewertungen — entferne unangemessene Inhalte.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Bewertungen gesamt</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.avg}</div>
              <div className="text-xs text-muted-foreground">Durchschnittsrating</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.withComment}</div>
              <div className="text-xs text-muted-foreground">Mit Kommentar</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Kommentar, Produkt, Kunde..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1">
            <Button
              variant={filterRating === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRating(null)}
            >
              Alle
            </Button>
            {[5, 4, 3, 2, 1].map((n) => (
              <Button
                key={n}
                variant={filterRating === n ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRating(n)}
                className="gap-1"
              >
                {n} <Star className="h-3 w-3 fill-current" />
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* List */}
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Lade Bewertungen...</div>
      ) : filtered?.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Keine Bewertungen gefunden.
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered?.map((r) => {
            const order = orderMap.get(r.order_id);
            const listing = order ? listingMap.get(order.listing_id) : null;
            const profile = profileMap.get(r.reviewer_id);
            const reviewerName =
              profile?.display_name ||
              order?.customer_name ||
              order?.customer_email?.split("@")[0] ||
              "Anonym";

            return (
              <Card key={r.id} className="p-4">
                <div className="flex items-start gap-4">
                  {listing?.images?.[0] && (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-16 w-16 rounded-lg object-cover border border-border/30 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {listing?.title ?? "Unbekanntes Produkt"}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={r.rating} size="sm" />
                          <Badge variant="secondary" className="text-[10px]">
                            {r.rating}/5
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setToDelete(r.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {r.comment && (
                      <p className="text-sm text-foreground/80 mb-2 whitespace-pre-wrap break-words">
                        {r.comment}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>Von: <strong className="text-foreground/70">{reviewerName}</strong></span>
                      {order?.customer_email && (
                        <span className="truncate">{order.customer_email}</span>
                      )}
                      <span>
                        {formatDistanceToNow(new Date(r.created_at), {
                          addSuffix: true,
                          locale: de,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bewertung löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Die Bewertung wird
              dauerhaft entfernt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDelete && deleteMutation.mutate(toDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
