import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Star, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useActiveListings } from "@/hooks/useActiveListings";

const categories = [
  { slug: "streaming-box", label: "Streaming Boxen", emoji: "📺", desc: "IPTV & OTT Geräte" },
  { slug: "receiver", label: "Receiver", emoji: "📡", desc: "SAT & Kabel Receiver" },
  { slug: "accessories", label: "Zubehör", emoji: "🔌", desc: "Kabel, Fernbedienungen & mehr" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const HomePage = () => {
  const { data: listings = [], isLoading } = useActiveListings();
  const highlights = listings.slice(0, 4);
  const heroProduct = highlights[0];

  const discountProducts = listings.filter(
    (l) => l.originalPrice && l.originalPrice > l.price && l.stock > 0
  );
  const bestDeal = discountProducts.sort(
    (a, b) =>
      ((b.originalPrice! - b.price) / b.originalPrice!) -
      ((a.originalPrice! - a.price) / a.originalPrice!)
  )[0];

  return (
    <Layout>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative pt-10 md:pt-20 pb-10 md:pb-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text side */}
            <motion.div {...fadeUp} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Neue Produkte verfügbar
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
                Dein Setup.
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Dein Streaming.
                </span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mb-7">
                Premium Receiver & Streaming Boxen von Octagon und Formuler — versandkostenfrei ab 50€.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link to="/produkte">
                  <Button size="lg" className="font-semibold press-scale transition-signal px-8 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)] text-base">
                    Jetzt shoppen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {bestDeal && (
                  <Link to={`/produkt/${bestDeal.id}`}>
                    <Button variant="outline" size="lg" className="press-scale transition-signal text-base">
                      🔥 Bis zu {Math.round(((bestDeal.originalPrice! - bestDeal.price) / bestDeal.originalPrice!) * 100)}% sparen
                    </Button>
                  </Link>
                )}
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border/30">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground"
                    >
                      {["M", "S", "K", "A"][i - 1]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Vertraut von 500+ Kunden
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Product showcase */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {heroProduct ? (
                <Link to={`/produkt/${heroProduct.id}`} className="block group">
                  <div className="relative rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 md:p-10 overflow-hidden">
                    {/* Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                    <img
                      src={heroProduct.images[0] || "/placeholder.svg"}
                      alt={heroProduct.title}
                      className="w-full max-w-[280px] md:max-w-xs mx-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Price tag */}
                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-card/90 backdrop-blur-md border border-border/60 rounded-xl px-4 py-3 shadow-lg">
                      <p className="text-xs text-muted-foreground mb-0.5 line-clamp-1">{heroProduct.title}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold font-mono-data">
                          {heroProduct.price.toFixed(2).replace(".", ",")} €
                        </span>
                        {heroProduct.originalPrice && heroProduct.originalPrice > heroProduct.price && (
                          <span className="text-xs text-muted-foreground/60 font-mono-data line-through">
                            {heroProduct.originalPrice.toFixed(2).replace(".", ",")} €
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="aspect-square rounded-2xl bg-card/30 border border-border/40 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section className="border-y border-border/30 bg-surface-sunken">
        <div className="container py-4 md:py-5">
          <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap">
            {[
              { icon: Truck, label: "Kostenloser Versand ab 50€" },
              { icon: ShieldCheck, label: "2 Jahre Garantie" },
              { icon: RotateCcw, label: "30 Tage Rückgaberecht" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="container py-12 md:py-20">
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Kategorien</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Was suchst du?</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              {...fadeUp}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
            >
              <Link
                to={`/produkte?category=${cat.slug}`}
                className="group flex items-center gap-4 p-4 md:p-5 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-[0_4px_24px_-6px_hsl(var(--primary)/0.12)] transition-all duration-400"
              >
                <span className="text-2xl md:text-3xl">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{cat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── HIGHLIGHTS ─── */}
      <section className="container pb-16 md:pb-24">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Unsere Auswahl</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Beliebte Produkte</h2>
          </div>
          <Link
            to="/produkte"
            className="text-sm text-muted-foreground hover:text-primary transition-signal flex items-center gap-1"
          >
            Alle <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {highlights.map((listing, index) => (
              <ProductCard key={listing.id} listing={listing} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="container pb-16 md:pb-24">
        <Link to="/produkte" className="block group">
          <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-14 overflow-hidden hover:border-primary/40 hover:shadow-[0_0_48px_-12px_hsl(var(--primary)/0.2)] transition-all duration-500">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <p className="text-xs text-primary tracking-widest uppercase font-semibold mb-3">Komplettes Sortiment</p>
            <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors duration-400">
              Alle Produkte entdecken
            </h3>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mb-6">
              Streaming Boxen, Receiver und Zubehör — alles für dein Entertainment Setup.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Zum Shop
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-400" />
            </span>
          </div>
        </Link>
      </section>
    </Layout>
  );
};

export default HomePage;
