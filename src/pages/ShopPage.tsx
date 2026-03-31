import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useActiveListings } from "@/hooks/useActiveListings";
import type { Category } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const categoryOptions = [
  { value: "all", label: "Alle Produkte" },
  { value: "streaming-box", label: "Streaming Boxen" },
  { value: "receiver", label: "Receiver" },
  { value: "accessories", label: "Zubehör" },
];

const sortOptions = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "price-asc", label: "Niedrigster Preis" },
  { value: "price-desc", label: "Höchster Preis" },
];

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") as Category | null;
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat || "all");
  const [sortBy, setSortBy] = useState("name-asc");
  const { data: listings = [], isLoading } = useActiveListings();

  const filtered = useMemo(() => {
    let results = [...listings];

    if (selectedCategory !== "all") {
      results = results.filter((listing) => listing.category === selectedCategory);
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return results;
  }, [listings, selectedCategory, sortBy]);

  return (
    <Layout>
      <div className="container py-6">
        <div className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-signal">Start</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Produkte</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Produkte entdecken</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Kategorien</p>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px] bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Sortiert von</p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((listing, index) => (
              <ProductCard key={listing.id} listing={listing} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Keine Produkte gefunden</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ShopPage;
