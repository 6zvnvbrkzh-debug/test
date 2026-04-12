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
              <a
                href="https://t.me/bElectronicsshop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#229ED9] hover:bg-[#1a8abf] py-2.5 text-sm font-semibold text-white transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Fragen? Schreib uns auf Telegram
              </a>
              <a
                href="https://wa.me/4917622551230"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#25D366] hover:bg-[#128C7E] py-2.5 text-sm font-semibold text-white transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.27-.467-2.416-1.49-.893-.79-1.496-1.767-1.67-2.064-.173-.298-.018-.459.13-.608.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.365.195 1.88.118.574-.091 1.758-.716 2.006-1.409.248-.692.248-1.285.173-1.414-.074-.128-.272-.198-.57-.347m-5.421 5.834h-.004c-1.023-.025-2.05-.295-3.022-.84-.987-.553-1.87-1.288-2.52-2.162l-.036-.05c-.39-.55-.754-1.168-1.077-1.834-.3-.62-.549-1.273-.735-1.938a11.59 11.59 0 0 1-.267-1.57c-.067-.7-.08-1.4-.04-2.092.08-1.376.382-2.71.884-3.92.492-1.185 1.156-2.2 1.963-3.017l.033-.033a1.11 1.11 0 0 1 .785-.324c.46-.02.91.152 1.238.472.34.332.526.787.517 1.258a41.6 41.6 0 0 0-.045 2.22c.03.653.173 1.292.422 1.896.12.275.284.528.485.749.21.23.459.424.733.574.29.157.61.263.942.313.337.05.68.042 1.015-.025a2.63 2.63 0 0 0 1.72-1.12c.162-.255.273-.534.33-.824.074-.363.08-.736.018-1.1a2.18 2.18 0 0 0-.583-1.13 1.81 1.81 0 0 0-1.137-.553 2.29 2.29 0 0 0-.4.01c-.357.035-.696.166-.975.377-.238.179-.427.414-.55.685-.113.25-.157.523-.129.792.032.294.157.573.357.798.17.19.39.333.637.416a.62.62 0 0 1-.255 1.21 2.2 2.2 0 0 1-1.019-.27 2.48 2.48 0 0 1-.933-.873 2.67 2.67 0 0 1-.417-1.23 2.9 2.9 0 0 1 .14-1.35c.214-.55.56-1.03 1.004-1.395.53-.433 1.17-.707 1.85-.788a3.57 3.57 0 0 1 .623-.025c.654.006 1.29.197 1.833.55.556.362 1.004.88 1.292 1.498.298.639.432 1.334.39 2.03a3.62 3.62 0 0 1-.39 1.43 3.51 3.51 0 0 1-.978 1.26c-.456.374-.987.64-1.56.78a4.2 4.2 0 0 1-1.213.12 4.12 4.12 0 0 1-.907-.132 4.6 4.6 0 0 1-1.02-.41 4.35 4.35 0 0 1-.878-.66 4.05 4.05 0 0 1-.68-.85 3.84 3.84 0 0 1-.426-1.004 11.1 11.1 0 0 1-.257-1.114c-.064-.388-.1-.78-.107-1.173-.005-.32.01-.64.046-.958.036-.319.092-.635.167-.946a6.77 6.77 0 0 1 .456-1.38c.22-.458.495-.89.819-1.285.34-.414.732-.78 1.165-1.09.453-.326.952-.583 1.476-.764.538-.187 1.1-.293 1.667-.315a6.4 6.4 0 0 1 1.76.115c.573.1 1.125.287 1.636.554.525.273.997.62 1.398 1.03.416.423.754.92 1 1.47.256.566.416 1.175.473 1.798.058.635.012 1.275-.136 1.894a6.07 6.07 0 0 1-.65 1.8 6.28 6.28 0 0 1-1.138 1.52 6.52 6.52 0 0 1-1.55 1.145 6.66 6.66 0 0 1-1.87.617c-.317.048-.638.07-.958.066z"/></svg>
                WhatsApp für Großbestellungen
              </a>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
