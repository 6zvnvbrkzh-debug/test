import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Listing } from "@/lib/mock-data";
import { ConditionBadge } from "./ConditionBadge";

interface ProductCardProps {
  listing: Listing;
  index?: number;
}

export function ProductCard({ listing, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/product/${listing.id}`}
        className="group block rounded-lg border bg-card overflow-hidden transition-signal hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      >
        {/* Image */}
        <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          {/* Price chip */}
          <div className="absolute bottom-2 left-2">
            <span className="font-mono-data text-xs font-medium bg-background/95 backdrop-blur-sm px-2 py-1 rounded-md border shadow-sm">
              €{listing.price.toFixed(2)}
            </span>
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
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
              {listing.sellerName[0]}
            </div>
            <span className="text-xs text-muted-foreground">{listing.sellerName}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
