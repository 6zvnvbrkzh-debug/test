import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowLeft, Star, Loader2, FileText } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const { user } = useAuth();

  const [order, setOrder] = useState<any | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Hole die zuletzt bestellte Order des Nutzers (Stripe-Webhook braucht ggf. ein paar Sekunden)
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    let attempts = 0;

    const fetchOrder = async () => {
      attempts += 1;
      setOrderLoading(true);
      let query = supabase
        .from("orders")
        .select("id, listing_id, seller_id, listings(title, images)")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (sessionId) {
        query = supabase
          .from("orders")
          .select("id, listing_id, seller_id, listings(title, images)")
          .eq("buyer_id", user.id)
          .eq("stripe_session_id", sessionId)
          .limit(1);
      }

      const { data } = await query;
      if (cancelled) return;

      if (data && data.length > 0) {
        setOrder(data[0]);
        const { data: existing } = await supabase
          .from("reviews")
          .select("id")
          .eq("order_id", data[0].id)
          .eq("reviewer_id", user.id)
          .maybeSingle();
        if (!cancelled) setAlreadyReviewed(!!existing);
        setOrderLoading(false);
      } else if (attempts < 5) {
        // Webhook hatte vielleicht noch keine Zeit – nochmal in 2s probieren
        setTimeout(fetchOrder, 2000);
      } else {
        setOrderLoading(false);
      }
    };

    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [user, sessionId]);

  return (
    <Layout>
      <SEOHead title="Bestellung erfolgreich" description="Deine Bestellung wurde erfolgreich abgeschlossen." noindex />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
        <div className="text-center max-w-md w-full space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">Bestellung erfolgreich!</h1>
          <p className="text-muted-foreground">
            Vielen Dank für deinen Einkauf. Du erhältst in Kürze eine Bestätigungs-E-Mail.
          </p>
          {sessionId && (
            <p className="text-xs text-muted-foreground font-mono">
              Referenz: {sessionId.slice(0, 20)}...
            </p>
          )}

          {/* Direkt-Bewertung */}
          {user && (
            <div className="rounded-xl border border-border/40 bg-card/40 p-5 text-left space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <h2 className="text-sm font-semibold">Wie war dein Einkauf?</h2>
              </div>
              {orderLoading && !order ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Bestellung wird geladen…
                </div>
              ) : order ? (
                <>
                  <p className="text-xs text-muted-foreground">
                    Teile deine Erfahrung mit{" "}
                    <span className="font-medium text-foreground">
                      {(order.listings as any)?.title || "deinem Produkt"}
                    </span>{" "}
                    – das hilft anderen Käufern enorm.
                  </p>
                  {alreadyReviewed ? (
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      Du hast diese Bestellung bereits bewertet – danke!
                    </p>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setReviewOpen(true)}
                      className="w-full"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Jetzt Produkt bewerten
                    </Button>
                  )}
                  <a
                    href="https://g.page/r/CS7eia0rJYfUEBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-[11px] text-muted-foreground hover:text-primary hover:underline"
                  >
                    Oder den Shop bei Google bewerten →
                  </a>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Du kannst dein Produkt jederzeit in deinem Konto bewerten.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild>
              <Link to="/produkte">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Weiter einkaufen
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zur Startseite
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {order && user && (
        <ReviewDialog
          open={reviewOpen}
          onOpenChange={(o) => {
            setReviewOpen(o);
            if (!o) {
              // Nach Schließen prüfen ob bewertet wurde
              supabase
                .from("reviews")
                .select("id")
                .eq("order_id", order.id)
                .eq("reviewer_id", user.id)
                .maybeSingle()
                .then(({ data }) => setAlreadyReviewed(!!data));
            }
          }}
          orderId={order.id}
          sellerId={order.seller_id}
          reviewerId={user.id}
          listingId={order.listing_id}
          listingTitle={(order.listings as any)?.title || "Produkt"}
        />
      )}
    </Layout>
  );
}
