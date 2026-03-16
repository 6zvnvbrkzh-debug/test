import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockListings } from "@/lib/mock-data";
import { useState, useEffect } from "react";

const heroSlides = [
  {
    image: "/images/hero-airpods.png",
    title: "Apple AirPods Pro 3",
    subtitle: "Kabelloser Premium-Sound. Maximale Freiheit.",
    badge: "⚠️ Nur 1 Stück verfügbar!",
    link: "/produkt/1",
  },
  {
    image: "/images/hero-coming-soon.jpeg",
    title: "Bald wieder Verfügbar",
    subtitle: "",
    badge: "",
    link: "/produkte",
  },
];

const HomePage = () => {
  const highlights = mockListings.filter(l => l.status === "ACTIVE").slice(0, 4);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="aspect-[16/7] md:aspect-[16/6] relative overflow-hidden bg-card">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg mb-4"
              >
                {slide.title}
              </motion.h1>
              {slide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="text-base md:text-lg text-white/80 mb-2 drop-shadow"
                >
                  {slide.subtitle}
                </motion.p>
              )}
              {slide.badge && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-white/90 mb-6"
                >
                  {slide.badge}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Link to={slide.link}>
                  <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white font-semibold press-scale transition-signal">
                    Entdecken
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
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
        <Link to="/produkte" className="block">
          <div className="rounded-xl border bg-card p-10 text-center hover:border-primary/30 transition-signal">
            <h3 className="text-xl font-bold mb-2">Produkte entdecken</h3>
            <p className="text-muted-foreground text-sm">Alle Streaming Boxen, Receiver und Zubehör ansehen</p>
          </div>
        </Link>
      </section>
    </Layout>
  );
};

export default HomePage;
