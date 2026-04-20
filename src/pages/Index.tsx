import { useEffect, useMemo } from "react";
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
import { SEOHead } from "@/components/SEOHead";

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://b-electronics.shop/#organization",
      name: "Barbato Electronics",
      url: "https://b-electronics.shop",
      logo: "https://b-electronics.shop/images/b-electronics-logo.webp",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+49-176-22551230",
        contactType: "customer service",
        availableLanguage: "German",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kemptnerstraße 11",
        addressLocality: "Ulm",
        postalCode: "89079",
        addressCountry: "DE",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://b-electronics.shop/#website",
      url: "https://b-electronics.shop",
      name: "Barbato Electronics",
      publisher: { "@id": "https://b-electronics.shop/#organization" },
    },
    {
      "@type": "WebPage",
      "@id": "https://b-electronics.shop/#webpage",
      url: "https://b-electronics.shop",
      name: "Barbato Electronics – Streaming-Hardware & IPTV-Receiver kaufen",
      isPartOf: { "@id": "https://b-electronics.shop/#website" },
      about: { "@id": "https://b-electronics.shop/#organization" },
      description: "Dein Fachhändler für Streaming Boxen, IPTV-Receiver & Zubehör. Top-Marken, schneller Versand & 2 Jahre Garantie.",
    },
  ],
};

const categories = [
  { slug: "highlights", label: "Highlights", emoji: "⭐", desc: "Unsere Top-Empfehlungen", count: 0 },
  { slug: "formuler-geraete", label: "Formuler Geräte", emoji: "📺", desc: "OTT Medien Player & Streaming Boxen", count: 0 },
  { slug: "octagon-geraete", label: "Octagon Geräte", emoji: "📡", desc: "IPTV-Receiver & Streaming Boxen", count: 0 },
  { slug: "zubehoer", label: "Zubehör", emoji: "🔌", desc: "Kopfhörer, Kabel & mehr", count: 0 },
];

