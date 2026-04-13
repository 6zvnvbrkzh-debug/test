import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Truck, Package, ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useActiveListings } from "@/hooks/useActiveListings";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "sonner";

const conditionLabels: Record<string, string> = {
  NEW: "Neu",
  OPEN_BOX: "Geöffnete Verpackung",
  USED: "Gebraucht",
  FOR_PARTS: "Ersatzteile",
};

const formatPrice = (price: number) => {
  const [euros, cents] = price.toFixed(2).split(".");
  return `${euros},${cents}\u00A0€`;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addItem, getItemQuantity } = useCart();
  const { data: listings = [], isLoading } = useActiveListings();
  const listing = listings.find((entry) => entry.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const relatedProducts = useMemo(() => {
    if (!listing) return [];

    return listings
      .filter((entry) => entry.id !== listing.id && entry.category === listing.category)
      .slice(0, 4);
  }, [listing, listings]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Layout>
    );
  }

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
  const isSold = listing.status === "SOLD" || listing.stock === 0;
  const hasDiscount = listing.originalPrice && listing.originalPrice > listing.price;
  const discountPercent = hasDiscount
    ? Math.round(((listing.originalPrice! - listing.price) / listing.originalPrice!) * 100)
    : 0;
  const lowStock = listing.stock > 0 && listing.stock <= 3;

  const cartQty = getItemQuantity(listing.id);
  const remainingStock = Math.max(0, listing.stock - cartQty);

  const handleAddToCart = () => {
    if (quantity > remainingStock) {
      toast.error(`Nur noch ${remainingStock} verfügbar`);
      return;
    }
    const success = addItem(listing, quantity);
    if (!success) {
      toast.error("Maximale Menge bereits im Warenkorb");
      return;
    }
    setAddedToCart(true);
    toast.success(`${quantity}x ${listing.title} zum Warenkorb hinzugefügt`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: listing.title,
        description: listing.description,
        image: listing.images?.[0],
        sku: listing.id,
        brand: { "@type": "Brand", name: "Barbato Electronics" },
        offers: {
          "@type": "Offer",
          price: listing.price,
          priceCurrency: "EUR",
          availability: isSold ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          seller: { "@type": "Organization", name: "Barbato Electronics" },
          url: `https://b-electronics.shop/produkt/${listing.id}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: "https://b-electronics.shop/" },
          { "@type": "ListItem", position: 2, name: "Shop", item: "https://b-electronics.shop/produkte" },
          { "@type": "ListItem", position: 3, name: listing.title, item: `https://b-electronics.shop/produkt/${listing.id}` },
        ],
      },
    ],
  };

  return (
    <Layout>
      <SEOHead
        title={listing.title}
        description={listing.description.slice(0, 155)}
        canonical={`/produkt/${listing.id}`}
        type="product"
        ogImage={listing.images?.[0]}
        jsonLd={productJsonLd}
      />
      <div className="container py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/produkte" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" />
            Produkte
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px] md:max-w-none">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 space-y-3"
          >
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

              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

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

            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg border overflow-hidden transition-all duration-200 ${
                      index === selectedImage
                        ? "border-primary ring-1 ring-primary/30 shadow-[0_0_10px_-3px_hsl(var(--primary)/0.3)]"
                        : "border-border/60 hover:border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={image} alt={`${listing.title} ${index + 1}`} className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight mb-4">
                {listing.title}
              </h1>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:gap-3">
                <span className="text-[2rem] leading-none md:text-3xl font-bold font-mono-data whitespace-nowrap">
                  {formatPrice(listing.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm md:text-base text-muted-foreground font-mono-data whitespace-nowrap">
                    <span className="font-sans mr-1">UVP</span>
                    <span className="line-through">{formatPrice(listing.originalPrice!)}</span>
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm text-primary font-medium mt-1 whitespace-nowrap">
                  Du sparst&nbsp;{formatPrice(listing.originalPrice! - listing.price)}
                </p>
              )}
              {lowStock && (
                <p className="text-sm text-orange-500 font-medium mt-1">
                  Nur noch {listing.stock} auf Lager!
                </p>
              )}
              {listing.stock > 3 && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  Auf Lager ({listing.stock} verfügbar)
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Menge:</span>
                <div className="flex items-center rounded-lg border border-border/60 overflow-hidden">
                  <button
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    disabled={isSold}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="h-10 w-12 flex items-center justify-center text-sm font-semibold font-mono-data border-x border-border/60">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((current) => Math.min(listing.stock, current + 1))}
                    className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    disabled={isSold || quantity >= listing.stock}
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
                    In den Warenkorb · {formatPrice(listing.price * quantity)}
                  </span>
                )}
              </Button>
            </div>

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

            <div>
              <h3 className="text-sm font-semibold mb-2">Beschreibung</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            {specEntries.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Technische Daten</h3>
                <div className="rounded-xl border border-border/60 overflow-hidden">
                  {specEntries.map(([key, value], index) => {
                    const isLongValue = String(value).length > 40;
                    return (
                      <div
                        key={key}
                        className={`px-4 py-2.5 text-sm ${
                          isLongValue ? "flex flex-col gap-1" : "flex items-center justify-between"
                        } ${
                          index % 2 === 0 ? "bg-muted/30" : "bg-transparent"
                        } ${index < specEntries.length - 1 ? "border-b border-border/30" : ""}`}
                      >
                        <span className="text-muted-foreground">{key}</span>
                        <span className={`font-mono-data text-xs font-medium text-foreground ${isLongValue ? "" : "text-right"}`}>{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 pb-8">
            <h2 className="text-xl font-bold tracking-tight mb-6">Ähnliche Produkte</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((item, index) => (
                <ProductCard key={item.id} listing={item} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
