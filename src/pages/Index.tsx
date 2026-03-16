import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockListings } from "@/lib/mock-data";

const features = [
  { icon: Truck, title: "Schneller Versand", desc: "Lieferung in 2–3 Werktagen" },
  { icon: ShieldCheck, title: "Garantie", desc: "Alle Produkte mit Händlergarantie" },
  { icon: Headphones, title: "Support", desc: "Persönliche Beratung per Chat & E-Mail" },
];

const HomePage = () => {
  const featured = mockListings.filter(l => l.status === "ACTIVE").slice(0, 4);

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
              Neue Produkte verfügbar
            </div>
            <h1 className="text-4xl md:text-[3.5rem] font-bold tracking-tight text-balance leading-[1.08] mb-5">
              Streaming-Hardware von{" "}
              <span className="text-primary">B-Electronics</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Formuler, Octagon und mehr — hochwertige Streaming Boxen, Receiver und Zubehör zu fairen Preisen.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/produkte">
                <Button size="lg" className="gap-2 press-scale transition-signal font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30">
                  Jetzt entdecken
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
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

      {/* Featured Products */}
      <section className="container pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Beliebte Produkte</h2>
            <p className="text-sm text-muted-foreground mt-1">Unsere aktuellen Top-Angebote</p>
          </div>
          <Link to="/produkte" className="text-sm text-muted-foreground hover:text-primary transition-signal flex items-center gap-1.5 font-medium">
            Alle Produkte <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((listing, i) => (
            <ProductCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
