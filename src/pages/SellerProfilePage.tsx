import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Star } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { mockListings } from "@/lib/mock-data";

const SellerProfilePage = () => {
  const { id } = useParams();
  const sellerListings = mockListings.filter((l) => l.sellerId === id);
  const sellerName = sellerListings[0]?.sellerName ?? "Unknown Seller";

  return (
    <Layout>
      <div className="container py-8">
        {/* Profile */}
        <div className="flex items-start gap-4 mb-8 pb-8 border-b">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
            {sellerName[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{sellerName}</h1>
            <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />Joined 2025</span>
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" strokeWidth={1.5} />Verified Seller</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />United States</span>
            </div>
          </div>
        </div>

        <h2 className="font-semibold mb-4">Listings ({sellerListings.length})</h2>
        {sellerListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sellerListings.map((l, i) => (
              <ProductCard key={l.id} listing={l} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">No active listings</p>
        )}
      </div>
    </Layout>
  );
};

export default SellerProfilePage;
