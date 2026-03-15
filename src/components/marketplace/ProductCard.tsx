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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.2, 0, 0, 1] }}
    >
      <Link
        to={`/product/${listing.id}`}
        className="group block rounded-lg border bg-card transition-signal hover:shadow-lg hover:shadow-signal-glow/5"
      >
        {/* Image */}
        <div className="aspect-square rounded-t-lg bg-muted relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          {/* Price overlay */}
          <div className="absolute top-2 right-2">
            <span className="font-mono text-sm font-medium bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md border">
              ${listing.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-signal">
              {listing.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <ConditionBadge condition={listing.condition} />
            <span className="text-xs text-muted-foreground capitalize">{listing.category.replace("-", " ")}</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground">
              {listing.sellerName[0]}
            </div>
            <span className="text-xs text-muted-foreground">{listing.sellerName}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
