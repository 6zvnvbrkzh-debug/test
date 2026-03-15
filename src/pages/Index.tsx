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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-signal-glow/30 to-transparent pointer-events-none" />
        <div className="container pt-20 pb-16 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Marktplatz ist live
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-balance leading-[1.1] mb-4" style={{ letterSpacing: "-0.04em" }}>
              Das Hardware-Labor für Streaming-Enthusiasten
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-8">
              Kaufe und verkaufe Streaming-Geräte, Receiver und Zubehör. Gebaut für Leute, die Wert auf Specs legen, nicht auf Stockfotos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/marketplace">
                <Button size="lg" className="gap-2 press-scale transition-signal">
                  Hardware durchsuchen
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </Link>
              <Link to="/create-listing">
                <Button variant="outline" size="lg" className="press-scale transition-signal">
                  Jetzt verkaufen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: [0.2, 0, 0, 1] }}
              className="flex items-start gap-3 rounded-lg border bg-card p-4"
            >
              <div className="rounded-md bg-primary/10 p-2">
                <f.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="container pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">Beliebte Hardware</h2>
          <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-signal flex items-center gap-1">
            Alle anzeigen <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((listing, i) => (
            <ProductCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="rounded-xl border bg-card p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
            Bereit, deine Geräte zu verkaufen?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Stelle deine Streaming-Hardware in unter 2 Minuten ein. Keine Gebühren für deine ersten 5 Artikel.
          </p>
          <Link to="/create-listing">
            <Button size="lg" className="press-scale transition-signal">
              Erste Anzeige erstellen
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;