const trustItems = [
  { icon: Zap, title: "Blitzschneller Versand", desc: "Bis 14 Uhr bestellt, nächster Tag versendet" },
  { icon: Truck, title: "Kostenloser Versand", desc: "Ab 50€ Bestellwert" },
  { icon: ShieldCheck, title: "2 Jahre Garantie", desc: "Auf alle Produkte" },
  { icon: RotateCcw, title: "30 Tage Rückgabe", desc: "Kostenlos & einfach" },
  { icon: Headphones, title: "Persönlicher Support", desc: "Mo–So, 9–21 Uhr" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const formatPrice = (price: number) => {
  const [euros, cents] = price.toFixed(2).split(".");
  return `${euros},${cents}\u00A0€`;
};

const HomePage = () => {
  const { data: listings = [], isLoading } = useActiveListings();
  const highlights = listings.slice(0, 8);
  const heroProduct = highlights[0];
  const heroImageUrl = heroProduct?.images?.[0];

  // Preload LCP hero image to eliminate resource load delay
  useEffect(() => {
    if (!heroImageUrl) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = heroImageUrl;
    link.fetchPriority = "high";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [heroImageUrl]);

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
      <SEOHead
        title="Streaming-Hardware & IPTV-Receiver kaufen"
        description="Dein Fachhändler für Streaming Boxen, IPTV-Receiver & Zubehör. Top-Marken wie Formuler, schneller Versand aus Deutschland & 2 Jahre Garantie."
        canonical="/"
        jsonLd={homepageJsonLd}
      />
      {/* ─── ANNOUNCEMENT BAR ─── */}
      {(discountProducts.length > 0 || lowStockCount > 0) && (
        <div className="bg-primary text-primary-foreground">
          <div className="container py-2.5 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs md:text-sm font-medium text-center">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 shrink-0" />
              {discountProducts.length > 0 ? (
                <span>
                  🔥 {discountProducts.length} Produkte im Sale — bis zu{" "}
                  <span className="font-bold">{maxDiscount}% Rabatt</span>
                </span>
              ) : (
                <span>⚡ {lowStockCount} Produkte fast ausverkauft!</span>
              )}
            </div>
            <Link
              to="/produkte"
              className="underline underline-offset-2 hover:no-underline"
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
                <a href="https://t.me/bElectronicsshop" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="lg"
                    className="press-scale transition-signal text-base h-12 border-primary/30 hover:border-primary/60 shadow-[0_0_20px_-2px_hsl(var(--primary)/0.35)] hover:shadow-[0_0_28px_-2px_hsl(var(--primary)/0.55)]"
                  >
                    <svg className="mr-1.5 h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    Telegram
                  </Button>
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-2 pt-6 border-t border-border/30">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                  <span className="text-xs font-semibold ml-1">4.9</span>
                </div>
                <span className="text-xs text-muted-foreground">·</span>
                <p className="text-xs text-muted-foreground">
                  100+ zufriedene Kunden
                </p>
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
                        width={300}
                        height={300}
                        fetchPriority="high"
                        decoding="async"
                        loading="eager"
                        className="w-full max-w-[260px] md:max-w-[300px] mx-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Info bar at bottom */}
                    <div className="bg-card/80 backdrop-blur-xl border-t border-border/40 px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold line-clamp-1">{heroProduct.title}</p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-lg font-bold font-mono-data text-primary whitespace-nowrap">
                            {formatPrice(heroProduct.price)}
                          </span>
                          {heroProduct.originalPrice &&
                            heroProduct.originalPrice > heroProduct.price && (
                              <span className="text-xs text-muted-foreground/60 font-mono-data line-through whitespace-nowrap">
                                {formatPrice(heroProduct.originalPrice)}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
            {trustItems.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 p-3 sm:p-0 rounded-lg sm:rounded-none bg-card/50 sm:bg-transparent">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{title}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categoriesWithCount.map((cat, i) => (
            <motion.div key={cat.slug} {...fadeUp(0.1 + i * 0.06)}>
              <Link
                to={`/produkte?category=${cat.slug}`}
                className="group flex flex-col items-center justify-center text-center gap-2 p-4 md:p-5 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-[0_4px_24px_-6px_hsl(var(--primary)/0.12)] transition-all duration-500 aspect-square"
              >
                <span className="text-3xl md:text-3xl">{cat.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {cat.label}
                  </p>
                  <p className="hidden md:block text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                </div>
                {cat.count > 0 && (
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                )}
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
                    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3 mb-5">
                      <span className="text-2xl font-bold font-mono-data text-primary whitespace-nowrap">
                        {formatPrice(bestDeal.price)}
                      </span>
                      <div className="flex items-baseline gap-2 md:gap-3">
                        <span className="text-sm text-muted-foreground/60 font-mono-data line-through whitespace-nowrap">
                          UVP{"\u00A0"}{formatPrice(bestDeal.originalPrice!)}
                        </span>
                        <span className="text-sm font-semibold text-primary whitespace-nowrap">
                          Du{"\u00A0"}sparst{"\u00A0"}{formatPrice(bestDeal.originalPrice! - bestDeal.price)}
                        </span>
                      </div>
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
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Warum Barbato Electronics?</p>
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

      {/* ─── TELEGRAM CTA ─── */}
      <section className="container pb-8 md:pb-12 my-0 px-0">
        <motion.div {...fadeUp(0.05)}>
          <a
            href="https://t.me/bElectronicsshop"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-r from-[hsl(200,80%,50%)]/10 via-[hsl(200,80%,50%)]/5 to-transparent p-6 md:p-8 px-[32px] mt-[16px] mb-[16px]">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="h-14 w-14 rounded-2xl bg-[hsl(200,80%,50%)]/15 flex items-center justify-center shrink-0">
                  <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">
                    Folge uns auf Telegram!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Exklusive Deals, neue Produkte & Rabattcodes — direkt auf dein Handy. 🚀
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold group-hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)] transition-all">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    Jetzt beitreten
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="container py-8 md:py-12">
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
