import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Flame, ArrowUpRight } from "lucide-react";
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
  const savings = hasDiscount ? (listing.originalPrice! - listing.price) : 0;
  const { addItem } = useCart();
  const isLowStock = !isSold && listing.stock > 0 && listing.stock <= 3;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(listing);
    toast.success(`${listing.title.slice(0, 40)}… zum Warenkorb hinzugefügt`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/produkt/${listing.id}`}
        className={`group block relative ${isSold ? "pointer-events-auto" : ""}`}
      >
        <div className="relative rounded-2xl bg-card border border-border/40 overflow-hidden transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.2)]">
          
          {/* Top bar with badges */}
          <div className="flex items-center justify-between px-4 pt-3 pb-0 relative z-10">
            <div className="flex items-center gap-1.5">
              {hasDiscount && !isSold && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  -{discountPercent}%
                </span>
              )}
              {isLowStock && (
                <span className="text-[11px] font-semibold uppercase tracking-wide bg-orange-500/90 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                  <Flame className="h-3 w-3" />
                  Nur {listing.stock}×
                </span>
              )}
            </div>
            {!isSold && (
              <span className="h-7 w-7 rounded-full bg-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight className="h-3.5 w-3.5 text-foreground" strokeWidth={2.5} />
              </span>
            )}
          </div>

          {/* Image */}
          <div className="aspect-[4/3] relative px-6 py-4">
            {listing.images.length > 0 ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className={`w-full h-full object-contain transition-all duration-700 ease-out ${
                  isSold 
                    ? "opacity-30 grayscale blur-[1px]" 
                    : "group-hover:scale-105 group-hover:-rotate-1"
                }`}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/15">
                <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}

            {/* Sold overlay */}
            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground bg-background/70 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                  Ausverkauft
                </span>
              </div>
            )}
          </div>

          {/* Divider line */}
          <div className="mx-4 h-px bg-border/50 group-hover:bg-primary/20 transition-colors duration-500" />

          {/* Info section */}
          <div className="p-4 space-y-2.5">
            <h3 className="text-[13px] font-medium leading-snug line-clamp-2 text-foreground/90 group-hover:text-foreground transition-colors duration-300">
              {listing.title}
            </h3>

            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold tracking-tight font-mono-data whitespace-nowrap">
                    {listing.price.toFixed(2).replace(".", ",")}&nbsp;€
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] text-muted-foreground/50 font-mono-data line-through whitespace-nowrap">
                      {listing.originalPrice!.toFixed(2).replace(".", ",")}&nbsp;€
                    </span>
                  )}
                </div>
                {hasDiscount && !isSold && (
                  <p className="text-[10px] font-semibold text-primary mt-0.5 whitespace-nowrap">
                    Spare {savings.toFixed(2).replace(".", ",")} €
                  </p>
                )}
              </div>

              {/* Add to cart button */}
              {!isSold && (
                <button
                  onClick={handleAddToCart}
                  className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-[0_2px_10px_hsl(var(--primary)/0.3)] hover:shadow-[0_4px_20px_hsl(var(--primary)/0.4)] hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
