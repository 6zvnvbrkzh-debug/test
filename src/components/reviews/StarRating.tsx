import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({ value, size = "md", className = "" }: StarRatingProps) {
  const cls = sizeMap[size];
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`Bewertung ${value.toFixed(1)} von 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = value >= i;
        const half = !filled && value >= i - 0.5;
        return (
          <span key={i} className="relative inline-block">
            <Star className={`${cls} text-muted-foreground/30`} strokeWidth={1.5} />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : "50%" }}
              >
                <Star className={`${cls} fill-yellow-400 text-yellow-400`} strokeWidth={1.5} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
