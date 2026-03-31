import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const checkoutItems = items.map(({ listing, quantity }) => ({
        listingId: listing.id,
        quantity,
      }));

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { items: checkoutItems },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Keine Checkout-URL erhalten");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error("Fehler beim Starten des Checkouts. Bitte versuche es erneut.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Warenkorb ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" strokeWidth={1} />
            <div>
              <p className="font-medium mb-1">Dein Warenkorb ist leer</p>
              <p className="text-sm text-muted-foreground">Füge Produkte hinzu, um loszulegen.</p>
            </div>
            <Button variant="outline" onClick={() => setIsOpen(false)} asChild>
              <Link to="/produkte">Produkte ansehen</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4 py-4">
              {items.map(({ listing, quantity }) => (
                <div key={listing.id} className="flex gap-3 group">
                  {/* Thumbnail */}
                  <Link
                    to={`/produkt/${listing.id}`}
                    onClick={() => setIsOpen(false)}
                    className="w-20 h-20 rounded-md border bg-card flex-shrink-0 flex items-center justify-center overflow-hidden"
                  >
                    {listing.images.length > 0 ? (
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-contain p-2" />
                    ) : (
                      <ShoppingBag className="h-6 w-6 text-muted-foreground/20" />
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/produkt/${listing.id}`}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium line-clamp-2 hover:text-foreground/80 transition-colors"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-sm font-semibold mt-1">
                      {listing.price.toFixed(2).replace(".", ",")} €
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(listing.id, quantity - 1)}
                          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="h-7 w-8 flex items-center justify-center text-sm font-medium font-mono-data">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(listing.id, quantity + 1)}
                          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(listing.id)}
                        className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="text-sm font-semibold whitespace-nowrap">
                    {(listing.price * quantity).toFixed(2).replace(".", ",")} €
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Zwischensumme</span>
                <span className="text-sm font-medium">{totalPrice.toFixed(2).replace(".", ",")} €</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Versand</span>
                <span className="text-sm font-medium">
                  {totalPrice >= 50 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Kostenlos</span>
                  ) : (
                    "5,99 €"
                  )}
                </span>
              </div>
              {/* Free shipping progress bar */}
              <div className="space-y-1.5">
                <Progress
                  value={Math.min((totalPrice / 50) * 100, 100)}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground text-center">
                  {totalPrice >= 50 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Du erhältst kostenlosen Versand!
                    </span>
                  ) : (
                    <>
                      Noch <span className="font-semibold">{(50 - totalPrice).toFixed(2).replace(".", ",")} €</span> bis zum kostenlosen Versand
                    </>
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm font-semibold">Gesamt</span>
                <span className="text-lg font-bold">
                  {(totalPrice + (totalPrice >= 50 ? 0 : 5.99)).toFixed(2).replace(".", ",")} €
                </span>
              </div>
              <Button
                className="w-full font-semibold press-scale transition-signal"
                size="lg"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Wird geladen...
                  </>
                ) : (
                  "Zur Kasse"
                )}
              </Button>
              <Button variant="ghost" className="w-full text-sm" onClick={() => setIsOpen(false)}>
                Weiter einkaufen
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
