import { Link } from "react-router-dom";
import { Package, ShoppingBag, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockListings } from "@/lib/mock-data";

const tabs = [
  { id: "listings", label: "Meine Anzeigen", icon: Package },
  { id: "orders", label: "Bestellungen", icon: ShoppingBag },
  { id: "settings", label: "Einstellungen", icon: Settings },
];

const DashboardPage = () => {
  const myListings = mockListings.slice(0, 3);

  return (
    <Layout>
      <div className="container py-8">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
            T
          </div>
          <div>
            <h1 className="text-xl font-bold">TechDeals</h1>
            <p className="text-sm text-muted-foreground">Mitglied seit März 2025 · 3 aktive Anzeigen</p>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm transition-signal border-b-2 ${
                tab.id === "listings"
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Aktive Anzeigen</h2>
          <Link to="/create-listing">
            <Button size="sm" className="gap-1.5 press-scale transition-signal">
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Neue Anzeige
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {myListings.map((l, i) => (
            <ProductCard key={l.id} listing={l} index={i} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;