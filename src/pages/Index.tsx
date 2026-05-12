import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Truck, ShieldCheck, RotateCcw, Star,
  Zap, Flame, Package, CreditCard, Headphones,
  Tv, Radio, Cable, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useActiveListings } from "@/hooks/useActiveListings";
import { useTopProducts } from "@/hooks/useTopProducts";
import { useShopStats } from "@/hooks/useReviews";
import { SEOHead, BASE_URL } from "@/components/SEOHead";
import { TelegramIcon } from "@/components/icons";
import { getOptimizedImageUrl, getImageSrcSet } from "@/lib/supabase-image";
import categoryHighlights from "@/assets/category-highlights.webp";
import categoryFormuler from "@/assets/category-formuler.webp";
import categoryOctagon from "@/assets/category-octagon.webp";
import categoryZubehoer from "@/assets/category-zubehoer.webp";

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Barbato Electronics",
      url: BASE_URL,
      logo: `${BASE_URL}/images/b-electronics-logo.webp`,
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
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Barbato Electronics",
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${BASE_URL}/#webpage`,
      url: BASE_URL,
      name: "Barbato Electronics – Streaming-Hardware & IPTV-Receiver kaufen",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#organization` },
      description: "Dein Fachhändler für Streaming Boxen, IPTV-Receiver & Zubehör. Top-Marken, schneller Versand & 2 Jahre Garantie.",
    },
  ],
};

