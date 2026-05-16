import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";

export const GOOGLE_PROFILE_URL = "https://maps.app.goo.gl/SwQjnVqmkFMn3w8U6";
export const GOOGLE_RATING = 5.0;
export const GOOGLE_REVIEW_COUNT = 9;

export interface GoogleReview {
  name: string;
  initial: string;
  rating: number;
  date: string;
  text: string;
  badge?: string;
}

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    name: "Lukas A.",
    initial: "L",
    rating: 5,
    date: "vor 4 Tagen",
    badge: "Local Guide",
    text: "Ich habe bei Barbato Electronics 2 Geräte gekauft und bin absolut begeistert. Der gesamte Ablauf war von Anfang bis Ende perfekt – schnelle Abwicklung, professionelle Beratung und ein wirklich zuverlässiger Service. Kann ich uneingeschränkt weiterempfehlen – jederzeit wieder!",
  },
  {
    name: "Marco Palermo",
    initial: "M",
    rating: 5,
    date: "vor 4 Tagen",
    text: "Top Service und sehr freundlicher Kontakt. Schnelle Hilfe, faire Preise und kompetente Beratung. Kann ich nur weiterempfehlen – komme gerne wieder vorbei! 👍🔧",
  },
  {
    name: "Leonas Fahlbusch",
    initial: "L",
    rating: 5,
    date: "vor 3 Tagen",
    text: "Top Service und super freundlich! Habe dort Elektronik gekauft und bin echt zufrieden. Man merkt direkt, dass sich Zeit genommen wird und nicht einfach nur verkauft wird. Preislich auch vollkommen fair. Würde jederzeit wieder dort kaufen.",
  },
  {
    name: "Thomas Nasemann",
    initial: "T",
    rating: 5,
    date: "vor 4 Tagen",
    text: "Top Ware und schnelle Lieferung – gerne wieder!",
  },
];

function GoogleG({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 0 1 5.47 12c0-.73.13-1.43.36-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

function Stars({ rating, size = "h-3.5 w-3.5" }: { rating: number; size?: string }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

interface Props {
  variant?: "full" | "compact";
  className?: string;
}

export function GoogleReviewsSection({ variant = "full", className = "" }: Props) {
  const reviews = variant === "compact" ? GOOGLE_REVIEWS.slice(0, 2) : GOOGLE_REVIEWS;

  return (
    <section className={`${variant === "full" ? "container py-12 md:py-24" : "mt-12"} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] md:text-xs font-mono-data uppercase tracking-[0.25em] text-primary/80 mb-2 md:mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Echte Kundenstimmen
            </div>
            <h2 className={`tracking-tight ${variant === "full" ? "text-3xl md:text-5xl font-bold" : "text-xl md:text-2xl font-bold"}`}>
              Bewertet mit <span className="text-primary">{GOOGLE_RATING.toFixed(1).replace(".", ",")}</span> auf Google
            </h2>
          </div>
          <a
            href={GOOGLE_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-2xl px-4 md:px-5 py-3 hover:border-primary/40 transition-all group self-start"
          >
            <GoogleG className="h-5 w-5 md:h-6 md:w-6 shrink-0" />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-mono-data text-base md:text-lg font-bold leading-none">{GOOGLE_RATING.toFixed(1).replace(".", ",")}</span>
                <Stars rating={5} size="h-3 w-3" />
              </div>
              <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                {GOOGLE_REVIEW_COUNT}+ Google-Rezensionen
              </div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </a>
        </div>

        {/* Reviews */}
        <div className={`grid gap-4 md:gap-5 ${variant === "full" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"}`}>
          {reviews.map((r, i) => (
            <motion.article
              key={r.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative flex flex-col rounded-2xl border border-border/50 bg-card/60 backdrop-blur-2xl p-5 md:p-6 hover:border-primary/30 transition-colors"
            >
              <div className="absolute top-4 right-4 opacity-70">
                <GoogleG className="h-4 w-4" />
              </div>

              <div className="flex items-center gap-3 mb-3 pr-6">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                  {r.initial}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{r.name}</div>
                  {r.badge && (
                    <div className="text-[10px] text-primary/80 font-mono-data uppercase tracking-wider">{r.badge}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Stars rating={r.rating} />
                <span className="text-[11px] text-muted-foreground">{r.date}</span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6 flex-1">
                {r.text}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-6 md:mt-8 text-center">
          <a
            href={GOOGLE_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Alle Bewertungen auf Google ansehen
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
