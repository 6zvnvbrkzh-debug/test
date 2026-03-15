import { CATEGORIES, CONDITIONS, type Category, type Condition } from "@/lib/mock-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FilterSidebarProps {
  selectedCategories: Category[];
  selectedConditions: Condition[];
  priceRange: [number, number];
  onCategoryChange: (categories: Category[]) => void;
  onConditionChange: (conditions: Condition[]) => void;
  onPriceChange: (range: [number, number]) => void;
}

export function FilterSidebar({
  selectedCategories,
  selectedConditions,
  priceRange,
  onCategoryChange,
  onConditionChange,
  onPriceChange,
}: FilterSidebarProps) {
  const toggleCategory = (cat: Category) => {
    onCategoryChange(
      selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat]
    );
  };

  const toggleCondition = (cond: Condition) => {
    onConditionChange(
      selectedConditions.includes(cond)
        ? selectedConditions.filter((c) => c !== cond)
        : [...selectedConditions, cond]
    );
  };

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.value} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.value}`}
                checked={selectedCategories.includes(cat.value)}
                onCheckedChange={() => toggleCategory(cat.value)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={`cat-${cat.value}`} className="text-sm text-muted-foreground cursor-pointer">
                {cat.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Condition</h3>
        <div className="space-y-2">
          {CONDITIONS.map((cond) => (
            <div key={cond.value} className="flex items-center gap-2">
              <Checkbox
                id={`cond-${cond.value}`}
                checked={selectedConditions.includes(cond.value)}
                onCheckedChange={() => toggleCondition(cond.value)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={`cond-${cond.value}`} className="text-sm text-muted-foreground cursor-pointer">
                {cond.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Price Range</h3>
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={(v) => onPriceChange(v as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
      </div>
    </aside>
  );
}
