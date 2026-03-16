import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockListings } from "@/lib/mock-data";
import { useState, useEffect, useCallback } from "react";

const heroSlides = [
  {
    image: "/images/hero-airpods.png",
    title: "AirPods Pro 3",
    titleAccent: "Premium Sound",
    subtitle: "Kabelloser Premium-Sound mit aktiver Geräuschunterdrückung und räumlichem Audio.",
    badge: "Nur 1 Stück verfügbar",
    price: "180,00 €",
    originalPrice: "239,00 €",
    link: "/produkt/1",
  },
  {
    image: "/images/hero-coming-soon.jpeg",
    title: "Neue Produkte",
    titleAccent: "Coming Soon",
    subtitle: "Bald wieder neue Top-Geräte von Octagon, Formuler und mehr.",
    badge: "",
    price: "",
    originalPrice: "",
    link: "/produkte",
  },
];

const trustBadges = [
  { icon: Zap, label: "Sofort lieferbar" },
  { icon: Truck, label: "Schneller Versand" },
  { icon: ShieldCheck, label: "Händlergarantie" },
];

const HomePage = () => {
  const highlights = mockListings.filter(l => l.status === "ACTIVE").slice(0, 4);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[currentSlide];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "8%" : "-8%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-8%" : "8%", opacity: 0 }),
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="relative min-h-[420px] md:min-h-[520px] lg:min-h-[580px]">
          {/* Content */}
          <div className="relative z-10 container h-full flex items-center min-h-[420px] md:min-h-[520px] lg:min-h-[580px]">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full py-16 md:py-20">
              <div className="max-w-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {slide.badge && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                    >
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/20 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {slide.badge}
                      </span>
                    </motion.div>
                  )}

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-3"
                  >
                    {slide.title}
                    <br />
                    <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                      {slide.titleAccent}
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-md"
                  >
                    {slide.subtitle}
                  </motion.p>

                  {slide.price && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="flex items-baseline gap-3 mb-8"
                    >
                      <span className="text-3xl font-bold font-mono-data">{slide.price}</span>
                      {slide.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through font-mono-data">{slide.originalPrice}</span>
                      )}
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <Link to={slide.link}>
                      <Button size="lg" className="font-semibold press-scale transition-signal px-8 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)]">
                        Jetzt ansehen
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/produkte">
                      <Button size="lg" variant="outline" className="font-medium press-scale transition-signal border-border/60 hover:bg-accent/50">
                        Alle Produkte
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="h-9 w-9 rounded-full bg-card/60 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {/* Slide indicators */}
            <div className="flex gap-1.5 mx-1">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className="relative h-9 w-9 flex items-center justify-center"
                >
                  <span className={`block rounded-full transition-all duration-500 ${
                    i === currentSlide
                      ? "w-6 h-1.5 bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
                      : "w-1.5 h-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
                  }`} />
                </button>
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="h-9 w-9 rounded-full bg-card/60 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border/30 z-20">
            <motion.div
              key={currentSlide}
              className="h-full bg-gradient-to-r from-primary to-primary/60"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 7, ease: "linear" }}
            />
          </div>
        </div>

        {/* Trust badges */}
        <div className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="container py-4">
            <div className="flex items-center justify-center gap-8 md:gap-14">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary/80" strokeWidth={1.5} />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Welcome text */}
      <section className="container py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Willkommen bei B.Electronics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Bei uns finden Sie moderne Receiver für entspanntes Streaming und beste Unterhaltung.
            Wir bieten Top-Geräte wie Octagon und Formuler, schnelle Lieferung und persönlichen Service.
          </p>
        </motion.div>
      </section>

      {/* Highlights */}
      <section className="container pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Highlights</h2>
          <Link to="/produkte" className="text-sm text-muted-foreground hover:text-foreground transition-signal flex items-center gap-1.5">
            Alle Produkte <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {highlights.map((listing, i) => (
            <ProductCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <Link to="/produkte" className="block group">
          <div className="rounded-xl border bg-card/50 p-10 text-center hover:border-primary/30 hover:shadow-[0_0_30px_-8px_hsl(var(--primary)/0.15)] transition-all duration-500">
            <h3 className="text-xl font-bold mb-2">Produkte entdecken</h3>
            <p className="text-muted-foreground text-sm">Alle Streaming Boxen, Receiver und Zubehör ansehen</p>
          </div>
        </Link>
      </section>
    </Layout>
  );
};

export default HomePage;
