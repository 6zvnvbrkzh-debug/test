import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { useActiveListings } from "@/hooks/useActiveListings";
import { useListingsRatings } from "@/hooks/useReviews";
import { Heart, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { items, isLoading } = useWishlist();
  const { data: listings = [] } = useActiveListings();

  useEffect(() => {
    if (!authLoading && !user) navigate("/anmelden", { replace: true });
  }, [user, authLoading, navigate]);

  const wishlistListings = useMemo(() => {
    const ids = new Set(items.map((i) => i.listing_id));
    return listings.filter((l) => ids.has(l.id));
  }, [items, listings]);

  const ids = useMemo(() => wishlistListings.map((l) => l.id), [wishlistListings]);
  const { data: ratings = {} } = useListingsRatings(ids);

  return (
    <Layout>
      <SEOHead
        title="Meine Wunschliste | Barbato Electronics"
        description="Deine gemerkten Produkte auf einen Blick."
        canonical="https://webstudiocg.store/wunschliste"
      />

      <section className="container py-12 md:py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Heart className="h-5 w-5 text-primary fill-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meine Wunschliste</h1>
            <p className="text-sm text-muted-foreground">
              {wishlistListings.length === 0
                ? "Noch keine Produkte gemerkt"
                : `${wishlistListings.length} Produkt${wishlistListings.length === 1 ? "" : "e"} gemerkt`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Lade...</div>
        ) : wishlistListings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center">
            <Heart className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold mb-2">Deine Wunschliste ist leer</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Klicke beim Stöbern auf das Herz-Symbol, um Produkte zu speichern.
            </p>
            <Link
              to="/produkte"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Zum Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistListings.map((listing, index) => (
              <ProductCard
                key={listing.id}
                listing={listing}
                index={index}
                rating={ratings[listing.id]}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
