import { forwardRef } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface WishlistButtonProps {
  listingId: string;
  variant?: "card" | "detail";
  className?: string;
}

export const WishlistButton = forwardRef<HTMLButtonElement, WishlistButtonProps>(function WishlistButton(
  { listingId, variant = "card", className = "" },
  ref
) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isInWishlist, toggle, isPending } = useWishlist();
  const active = user ? isInWishlist(listingId) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/anmelden");
      return;
    }
    toggle(listingId);
  };

  if (variant === "detail") {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        aria-label={active ? "Von Wunschliste entfernen" : "Zur Wunschliste"}
        className={`inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl border transition-all duration-200 ${
          active
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border/60 bg-background hover:border-primary/40 hover:bg-primary/5"
        } ${className}`}
      >
        <Heart className={`h-5 w-5 ${active ? "fill-primary" : ""}`} strokeWidth={2} />
        <span className="text-sm font-medium">
          {active ? "Gemerkt" : "Merken"}
        </span>
      </button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={handleClick}
      disabled={isPending}
      aria-label={active ? "Von Wunschliste entfernen" : "Zur Wunschliste"}
      className={`h-7 w-7 md:h-8 md:w-8 rounded-full backdrop-blur-md border transition-all duration-200 flex items-center justify-center ${
        active
          ? "bg-primary/15 border-primary/40 text-primary"
          : "bg-background/80 border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40"
      } ${className}`}
    >
      <Heart className={`h-3.5 w-3.5 md:h-4 md:w-4 ${active ? "fill-primary" : ""}`} strokeWidth={2} />
    </motion.button>
  );
}
