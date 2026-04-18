import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  sellerId: string;
  reviewerId: string;
  listingId: string;
  listingTitle: string;
}

export function ReviewDialog({
  open,
  onOpenChange,
  orderId,
  sellerId,
  reviewerId,
  listingId,
  listingTitle,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const submit = useMutation({
    mutationFn: async () => {
      if (rating < 1) throw new Error("Bitte wähle eine Sterne-Bewertung");
      const { error } = await supabase.from("reviews").insert({
        order_id: orderId,
        seller_id: sellerId,
        reviewer_id: reviewerId,
        rating,
        comment: comment.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Vielen Dank für deine Bewertung!");
      queryClient.invalidateQueries({ queryKey: ["listing-reviews", listingId] });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["listings-ratings"] });
      onOpenChange(false);
      setRating(0);
      setComment("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Bewertung konnte nicht gespeichert werden");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Produkt bewerten</DialogTitle>
          <DialogDescription className="line-clamp-2">{listingTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => {
                const active = (hover || rating) >= i;
                return (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(i)}
                    className="p-1 transition-transform hover:scale-110"
                    aria-label={`${i} Stern${i > 1 ? "e" : ""}`}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        active ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground h-4">
              {(hover || rating) > 0 && `${hover || rating} von 5 Sternen`}
            </p>
          </div>

          <Textarea
            placeholder="Wie war deine Erfahrung? (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
            maxLength={1000}
          />
          <p className="text-[11px] text-muted-foreground text-right">{comment.length} / 1000</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={() => submit.mutate()} disabled={submit.isPending || rating < 1}>
            {submit.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Bewertung absenden"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
