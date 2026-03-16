import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Truck, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { mockListings } from "@/lib/mock-data";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const listing = mockListings.find((l) => l.id === id);

  if (!listing) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-xl font-bold mb-2">Produkt nicht gefunden</h1>
          <Link to="/produkte">
            <Button variant="link">Zurück zum Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const specEntries = Object.entries(listing.specs);
  const isSold = listing.status === "SOLD";
  const hasDiscount = listing.originalPrice && listing.originalPrice > listing.price;

  return (
    <Layout>
      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-signal">Start</Link>
          <span className="mx-2">/</span>
          <Link to="/produkte" className="hover:text-foreground transition-signal">Produkte</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground line-clamp-1">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="aspect-square rounded-lg bg-card border flex items-center justify-center relative overflow-hidden">
              {listing.images.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-contain p-12"
                />
              ) : (
                <svg className="w-20 h-20 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )}
              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <span className="text-lg font-bold text-muted-foreground">Ausverkauft</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-4">{listing.title}</h1>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-semibold">{listing.price.toFixed(2).replace(".", ",")} €</p>
                {hasDiscount && (
                  <p className="text-lg text-muted-foreground line-through">{listing.originalPrice!.toFixed(2).replace(".", ",")} €</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                className="w-full press-scale transition-signal font-semibold"
                size="lg"
                disabled={isSold}
                onClick={() => {
                  addItem(listing);
                  toast.success(`${listing.title} wurde zum Warenkorb hinzugefügt`);
                }}
              >
                {isSold ? "Ausverkauft" : "In den Warenkorb"}
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
                Händlergarantie
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" strokeWidth={1.5} />
                2–3 Werktage
              </div>
              <div className="flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" strokeWidth={1.5} />
                Originalverpackt
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Beschreibung</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            {/* Specs */}
            {specEntries.length > 0 && (
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
                      <span className="font-mono-data text-xs font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
