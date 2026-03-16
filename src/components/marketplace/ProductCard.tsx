import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Listing } from "@/lib/mock-data";

interface ProductCardProps {
  listing: Listing;
  index?: number;
}

export function ProductCard({ listing, index = 0 }: ProductCardProps) {
  const isSold = listing.status === "SOLD";
  const hasDiscount = listing.originalPrice && listing.originalPrice > listing.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/produkt/${listing.id}`}
        className={`group block ${isSold ? "opacity-50" : ""}`}
      >
        {/* Image */}
        <div className="aspect-square bg-card rounded-md relative overflow-hidden border mb-3 hover:border-muted-foreground/20 transition-signal">
          {listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
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
            <div className="absolute top-2 left-2">
              <span className="text-sm font-bold bg-primary text-primary-foreground w-10 h-10 rounded-md flex items-center justify-center shadow-lg">
                %
              </span>
            </div>
          )}

          {/* Sold overlay */}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <span className="text-sm font-semibold text-muted-foreground">Ausverkauft</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-foreground/80 transition-signal">
            {listing.title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold">
              {listing.price.toFixed(2).replace(".", ",")} €
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {listing.originalPrice!.toFixed(2).replace(".", ",")} €
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
