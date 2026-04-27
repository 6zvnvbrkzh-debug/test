import { useMemo } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useListingReviews } from "@/hooks/useReviews";
import { StarRating } from "./StarRating";

interface ReviewsSectionProps {
  listingId: string;
}

export function ReviewsSection({ listingId }: ReviewsSectionProps) {
  const { data: reviews = [], isLoading } = useListingReviews(listingId);

  const { avg, count, distribution } = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const idx = Math.min(5, Math.max(1, r.rating)) - 1;
      dist[idx] += 1;
    });
    return { avg: sum / reviews.length, count: reviews.length, distribution: dist };
  }, [reviews]);

  return (
    <section id="reviews" className="mt-16 pb-8 border-t border-border/40 pt-10 scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight">Kundenbewertungen</h2>
        {count > 0 && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <StarRating value={avg} size="sm" />
            <span className="font-semibold text-foreground">{avg.toFixed(1)}</span>
            <span>·</span>
            <span>{count} {count === 1 ? "Bewertung" : "Bewertungen"}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : count === 0 ? (
        <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Noch keine Bewertungen für dieses Produkt.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Sei der erste, der nach einer Bestellung eine Bewertung abgibt.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Aggregate */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono-data">{avg.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">/ 5</span>
            </div>
            <StarRating value={avg} size="lg" />
            <p className="text-sm text-muted-foreground">
              Basierend auf {count} {count === 1 ? "Bewertung" : "Bewertungen"}
            </p>
            <div className="space-y-1.5 pt-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const c = distribution[star - 1];
                const pct = count > 0 ? (c / count) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-muted-foreground">{c}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-border/40 bg-card/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StarRating value={r.rating} size="sm" />
                    <span className="text-xs font-medium text-foreground">
                      {r.reviewer?.display_name || "Anonym"}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {format(new Date(r.created_at), "dd. MMM yyyy", { locale: de })}
                  </span>
                </div>
                {r.comment && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
