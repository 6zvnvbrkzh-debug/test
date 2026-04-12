import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { SEOHead } from "@/components/SEOHead";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <Layout>
      <SEOHead title="Bestellung erfolgreich" description="Deine Bestellung wurde erfolgreich abgeschlossen." noindex />
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">Bestellung erfolgreich!</h1>
          <p className="text-muted-foreground">
            Vielen Dank für deinen Einkauf. Du erhältst in Kürze eine Bestätigungs-E-Mail.
          </p>
          {sessionId && (
            <p className="text-xs text-muted-foreground font-mono">
              Referenz: {sessionId.slice(0, 20)}...
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild>
              <Link to="/produkte">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Weiter einkaufen
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zur Startseite
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
