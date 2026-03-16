import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Truck, Package, ChevronLeft, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { mockListings } from "@/lib/mock-data";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState } from "react";

const conditionLabels: Record<string, string> = {
  NEW: "Neu",
  OPEN_BOX: "Geöffnete Verpackung",
  USED: "Gebraucht",
  FOR_PARTS: "Ersatzteile",
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const listing = mockListings.find((l) => l.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

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
  const discountPercent = hasDiscount
    ? Math.round(((listing.originalPrice! - listing.price) / listing.originalPrice!) * 100)
    : 0;

  const relatedProducts = mockListings
    .filter((l) => l.id !== listing.id && l.category === listing.category && l.status === "ACTIVE")
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(listing);
    }
    setAddedToCart(true);
    toast.success(`${quantity}x ${listing.title} zum Warenkorb hinzugefügt`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <Layout>
      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/produkte" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" />
            Produkte
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px] md:max-w-none">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 space-y-3"
          >
            {/* Main Image */}
            <div className="aspect-square rounded-xl bg-card border border-border/60 flex items-center justify-center relative overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={listing.images[selectedImage] || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full h-full object-contain p-8 md:p-12"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasDiscount && (
                  <span className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                    -{discountPercent}%
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-card/90 backdrop-blur-sm border border-border/60 text-xs font-medium text-muted-foreground">
                  {conditionLabels[listing.condition] || listing.condition}
                </span>
              </div>

              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                  <span className="text-lg font-bold text-muted-foreground tracking-wide">Ausverkauft</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-lg border overflow-hidden transition-all duration-200 ${
                      i === selectedImage
                        ? "border-primary ring-1 ring-primary/30 shadow-[0_0_10px_-3px_hsl(var(--primary)/0.3)]"
                        : "border-border/60 hover:border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${listing.title} ${i + 1}`} className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Title & Price */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight mb-4">
                {listing.title}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono-data">
                  {listing.price.toFixed(2).replace(".", ",")} €
                </span>
                {hasDiscount && (
                  <span className="text-base text-muted-foreground line-through font-mono-data">
                    {listing.originalPrice!.toFixed(2).replace(".", ",")} €
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm text-primary font-medium mt-1">
                  Du sparst {(listing.originalPrice! - listing.price).toFixed(2).replace(".", ",")} €
                </p>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Menge:</span>
                <div className="flex items-center rounded-lg border border-border/60 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    disabled={isSold}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="h-10 w-12 flex items-center justify-center text-sm font-semibold font-mono-data border-x border-border/60">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    disabled={isSold}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <Button
                className="w-full font-semibold text-base h-12 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)] transition-all duration-300"
                size="lg"
                disabled={isSold}
                onClick={handleAddToCart}
              >
                {isSold ? (
                  "Ausverkauft"
                ) : addedToCart ? (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Hinzugefügt!
                  </motion.span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    In den Warenkorb · {(listing.price * quantity).toFixed(2).replace(".", ",")} €
                  </span>
                )}
              </Button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: "Händlergarantie" },
                { icon: Truck, label: "2–3 Werktage" },
                { icon: Package, label: "Originalverpackt" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-lg border border-border/40 bg-card/30 text-center"
                >
                  <Icon className="h-4 w-4 text-primary/80" strokeWidth={1.5} />
                  <span className="text-[11px] text-muted-foreground leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Beschreibung</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            {/* Specs */}
            {specEntries.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Technische Daten</h3>
                <div className="rounded-xl border border-border/60 overflow-hidden">
                  {specEntries.map(([key, value], i) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                        i % 2 === 0 ? "bg-muted/30" : "bg-transparent"
                      } ${i < specEntries.length - 1 ? "border-b border-border/30" : ""}`}
                    >
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-mono-data text-xs font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pb-8">
            <h2 className="text-xl font-bold tracking-tight mb-6">Ähnliche Produkte</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((item, i) => (
                <ProductCard key={item.id} listing={item} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
