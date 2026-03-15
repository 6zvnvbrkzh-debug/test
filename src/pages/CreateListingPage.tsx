import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { CATEGORIES, CONDITIONS } from "@/lib/mock-data";
import { toast } from "sonner";

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "Resolution", value: "" },
    { key: "Connectivity", value: "" },
  ]);

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Listing created! (Demo mode)");
    navigate("/marketplace");
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Create Listing</h1>
        <p className="text-sm text-muted-foreground mb-8">List your streaming hardware for sale</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <div>
            <Label className="mb-2 block">Product Images</Label>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-signal"
                >
                  <Upload className="h-5 w-5 text-muted-foreground/40 mb-1" strokeWidth={1.5} />
                  <span className="text-xs text-muted-foreground/40">Upload</span>
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. NVIDIA Shield TV Pro 2019" className="mt-1.5" required />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" placeholder="Describe your item, include condition details..." className="mt-1.5 min-h-[100px]" required />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select required>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition</Label>
              <Select required>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" className="mt-1.5 font-mono" required />
          </div>

          {/* Specs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Technical Specs</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addSpec} className="text-xs gap-1">
                <Plus className="h-3 w-3" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {specs.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Spec name"
                    value={spec.key}
                    onChange={(e) => {
                      const next = [...specs];
                      next[i].key = e.target.value;
                      setSpecs(next);
                    }}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => {
                      const next = [...specs];
                      next[i].value = e.target.value;
                      setSpecs(next);
                    }}
                    className="flex-1 font-mono text-sm"
                  />
                  {specs.length > 2 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(i)} className="shrink-0 text-muted-foreground">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full press-scale transition-signal" size="lg">
            Publish Listing
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateListingPage;
