import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ConditionBadge } from "@/components/marketplace/ConditionBadge";
import { mockListings } from "@/lib/mock-data";

const ProductDetailPage = () => {
  const { id } = useParams();
  const listing = mockListings.find((l) => l.id === id);

  if (!listing) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-xl font-bold mb-2">Anzeige nicht gefunden</h1>
          <Link to="/marketplace">
            <Button variant="link">Zurück zum Marktplatz</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const specEntries = Object.entries(listing.specs);

  return (
    <Layout>
      <div className="container py-6">
        <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-signal mb-6">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Zurück zum Marktplatz
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Images (3/5) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="aspect-[4/3] rounded-lg bg-muted border flex items-center justify-center">
              <svg className="w-20 h-20 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            {/* Thumbnail row */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-md bg-muted border" />
              ))}
            </div>
          </motion.div>

          {/* Right: Details (2/5) */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ConditionBadge condition={listing.condition} />
                <span className="text-xs text-muted-foreground capitalize">{listing.category.replace("-", " ")}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">{listing.title}</h1>
              <p className="text-3xl font-mono font-medium text-primary">${listing.price.toFixed(2)}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full press-scale transition-signal" size="lg">
                Jetzt kaufen
              </Button>
              <Button variant="outline" className="w-full press-scale transition-signal" size="lg">
                Verkäufer kontaktieren
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
                Käuferschutz
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" strokeWidth={1.5} />
                Versand in 2–3 Tagen
              </div>
            </div>

            {/* Seller */}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground">
                  {listing.sellerName[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{listing.sellerName}</p>
                  <p className="text-xs text-muted-foreground">Mitglied seit 2025</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Beschreibung</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            {/* Specs */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Technische Daten</h3>
              <div className="rounded-lg border overflow-hidden">
                {specEntries.map(([key, value], i) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between px-3 py-2 text-sm ${
                      i % 2 === 0 ? "bg-muted/50" : ""
                    }`}
                  >
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-mono text-xs font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;