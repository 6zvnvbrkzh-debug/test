import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockListings } from "@/lib/mock-data";

const trustBadges = [
  { icon: Zap, label: "Sofort lieferbar" },
  { icon: Truck, label: "Schneller Versand" },
  { icon: ShieldCheck, label: "Händlergarantie" },
];

const HomePage = () => {
  const highlights = mockListings.filter(l => l.status === "ACTIVE").slice(0, 4);

  return (
    <Layout>
      {/* Editorial Hero */}
      <section className="container pt-16 md:pt-24 pb-12 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="text-sm md:text-base text-muted-foreground tracking-widest uppercase mb-6 md:mb-8">
            Streaming & Hardware
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8 md:mb-12">
            Moderne Receiver
            <br />
            für entspanntes
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/50 bg-clip-text text-transparent">
              Streaming.
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-start gap-6 md:gap-12"
        >
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
            Bei uns finden Sie Top-Geräte von Octagon und Formuler – 
            schnelle Lieferung und persönlichen Service.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/produkte">
              <Button size="lg" className="font-semibold press-scale transition-signal px-8 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)]">
                Jetzt entdecken
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Hero Product Showcase */}
      <section className="container pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="aspect-square md:aspect-auto md:min-h-[400px] lg:min-h-[500px] bg-gradient-to-br from-card to-surface-sunken flex items-center justify-center p-8 md:p-12">
              <img
                src="/images/hero-airpods-pro.webp"
                alt="AirPods Pro 3"
                className="w-full max-w-xs md:max-w-sm object-contain drop-shadow-2xl"
              />
            </div>
            {/* Info */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/20 mb-6 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Nur 1 Stück verfügbar
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                AirPods Pro 3
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-sm">
                Kabelloser Premium-Sound mit aktiver Geräuschunterdrückung und räumlichem Audio.
              </p>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-3xl font-bold font-mono-data">180,00 €</span>
                <span className="text-lg text-muted-foreground line-through font-mono-data">239,00 €</span>
              </div>
              <Link to="/produkt/1">
                <Button size="lg" className="font-semibold press-scale transition-signal w-fit px-8">
                  Jetzt ansehen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust badges */}
      <section className="container pb-16 md:pb-20">
        <div className="flex items-center justify-center gap-8 md:gap-16">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-xs md:text-sm text-muted-foreground">
              <Icon className="h-4 w-4 text-primary/80" strokeWidth={1.5} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="container pb-20 md:pb-28">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="text-xs md:text-sm text-muted-foreground tracking-widest uppercase mb-2">Unsere Auswahl</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Highlights</h2>
          </div>
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

      {/* Editorial CTA */}
      <section className="container pb-20 md:pb-28">
        <Link to="/produkte" className="block group">
          <div className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-12 md:p-16 hover:border-primary/30 hover:shadow-[0_0_40px_-8px_hsl(var(--primary)/0.15)] transition-all duration-500">
            <p className="text-xs md:text-sm text-muted-foreground tracking-widest uppercase mb-4">Entdecken</p>
            <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors duration-500">
              Alle Produkte ansehen
            </h3>
            <p className="text-muted-foreground max-w-md">
              Streaming Boxen, Receiver und Zubehör – alles für dein Entertainment Setup.
            </p>
            <ArrowRight className="h-5 w-5 mt-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-500" />
          </div>
        </Link>
      </section>
    </Layout>
  );
};

export default HomePage;