const categories = [
  {
    slug: "highlights",
    label: "Highlights",
    desc: "Top-Empfehlungen unserer Kunden",
    icon: Sparkles,
    image: categoryHighlights,
    span: "lg:col-span-7",
    accent: "from-primary/30 via-primary/10 to-transparent",
    count: 0,
  },
  {
    slug: "formuler-geraete",
    label: "Formuler",
    desc: "OTT Medien Player",
    icon: Tv,
    image: categoryFormuler,
    span: "lg:col-span-5",
    accent: "from-primary/20 via-transparent to-transparent",
    count: 0,
  },
  {
    slug: "octagon-geraete",
    label: "Octagon",
    desc: "IPTV-Receiver",
    icon: Radio,
    image: categoryOctagon,
    span: "lg:col-span-5",
    accent: "from-orange-500/20 via-transparent to-transparent",
    count: 0,
  },
  {
    slug: "zubehoer",
    label: "Zubehör",
    desc: "Fernbedienungen, Kabel, Adapter",
    icon: Cable,
    image: categoryZubehoer,
    span: "lg:col-span-7",
    accent: "from-primary/20 via-primary/5 to-transparent",
    count: 0,
  },
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
  const { data: shopStats } = useShopStats();
  const reviewAvg = shopStats && shopStats.count > 0 ? shopStats.avg : 4.9;
  const reviewCount = shopStats?.count ?? 0;
  const highlights = listings.slice(0, 8);
  const heroProduct = highlights[0];
  const heroImageUrl = heroProduct?.images?.[0];

  // Preload LCP hero image as early as possible (during render, not after effect commit)
  // to eliminate the ~4s resource load delay flagged by Lighthouse.
  if (typeof document !== "undefined" && heroImageUrl) {
    const existing = document.head.querySelector(
      `link[rel="preload"][as="image"][href="${heroImageUrl}"]`
    );
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = heroImageUrl;
      link.fetchPriority = "high";
      document.head.appendChild(link);
    }
  }

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
      <section className="relative overflow-hidden bg-noise">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none opacity-60" />
        {/* Aurora orbs */}
        <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-primary/15 rounded-full blur-[160px] pointer-events-none aurora-glow" />
        <div className="absolute top-[100px] right-[-150px] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none aurora-glow" style={{ animationDelay: "-7s" }} />

        <div className="container relative pt-6 md:pt-24 pb-12 md:pb-24">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 md:gap-16 items-center">
            {/* Left: Display Typography + CTA */}
            <motion.div {...fadeUp(0.05)}>
              <h1 className="text-display text-[clamp(40px,12vw,52px)] sm:text-[64px] md:text-[88px] lg:text-[104px] mb-5 md:mb-6">
                <span className="block">Barbato</span>
                <span className="block">
                  <span className="text-stroke">Electronics</span>
                </span>
                <span className="block">
                  <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/40 bg-clip-text text-transparent">
                    Liefert.
                  </span>
                </span>
              </h1>

              <div className="max-w-md mb-7 md:mb-10">
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-px w-8 md:w-10 bg-primary shrink-0" />
                  <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                    Formuler & Octagon Hardware aus deutschem Lager. Bis 14 Uhr bestellt — morgen bei dir.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 md:gap-3 mb-8 md:mb-10">
                <Link to="/produkte" className="flex-1 sm:flex-initial min-w-0">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto font-semibold press-scale transition-signal px-6 md:px-8 shadow-[0_0_32px_-4px_hsl(var(--primary)/0.55)] text-sm md:text-base h-11 md:h-12 group"
                  >
                    Sortiment ansehen
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="https://t.me/bElectronicsshop" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial min-w-0">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto press-scale transition-signal text-sm md:text-base h-11 md:h-12 border-primary/30 hover:border-primary/60 backdrop-blur-sm bg-card/30"
                  >
                    <TelegramIcon className="mr-1.5 h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">Telegram</span>
                  </Button>
                </a>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-3 md:gap-8 max-w-lg">
                <div className="border-l-2 border-primary/40 pl-2.5 md:pl-4">
                  <div className="font-mono-data text-xl md:text-3xl font-bold text-foreground tracking-tight">
                    {reviewAvg.toFixed(1)}<span className="text-muted-foreground/50 text-xs md:text-base">/5</span>
                  </div>
                  <div className="text-[9px] md:text-xs text-muted-foreground uppercase tracking-wider mt-0.5 md:mt-1 truncate">
                    {reviewCount > 0 ? `${reviewCount} Reviews` : "Bewertung"}
                  </div>
                </div>
                <div className="border-l-2 border-primary/40 pl-2.5 md:pl-4">
                  <div className="font-mono-data text-xl md:text-3xl font-bold text-foreground tracking-tight">
                    24<span className="text-primary">h</span>
                  </div>
                  <div className="text-[9px] md:text-xs text-muted-foreground uppercase tracking-wider mt-0.5 md:mt-1">
                    Versand
                  </div>
                </div>
                <div className="border-l-2 border-primary/40 pl-2.5 md:pl-4">
                  <div className="font-mono-data text-xl md:text-3xl font-bold text-foreground tracking-tight">
                    2<span className="text-muted-foreground/50 text-xs md:text-base"> J.</span>
                  </div>
                  <div className="text-[9px] md:text-xs text-muted-foreground uppercase tracking-wider mt-0.5 md:mt-1">
                    Garantie
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Hero product card with scan effect */}
            <motion.div {...fadeUp(0.15)} className="relative lg:justify-self-end w-full max-w-sm md:max-w-md mx-auto lg:mx-0">
              {heroProduct ? (
                <Link to={`/produkt/${heroProduct.id}`} className="block group">
                  <div className="relative rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-[0_20px_80px_-20px_hsl(var(--primary)/0.3)] transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_30px_100px_-20px_hsl(var(--primary)/0.5)]">
                    {/* Corner crosshairs (techy detail) */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-primary/40 z-10" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-primary/40 z-10" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-primary/40 z-10" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-primary/40 z-10" />

                    {/* Gradient bg */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />

                    {/* Image container */}
                    <div className="relative">
                      <div className="p-8 md:p-14">
                        <img
                          src={getOptimizedImageUrl(heroProduct.images[0], { width: 600, quality: 80 }) || "/placeholder.svg"}
                          srcSet={getImageSrcSet(heroProduct.images[0], [400, 600, 800], { quality: 80 })}
                          sizes="(min-width: 1024px) 360px, 280px"
                          alt={heroProduct.title}
                          width={360}
                          height={360}
                          fetchPriority="high"
                          decoding="async"
                          loading="eager"
                          className="w-full max-w-[220px] md:max-w-[340px] mx-auto object-contain drop-shadow-[0_30px_30px_hsl(var(--primary)/0.25)] group-hover:scale-105 group-hover:rotate-[-2deg] transition-transform duration-700"
                        />
                      </div>
                    </div>

                    {/* Spec strip */}
                    <div className="border-t border-border/40 px-5 py-3 flex items-center justify-between text-[10px] font-mono-data uppercase tracking-wider text-muted-foreground/70">
                      <span>SKU · {heroProduct.id.slice(0, 6).toUpperCase()}</span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {heroProduct.stock > 0 ? "Auf Lager" : "Vergriffen"}
                      </span>
                    </div>

                    {/* Info bar at bottom */}
                    <div className="bg-card/80 backdrop-blur-xl border-t border-border/40 px-5 py-4 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">{heroProduct.title}</p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xl font-bold font-mono-data text-primary whitespace-nowrap">
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
                      <div className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-[-12deg] transition-all duration-300 shadow-[0_4px_20px_hsl(var(--primary)/0.4)]">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                /* Skeleton */
                <div className="relative rounded-3xl border border-border/40 bg-card/50 overflow-hidden animate-pulse">
                  <div className="p-10 md:p-14 flex items-center justify-center">
                    <div className="w-full max-w-[280px] md:max-w-[340px] aspect-square rounded-xl bg-muted/60" />
                  </div>
                  <div className="border-t border-border/40 px-5 py-3 h-7 bg-muted/30" />
                  <div className="bg-card/80 border-t border-border/40 px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted/60" />
                      <div className="h-5 w-1/3 rounded bg-muted/60" />
                    </div>
                    <div className="h-11 w-11 rounded-full bg-muted/60 shrink-0" />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRUST MARQUEE ─── */}
      <section className="relative border-y border-border/30 bg-surface-sunken/60 overflow-hidden marquee-pause">
        {/* Side gradients masking ends */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <div className="py-5 md:py-6">
          <div className="marquee">
            {[...trustItems, ...trustItems, ...trustItems].map(({ icon: Icon, title, desc }, i) => (
              <div key={`${title}-${i}`} className="flex items-center gap-3 shrink-0">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight whitespace-nowrap">{title}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug whitespace-nowrap">{desc}</p>
                </div>
                <span className="ml-6 text-muted-foreground/30 text-2xl font-thin select-none">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES (BENTO) ─── */}
      <section className="container py-12 md:py-28">
        <motion.div {...fadeUp(0.05)} className="mb-8 md:mb-14">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono-data uppercase tracking-[0.25em] text-primary/80 mb-2 md:mb-3">
                <span className="h-px w-6 md:w-8 bg-primary/60" />
                01 — Sortiment
              </div>
              <h2 className="text-display text-3xl md:text-6xl tracking-tight">
                Wonach <span className="text-stroke">suchst</span> du?
              </h2>
            </div>
            <Link
              to="/produkte"
              className="group inline-flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-signal"
            >
              <span>Alle Kategorien</span>
              <span className="h-7 w-7 md:h-8 md:w-8 rounded-full border border-border group-hover:border-primary/60 group-hover:bg-primary/10 flex items-center justify-center transition-all">
                <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-12 gap-2.5 md:gap-4 auto-rows-[170px] md:auto-rows-[300px]">
          {categoriesWithCount.map((cat, i) => {
            const Icon = cat.icon;
            const total = categoriesWithCount.length;
            // Mobile layout: avoid orphan cards on the last row.
            // Even total → first AND last span full width (1 - 2 - 2 - … - 1)
            // Odd total → only first spans full width (1 - 2 - 2 - …)
            const isEven = total % 2 === 0;
            const isFullWidth = i === 0 || (isEven && i === total - 1);
            const mobileSpan = isFullWidth ? "col-span-2" : "col-span-1";
            return (
              <motion.div
                key={cat.slug}
                {...fadeUp(0.08 + i * 0.06)}
                className={`${mobileSpan} ${cat.span}`}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
                }}
              >
                <Link
                  to={`/produkte?category=${cat.slug}`}
                  className="bento-card group relative flex flex-col justify-between h-full p-4 md:p-8 rounded-xl md:rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-primary/40 transition-all duration-500"
                >
                  {/* Bg gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                  {/* Background product image */}
                  <img
                    src={cat.image}
                    alt=""
                    aria-hidden
                    width={400}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="absolute -right-4 md:-right-8 -bottom-4 md:-bottom-8 w-[55%] md:w-[60%] max-w-[140px] md:max-w-[280px] object-contain opacity-40 md:opacity-50 group-hover:opacity-90 group-hover:scale-105 group-hover:rotate-[-4deg] transition-all duration-700 pointer-events-none drop-shadow-2xl"
                  />

                  {/* Top: Icon + Counter */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="h-8 w-8 md:h-11 md:w-11 rounded-lg md:rounded-xl bg-card border border-border/60 backdrop-blur-sm flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-500">
                      <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Bottom: Title + arrow */}
                  <div className="relative z-10">
                    <h3 className="text-base md:text-3xl font-bold tracking-tight mb-0.5 md:mb-1 group-hover:text-primary transition-colors duration-500">
                      {cat.label}
                    </h3>
                    <p className="hidden md:block text-sm text-muted-foreground mb-4 max-w-[60%]">{cat.desc}</p>
                    <p className="md:hidden text-[10px] text-muted-foreground/70 mb-2 line-clamp-1 max-w-[70%]">{cat.desc}</p>
                    <div className="inline-flex items-center gap-1 md:gap-1.5 text-[9px] md:text-xs font-mono-data uppercase tracking-[0.15em] text-foreground/80 group-hover:text-primary transition-colors">
                      Entdecken
                      <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── DEAL HIGHLIGHT ─── */}
      {bestDeal && (
        <section className="container pb-8 md:pb-20">
          <motion.div {...fadeUp(0.1)}>
            <Link to={`/produkt/${bestDeal.id}`} className="block group">
              <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="grid md:grid-cols-2 gap-6 p-6 md:p-10 items-center">
                  {/* Deal image */}
                  <div className="flex items-center justify-center p-4">
                    {bestDeal.images[0] && (
                      <img
                        src={getOptimizedImageUrl(bestDeal.images[0], { width: 480, quality: 78 })}
                        srcSet={getImageSrcSet(bestDeal.images[0], [400, 480, 600], { quality: 78 })}
                        sizes="(min-width: 768px) 240px, 200px"
                        alt={bestDeal.title}
                        width={240}
                        height={240}
                        loading="lazy"
                        decoding="async"
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
      <section className="container pb-14 md:pb-28">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-7 md:mb-14">
          <div>
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono-data uppercase tracking-[0.25em] text-primary/80 mb-2 md:mb-3">
              <span className="h-px w-6 md:w-8 bg-primary/60" />
              02 — Bestseller
            </div>
            <h2 className="text-display text-3xl md:text-6xl tracking-tight">
              Was <span className="text-stroke">die meisten</span> kaufen
            </h2>
          </div>
          <Link
            to="/produkte"
            className="group inline-flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-signal"
          >
            <span>Alle Produkte</span>
            <span className="h-7 w-7 md:h-8 md:w-8 rounded-full border border-border group-hover:border-primary/60 group-hover:bg-primary/10 flex items-center justify-center transition-all">
              <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/40 bg-card animate-pulse overflow-hidden">
                <div className="aspect-[4/3] bg-muted/60 m-3 rounded-xl" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-4/5 rounded bg-muted/60" />
                  <div className="h-3 w-3/5 rounded bg-muted/60" />
                  <div className="h-5 w-2/5 rounded bg-muted/60 mt-1" />
                </div>
              </div>
            ))}
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

      {/* ─── WHY US (EDITORIAL) ─── */}
      <section className="relative bg-surface-sunken border-y border-border/30 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-primary/8 rounded-full blur-[180px] pointer-events-none aurora-glow" />

        <div className="container relative py-14 md:py-28">
          <motion.div {...fadeUp(0.05)} className="mb-8 md:mb-20 max-w-3xl">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono-data uppercase tracking-[0.25em] text-primary/80 mb-2 md:mb-3">
              <span className="h-px w-6 md:w-8 bg-primary/60" />
              03 — Warum wir
            </div>
            <h2 className="text-display text-3xl md:text-6xl tracking-tight">
              Kein Marketplace.<br />
              <span className="text-stroke">Ein Fachhändler.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/50 border border-border/50 rounded-xl md:rounded-2xl overflow-hidden">
            {[
              {
                num: "01",
                icon: Package,
                title: "Geprüfte Qualität",
                desc: "Jedes Gerät wird in Ulm ausgepackt, geflasht, gegen Defekte getestet und neu verpackt — kein Reseller-Karussell.",
              },
              {
                num: "02",
                icon: CreditCard,
                title: "Sichere Zahlung",
                desc: "Stripe-Checkout mit PCI-DSS Zertifikat. Visa, Mastercard, PayPal, Klarna, Apple Pay, Google Pay, SEPA.",
              },
              {
                num: "03",
                icon: Truck,
                title: "DHL aus Deutschland",
                desc: "Bestellung bis 14 Uhr → DHL-Versand am selben Werktag. Paket-Tracking inklusive, versichert.",
              },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeUp(0.1 + i * 0.08)} className="bg-card group relative p-6 md:p-10 hover:bg-surface-sunken transition-colors duration-500">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <span className="font-mono-data text-[10px] md:text-xs uppercase tracking-[0.25em] text-muted-foreground/70">
                    {item.num}
                  </span>
                  <div className="h-10 w-10 md:h-11 md:w-11 rounded-lg md:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    <item.icon className="h-4 w-4 md:h-5 md:w-5 text-primary group-hover:text-primary-foreground transition-colors" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-lg md:text-2xl font-bold tracking-tight mb-2 md:mb-3">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                {/* Bottom progress line */}
                <div className="mt-6 md:mt-8 h-px bg-border relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-0 group-hover:w-full bg-primary transition-all duration-700" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TELEGRAM CTA ─── */}
      <section className="container pb-6 md:pb-12">
        <motion.div {...fadeUp(0.05)}>
          <a
            href="https://t.me/bElectronicsshop"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-r from-[hsl(200,80%,50%)]/10 via-[hsl(200,80%,50%)]/5 to-transparent p-4 md:p-8">
              <div className="flex flex-row items-center gap-3 md:gap-6">
                <div className="h-11 w-11 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-[hsl(200,80%,50%)]/15 flex items-center justify-center shrink-0">
                  <TelegramIcon className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h3 className="text-sm md:text-xl font-bold tracking-tight mb-0.5 md:mb-1 group-hover:text-primary transition-colors">
                    Folge uns auf Telegram!
                  </h3>
                  <p className="text-[11px] md:text-sm text-muted-foreground line-clamp-2 md:line-clamp-none">
                    Exklusive Deals, neue Produkte & Rabattcodes — direkt auf dein Handy.
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-primary text-primary-foreground text-xs md:text-sm font-semibold group-hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)] transition-all">
                    <span className="hidden md:inline">Jetzt beitreten</span>
                    <span className="md:hidden">Beitreten</span>
                    <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative container py-12 md:py-28">
        <motion.div {...fadeUp(0.05)} className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-border/50 bg-card">
          <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none opacity-50" />
          <div className="absolute -bottom-20 -left-20 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-primary/15 rounded-full blur-[100px] md:blur-[120px] pointer-events-none aurora-glow" />
          <div className="absolute -top-20 -right-20 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-primary/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none aurora-glow" style={{ animationDelay: "-5s" }} />

          <div className="relative p-6 md:p-16 lg:p-24 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] md:text-xs font-mono-data uppercase tracking-[0.25em] text-primary/80 mb-4 md:mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Bereit zum Setup
            </div>
            <h2 className="text-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight mb-4 md:mb-6 max-w-3xl mx-auto">
              Dein nächster <span className="bg-gradient-to-r from-primary to-primary/40 bg-clip-text text-transparent">Receiver</span> ist nur einen Klick entfernt.
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto mb-7 md:mb-10">
              Bestelle jetzt — bis 14 Uhr versendet, in 1–2 Werktagen bei dir, mit 30 Tagen Rückgaberecht.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 md:gap-3">
              <Link to="/produkte">
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-semibold press-scale transition-signal px-6 md:px-10 h-11 md:h-12 text-sm md:text-base shadow-[0_0_40px_-4px_hsl(var(--primary)/0.5)] group"
                >
                  Alle Produkte entdecken
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/faq">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto press-scale transition-signal text-sm md:text-base h-11 md:h-12 border-border hover:border-primary/50 backdrop-blur-sm"
                >
                  Häufige Fragen
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default HomePage;
