import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { XCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

export default function CheckoutCancel() {
  return (
    <Layout>
      <SEOHead title="Bestellung abgebrochen" description="Deine Bestellung wurde nicht abgeschlossen." noindex />
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Bestellung abgebrochen</h1>
          <p className="text-muted-foreground">
            Deine Bestellung wurde nicht abgeschlossen. Dein Warenkorb bleibt erhalten.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild>
              <Link to="/produkte">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Zurück zum Shop
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
