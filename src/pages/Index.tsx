import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockListings } from "@/lib/mock-data";

const features = [
  { icon: Zap, title: "Geprüfte Hardware", desc: "Jede Anzeige wird auf Richtigkeit überprüft" },
  { icon: Shield, title: "Sichere Zahlungen", desc: "Käuferschutz durch Stripe" },
  { icon: Package, title: "Schneller Versand", desc: "Verkäuferbewertungen denen du vertrauen kannst" },
];

const HomePage = () => {
  const trending = mockListings.slice(0, 4);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container pt-24 pb-20 md:pt-32 md:pb-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur-sm px-3 py-1.5 text-xs text-muted-foreground mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-glow-pulse" />
              Marktplatz ist live
            </div>
            <h1 className="text-4xl md:text-[3.5rem] font-bold tracking-tight text-balance leading-[1.08] mb-5">
              Das Hardware-Labor für{" "}
              <span className="text-primary">Streaming-Enthusiasten</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Kaufe und verkaufe Streaming-Geräte, Receiver und Zubehör. Gebaut für Leute, die Wert auf Specs legen, nicht auf Stockfotos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/marketplace">
                <Button size="lg" className="gap-2 press-scale transition-signal font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30">
                  Hardware durchsuchen
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Button>
              </Link>
              <Link to="/create-listing">
                <Button variant="outline" size="lg" className="press-scale transition-signal font-semibold">
                  Jetzt verkaufen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-4 rounded-lg border bg-card p-5 hover:border-primary/20 transition-signal"
            >
              <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
                <f.icon className="h-4 w-4 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="container pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Beliebte Hardware</h2>
            <p className="text-sm text-muted-foreground mt-1">Die aktuellsten Angebote</p>
          </div>
          <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-primary transition-signal flex items-center gap-1.5 font-medium">
            Alle anzeigen <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((listing, i) => (
            <ProductCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="rounded-xl border bg-gradient-to-br from-card to-secondary/50 p-8 md:p-14 text-center relative overflow-hidden grain">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Bereit, deine Geräte zu verkaufen?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Stelle deine Streaming-Hardware in unter 2 Minuten ein. Keine Gebühren für deine ersten 5 Artikel.
            </p>
            <Link to="/create-listing">
              <Button size="lg" className="press-scale transition-signal font-semibold shadow-lg shadow-primary/20">
                Erste Anzeige erstellen
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
