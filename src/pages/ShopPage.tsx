import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEOHead, BASE_URL } from "@/components/SEOHead";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useActiveListings } from "@/hooks/useActiveListings";
import { useListingsRatings } from "@/hooks/useReviews";
import type { Category } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Loader2, Truck, ShieldCheck, RotateCcw, Flame, SlidersHorizontal, Search, X } from "lucide-react";

const categoryOptions = [
  { value: "all", label: "Alle Produkte", emoji: "🔥" },
  { value: "highlights", label: "Highlights", emoji: "⭐" },
  { value: "formuler-geraete", label: "Formuler Geräte", emoji: "📺" },
  { value: "octagon-geraete", label: "Octagon Geräte", emoji: "📡" },
  { value: "zubehoer", label: "Zubehör", emoji: "🔌" },
];

const sortOptions = [
  { value: "popular", label: "Neueste zuerst" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "price-asc", label: "Niedrigster Preis" },
  { value: "price-desc", label: "Höchster Preis" },
];

const trustBadges = [
  { icon: Truck, text: "Kostenloser Versand ab 50€" },
  { icon: ShieldCheck, text: "2 Jahre Garantie" },
  { icon: RotateCcw, text: "14 Tage Rückgaberecht" },
];

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") as Category | null;
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat || "all");
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const { data: listings = [], isLoading } = useActiveListings();
  const { data: ratings = {} } = useListingsRatings(listings.map((l) => l.id));

  const priceMin = listings.length > 0 ? Math.floor(Math.min(...listings.map((l) => l.price))) : 0;
  const priceMax = listings.length > 0 ? Math.ceil(Math.max(...listings.map((l) => l.price))) : 500;
  const activePriceRange = priceRange ?? [priceMin, priceMax];

  const filtered = useMemo(() => {
    let results = [...listings];

    if (selectedCategory !== "all") {
      results = results.filter((listing) => listing.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      results = results.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.description ?? "").toLowerCase().includes(q)
      );
    }

    if (priceRange) {
      results = results.filter((l) => l.price >= priceRange[0] && l.price <= priceRange[1]);
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return 0; // keep DB order (newest first)
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return results;
  }, [listings, selectedCategory, sortBy]);

  const discountCount = filtered.filter(
    (l) => l.originalPrice && l.originalPrice > l.price
  ).length;

  return (
    <Layout>
      <SEOHead
        title="Shop – Alle Produkte"
        description="Entdecke Streaming Boxen, IPTV-Receiver & Zubehör. Günstige Preise, schneller Versand aus Deutschland & 2 Jahre Garantie."
        canonical="/produkte"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Shop", item: `${BASE_URL}/produkte` },
          ],
        }}
      />
      {/* Trust bar */}
      <div className="border-b border-border/40 bg-surface-sunken">
        <div className="container py-3">
          <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
            {trustBadges.map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <badge.icon className="h-4 w-4 text-primary" strokeWidth={2} />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-signal">Start</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Produkte</span>
        </div>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Alle Produkte
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl">
            Premium Streaming-Hardware zu unschlagbaren Preisen.
            {discountCount > 0 && (
              <span className="text-primary font-semibold ml-1">
                {discountCount} {discountCount === 1 ? "Angebot" : "Angebote"} verfügbar!
              </span>
            )}
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Produkt oder Modell suchen… z.B. Formuler Z10"
            className="pl-10 pr-10 h-11 bg-card border-border/60 focus-visible:ring-primary/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Suche löschen"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Price filter */}
        {!isLoading && listings.length > 0 && priceMin < priceMax && (
          <div className="mb-4 p-4 rounded-xl bg-card border border-border/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                Preis
              </span>
              <div className="flex items-center gap-2 text-sm font-mono-data">
                <span className="text-primary font-semibold">{activePriceRange[0]}€</span>
                <span className="text-muted-foreground">–</span>
                <span className="text-primary font-semibold">{activePriceRange[1]}€</span>
                {priceRange && (
                  <button
                    onClick={() => setPriceRange(null)}
                    className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Preisfilter zurücksetzen"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <Slider
              min={priceMin}
              max={priceMax}
              step={1}
              value={activePriceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              className="w-full"
            />
          </div>
        )}

        {/* Category pills + sort */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Category pills */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {categoryOptions.map((option) => {
              const isActive = selectedCategory === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedCategory(option.value)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 press-scale
                    ${isActive
                      ? "bg-primary text-primary-foreground shadow-[0_2px_12px_hsl(var(--primary)/0.35)]"
                      : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }
                  `}
                >
                  <span className="mr-1.5">{option.emoji}</span>
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Sort + count */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {filtered.length} {filtered.length === 1 ? "Produkt" : "Produkte"}
            </span>
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-card border-border/60 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Promo banner for deals */}
        {discountCount > 0 && selectedCategory === "all" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 md:p-5 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                🔥 {discountCount} Produkte im Angebot — spare bis zu{" "}
                {Math.max(
                  ...filtered
                    .filter((l) => l.originalPrice && l.originalPrice > l.price)
                    .map((l) => Math.round(((l.originalPrice! - l.price) / l.originalPrice!) * 100))
                )}
                %
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Solange der Vorrat reicht. Nur für kurze Zeit.
              </p>
            </div>
          </motion.div>
        )}

        {/* Product grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + sortBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
            >
              {filtered.map((listing, index) => (
                <ProductCard
                  key={listing.id}
                  listing={listing}
                  index={index}
                  rating={ratings[listing.id]}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground font-medium">
              {searchQuery
                ? `Kein Produkt für „${searchQuery}" gefunden`
                : "Keine Produkte in dieser Kategorie"}
            </p>
            <div className="flex flex-col items-center gap-1 mt-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Suche zurücksetzen
                </button>
              )}
              <button
                onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                className="text-primary text-sm font-medium hover:underline"
              >
                Alle Produkte anzeigen
              </button>
            </div>
          </div>
        )}

        {/* Bottom trust section */}
        <div className="mt-16 pt-10 border-t border-border/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Truck,
                title: "Schneller Versand",
                desc: "In 2–3 Werktagen bei dir — mit DHL versandkostenfrei ab 50 €.",
              },
              {
                icon: ShieldCheck,
                title: "Sicher einkaufen",
                desc: "SSL-verschlüsselt. Sichere Zahlung über Stripe.",
              },
              {
                icon: RotateCcw,
                title: "Einfache Rückgabe",
                desc: "14 Tage Rückgaberecht auf alle Produkte.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/40"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShopPage;
