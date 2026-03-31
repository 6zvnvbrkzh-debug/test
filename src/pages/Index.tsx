import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Truck, ShieldCheck, RotateCcw, Star, Loader2,
  ChevronRight, Zap, Flame, Package, CreditCard, Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useActiveListings } from "@/hooks/useActiveListings";

const categories = [
  { slug: "streaming-box", label: "Streaming Boxen", emoji: "📺", desc: "IPTV & OTT Geräte", count: 0 },
  { slug: "receiver", label: "Receiver", emoji: "📡", desc: "SAT & Kabel Receiver", count: 0 },
  { slug: "accessories", label: "Zubehör", emoji: "🔌", desc: "Kabel, Fernbedienungen & mehr", count: 0 },
];

const trustItems = [
  { icon: Truck, title: "Kostenloser Versand", desc: "Ab 50€ Bestellwert" },
  { icon: ShieldCheck, title: "2 Jahre Garantie", desc: "Auf alle Produkte" },
  { icon: RotateCcw, title: "30 Tage Rückgabe", desc: "Kostenlos & einfach" },
  { icon: Headphones, title: "Persönlicher Support", desc: "Mo–Fr, 9–17 Uhr" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const HomePage = () => {
  const { data: listings = [], isLoading } = useActiveListings();
  const highlights = listings.slice(0, 8);
  const heroProduct = highlights[0];

  const discountProducts = useMemo(
    () =>
      [...listings]
        .filter((l) => l.originalPrice && l.originalPrice > l.price && l.stock > 0)
        .sort(
          (a, b) =>
            (b.originalPrice! - b.price) / b.originalPrice! -
            (a.originalPrice! - a.price) / a.originalPrice!
        ),
    [listings]
  );

  const bestDeal = discountProducts[0];
  const maxDiscount = bestDeal
    ? Math.round(((bestDeal.originalPrice! - bestDeal.price) / bestDeal.originalPrice!) * 100)
    : 0;

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count: listings.filter((l) => l.category === cat.slug).length,
  }));

  const lowStockCount = listings.filter((l) => l.stock > 0 && l.stock <= 3).length;

  return (
    <Layout>
      {/* ─── ANNOUNCEMENT BAR ─── */}
      {(discountProducts.length > 0 || lowStockCount > 0) && (
        <div className="bg-primary text-primary-foreground">
          <div className="container py-2 flex items-center justify-center gap-2 text-xs md:text-sm font-medium">
            <Zap className="h-3.5 w-3.5" />
            {discountProducts.length > 0 ? (
              <span>
                🔥 {discountProducts.length} Produkte im Sale — bis zu{" "}
                <span className="font-bold">{maxDiscount}% Rabatt</span>
              </span>
            ) : (
              <span>⚡ {lowStockCount} Produkte fast ausverkauft — jetzt zugreifen!</span>
            )}
            <Link
              to="/produkte"
              className="underline underline-offset-2 hover:no-underline ml-1"
            >
              Jetzt shoppen →
            </Link>
          </div>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/6 rounded-full blur-[140px] pointer-events-none" />

        <div className="container relative pt-10 md:pt-20 pb-12 md:pb-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Text */}
            <motion.div {...fadeUp(0)}>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
                Premium Hardware
                <br />
                für dein{" "}
                <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                  Streaming.
                </span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mb-8">
                Receiver & Streaming Boxen von Top-Marken. Versandkostenfrei ab
                50€ — mit 2 Jahren Garantie.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link to="/produkte">
                  <Button
                    size="lg"
                    className="font-semibold press-scale transition-signal px-8 shadow-[0_0_28px_-4px_hsl(var(--primary)/0.45)] text-base h-12"
                  >
                    Jetzt entdecken
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {bestDeal && (
                  <Link to={`/produkt/${bestDeal.id}`}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="press-scale transition-signal text-base h-12 border-primary/30 hover:border-primary/60"
                    >
                      <Flame className="mr-1.5 h-4 w-4 text-primary" />
                      Deals ansehen
                    </Button>
                  </Link>
                )}
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/30">
                <div className="flex -space-x-2.5">
                  {["M", "S", "K", "A", "J"].map((letter, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-semibold text-muted-foreground"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                    ))}
                    <span className="text-xs font-semibold ml-1">4.9</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    500+ zufriedene Kunden
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Hero product card */}
            <motion.div {...fadeUp(0.2)} className="relative">
              {heroProduct ? (
                <Link to={`/produkt/${heroProduct.id}`} className="block group">
                  <div className="relative rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                    {/* Gradient bg */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />

                    <div className="p-8 md:p-12">
                      <img
                        src={heroProduct.images[0] || "/placeholder.svg"}
                        alt={heroProduct.title}
                        className="w-full max-w-[260px] md:max-w-[300px] mx-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Info bar at bottom */}
                    <div className="bg-card/80 backdrop-blur-xl border-t border-border/40 px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold line-clamp-1">{heroProduct.title}</p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-lg font-bold font-mono-data text-primary">
                            {heroProduct.price.toFixed(2).replace(".", ",")} €
                          </span>
                          {heroProduct.originalPrice &&
                            heroProduct.originalPrice > heroProduct.price && (
                              <span className="text-xs text-muted-foreground/60 font-mono-data line-through">
                                {heroProduct.originalPrice.toFixed(2).replace(".", ",")} €
                              </span>
                            )}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-card/30 border border-border/40 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section className="border-y border-border/30 bg-surface-sunken">
        <div className="container py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {trustItems.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="container py-12 md:py-20">
        <motion.div {...fadeUp(0.05)}>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Kategorien</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Was suchst du?</h2>
            </div>
            <Link
              to="/produkte"
              className="text-sm text-muted-foreground hover:text-primary transition-signal flex items-center gap-1"
            >
              Alle anzeigen <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {categoriesWithCount.map((cat, i) => (
            <motion.div key={cat.slug} {...fadeUp(0.1 + i * 0.06)}>
              <Link
                to={`/produkte?category=${cat.slug}`}
                className="group flex items-center gap-4 p-5 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-[0_4px_24px_-6px_hsl(var(--primary)/0.12)] transition-all duration-500"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {cat.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {cat.count > 0 && (
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── DEAL HIGHLIGHT ─── */}
      {bestDeal && (
        <section className="container pb-12 md:pb-20">
          <motion.div {...fadeUp(0.1)}>
            <Link to={`/produkt/${bestDeal.id}`} className="block group">
              <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="grid md:grid-cols-2 gap-6 p-6 md:p-10 items-center">
                  {/* Deal image */}
                  <div className="flex items-center justify-center p-4">
                    {bestDeal.images[0] && (
                      <img
                        src={bestDeal.images[0]}
                        alt={bestDeal.title}
                        className="max-w-[200px] md:max-w-[240px] object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>

                  {/* Deal info */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-4 shadow-[0_2px_12px_hsl(var(--primary)/0.4)]">
                      <Flame className="h-3.5 w-3.5" />
                      {maxDiscount}% Rabatt
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">
                      {bestDeal.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {bestDeal.description}
                    </p>
                    <div className="flex items-baseline gap-3 mb-5">
                      <span className="text-2xl font-bold font-mono-data text-primary">
                        {bestDeal.price.toFixed(2).replace(".", ",")} €
                      </span>
                      <span className="text-sm text-muted-foreground/60 font-mono-data line-through">
                        {bestDeal.originalPrice!.toFixed(2).replace(".", ",")} €
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        Du sparst {(bestDeal.originalPrice! - bestDeal.price).toFixed(2).replace(".", ",")} €
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      Jetzt ansehen
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* ─── HIGHLIGHTS GRID ─── */}
      <section className="container pb-16 md:pb-24">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Beliebte Produkte</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Unsere Bestseller</h2>
          </div>
          <Link
            to="/produkte"
            className="text-sm text-muted-foreground hover:text-primary transition-signal flex items-center gap-1"
          >
            Alle Produkte <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
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

        {/* Show all CTA */}
        {!isLoading && listings.length > 8 && (
          <div className="flex justify-center mt-10">
            <Link to="/produkte">
              <Button variant="outline" size="lg" className="press-scale transition-signal">
                Alle {listings.length} Produkte ansehen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* ─── WHY US ─── */}
      <section className="bg-surface-sunken border-y border-border/30">
        <div className="container py-14 md:py-20">
          <motion.div {...fadeUp(0.05)} className="text-center mb-10">
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Warum B.Electronics?</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dein Vorteil bei uns</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: Package,
                title: "Geprüfte Qualität",
                desc: "Jedes Gerät wird vor dem Versand sorgfältig getestet und geprüft.",
              },
              {
                icon: CreditCard,
                title: "Sichere Zahlung",
                desc: "SSL-verschlüsselt via Stripe. Kreditkarte, Apple Pay, Google Pay & mehr.",
              },
              {
                icon: Truck,
                title: "Blitzschneller Versand",
                desc: "Bestellungen bis 14 Uhr werden noch am selben Tag versendet.",
              },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeUp(0.1 + i * 0.08)}>
                <div className="p-6 rounded-xl bg-card border border-border/40 h-full">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="text-sm font-bold mb-1.5">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="container py-16 md:py-24">
        <motion.div {...fadeUp(0.05)} className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
            Bereit für dein neues Setup?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Entdecke unser gesamtes Sortiment und finde das perfekte Streaming-Gerät für dich.
          </p>
          <Link to="/produkte">
            <Button
              size="lg"
              className="font-semibold press-scale transition-signal px-10 h-12 text-base shadow-[0_0_32px_-4px_hsl(var(--primary)/0.4)]"
            >
              Alle Produkte entdecken
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
};

export default HomePage;
