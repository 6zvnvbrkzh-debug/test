import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { Listing } from "@/lib/mock-data";

interface ProductCardProps {
  listing: Listing;
  index?: number;
}

export function ProductCard({ listing, index = 0 }: ProductCardProps) {
  const isSold = listing.status === "SOLD" || listing.stock === 0;
  const hasDiscount = listing.originalPrice && listing.originalPrice > listing.price;
  const discountPercent = hasDiscount
    ? Math.round(((listing.originalPrice! - listing.price) / listing.originalPrice!) * 100)
    : 0;
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(listing);
    toast.success(`${listing.title.slice(0, 40)}… hinzugefügt`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/produkt/${listing.id}`}
        className={`group block ${isSold ? "pointer-events-auto" : ""}`}
      >
        {/* Image container */}
        <div className="aspect-square bg-card rounded-xl relative overflow-hidden border border-border/60 mb-3 transition-all duration-500 group-hover:border-primary/20 group-hover:shadow-[0_4px_24px_-6px_hsl(var(--primary)/0.12)]">
          {listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className={`absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-700 ease-out ${
                isSold ? "opacity-40 grayscale" : "group-hover:scale-110"
              }`}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && !isSold && (
            <div className="absolute top-2.5 left-2.5">
              <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded-md shadow-[0_2px_8px_hsl(var(--primary)/0.35)] flex items-center gap-1">
                -{discountPercent}%
              </span>
            </div>
          )}

          {/* Quick actions overlay */}
          {!isSold && (
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-lg hover:bg-primary/90 press-scale transition-all duration-200"
                >
                  <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2} />
                  In den Warenkorb
                </button>
                <span className="h-9 w-9 rounded-lg bg-card/80 backdrop-blur-sm border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </div>
            </div>
          )}

          {/* Sold overlay */}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest bg-card/80 px-3 py-1.5 rounded-md border border-border/50">
                Ausverkauft
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1.5 px-0.5">
          <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary/90 transition-colors duration-300">
            {listing.title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold font-mono-data">
              {listing.price.toFixed(2).replace(".", ",")} €
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground/60 font-mono-data">
                <span className="font-sans mr-0.5">UVP</span>
                <span className="line-through">{listing.originalPrice!.toFixed(2).replace(".", ",")} €</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
