import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Listing } from "@/lib/mock-data";
import { ConditionBadge } from "./ConditionBadge";

interface ProductCardProps {
  listing: Listing;
  index?: number;
}

export function ProductCard({ listing, index = 0 }: ProductCardProps) {
  const isSold = listing.status === "SOLD";
  const hasDiscount = listing.originalPrice && listing.originalPrice > listing.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - listing.price / listing.originalPrice!) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/produkt/${listing.id}`}
        className={`group block rounded-lg border bg-card overflow-hidden transition-signal hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${isSold ? "opacity-60" : ""}`}
      >
        {/* Image */}
        <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
          {listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}

          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Ausverkauft</span>
            </div>
          )}

          {hasDiscount && !isSold && (
            <div className="absolute top-2 left-2">
              <span className="text-[11px] font-bold bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-md">
                -{discountPercent}%
              </span>
            </div>
          )}

          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
            <span className="font-mono-data text-xs font-medium bg-background/95 backdrop-blur-sm px-2 py-1 rounded-md border shadow-sm">
              €{listing.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="font-mono-data text-[10px] text-muted-foreground line-through">
                €{listing.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-1.5">
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-signal">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1.5">
            <ConditionBadge condition={listing.condition} />
            <span className="text-[11px] text-muted-foreground capitalize">{listing.category.replace("-", " ")}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
