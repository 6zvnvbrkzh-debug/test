import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { mockListings, type Category, type Condition } from "@/lib/mock-data";

const MarketplacePage = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") as Category | null;

  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(initialCat ? [initialCat] : []);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return mockListings.filter((l) => {
      if (query && !l.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedCategories.length && !selectedCategories.includes(l.category)) return false;
      if (selectedConditions.length && !selectedConditions.includes(l.condition)) return false;
      if (l.price < priceRange[0] || (priceRange[1] < 500 && l.price > priceRange[1])) return false;
      return true;
    });
  }, [query, selectedCategories, selectedConditions, priceRange]);

  const activeFilterCount = selectedCategories.length + selectedConditions.length + (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);

  return (
    <Layout>
      <div className="container py-8">
        {/* Search bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <Input
              placeholder="Search hardware..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden shrink-0 relative"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden md:block w-56 shrink-0">
            <FilterSidebar
              selectedCategories={selectedCategories}
              selectedConditions={selectedConditions}
              priceRange={priceRange}
              onCategoryChange={setSelectedCategories}
              onConditionChange={setSelectedConditions}
              onPriceChange={setPriceRange}
            />
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setShowFilters(false)}>
              <div className="absolute right-0 top-0 h-full w-72 bg-card border-l p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <FilterSidebar
                  selectedCategories={selectedCategories}
                  selectedConditions={selectedConditions}
                  priceRange={priceRange}
                  onCategoryChange={setSelectedCategories}
                  onConditionChange={setSelectedConditions}
                  onPriceChange={setPriceRange}
                />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-mono">{filtered.length}</span> results
              </p>
            </div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((listing, i) => (
                  <ProductCard key={listing.id} listing={listing} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No listings found</p>
                <Button variant="link" onClick={() => { setQuery(""); setSelectedCategories([]); setSelectedConditions([]); setPriceRange([0, 500]); }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketplacePage;
