import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Hash } from "lucide-react";
import SerialNumbersManager from "@/components/admin/SerialNumbersManager";
import type { Tables } from "@/integrations/supabase/types";

type Listing = Tables<"listings">;

const CONDITIONS = [
  { value: "NEW", label: "Neu" },
  { value: "OPEN_BOX", label: "Geöffnet" },
  { value: "USED", label: "Gebraucht" },
  { value: "FOR_PARTS", label: "Für Teile" },
] as const;

const STATUSES = [
  { value: "ACTIVE", label: "Aktiv" },
  { value: "SOLD", label: "Verkauft" },
  { value: "ARCHIVED", label: "Archiviert" },
] as const;

interface ProductForm {
  title: string;
  description: string;
  price: string;
  original_price: string;
  stock: string;
  condition: string;
  status: string;
  category_id: string;
  images: string;
  specs: string;
}

const emptyForm: ProductForm = {
  title: "",
  description: "",
  price: "",
  original_price: "",
  stock: "0",
  condition: "NEW",
  status: "ACTIVE",
  category_id: "",
  images: "",
  specs: "",
};

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serialDialog, setSerialDialog] = useState<{ id: string; title: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const { data: listings, isLoading } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      let parsedSpecs: Record<string, string> = {};
      if (form.specs.trim()) {
        try {
          // Try JSON first
          parsedSpecs = JSON.parse(form.specs);
        } catch {
          // Parse key: value lines
          form.specs.split("\n").forEach((line) => {
            const [key, ...rest] = line.split(":");
            if (key && rest.length) {
              parsedSpecs[key.trim()] = rest.join(":").trim();
            }
          });
        }
      }

      const payload: any = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        stock: parseInt(form.stock) || 0,
        condition: form.condition as Listing["condition"],
        status: form.status as Listing["status"],
        category_id: form.category_id,
        images: form.images
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        specs: Object.keys(parsedSpecs).length > 0 ? parsedSpecs : null,
      };

      if (editingId) {
        const { error } = await supabase.from("listings").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Nicht angemeldet");
        const { error } = await supabase.from("listings").insert({ ...payload, seller_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["active-listings"] });
      toast.success(editingId ? "Produkt aktualisiert" : "Produkt erstellt");
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["active-listings"] });
      toast.success("Produkt gelöscht");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (listing: any) => {
    setEditingId(listing.id);
    const specsStr = listing.specs
      ? typeof listing.specs === "object"
        ? Object.entries(listing.specs).map(([k, v]) => `${k}: ${v}`).join("\n")
        : JSON.stringify(listing.specs, null, 2)
      : "";
    setForm({
      title: listing.title,
      description: listing.description,
      price: String(listing.price),
      original_price: listing.original_price ? String(listing.original_price) : "",
      stock: String(listing.stock ?? 0),
      condition: listing.condition,
      status: listing.status,
      category_id: listing.category_id,
      images: (listing.images || []).join("\n"),
      specs: specsStr,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const statusColor = (s: string) => {
    if (s === "ACTIVE") return "default";
    if (s === "SOLD") return "secondary";
    return "outline";
  };

  const hasDiscount = (listing: any) =>
    listing.original_price && Number(listing.original_price) > Number(listing.price);

  const discountPercent = (listing: any) => {
    if (!hasDiscount(listing)) return 0;
    return Math.round((1 - Number(listing.price) / Number(listing.original_price)) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produkte</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Neues Produkt
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bild</TableHead>
                <TableHead>Titel</TableHead>
                <TableHead>Preis</TableHead>
                <TableHead>UVP</TableHead>
                <TableHead>Rabatt</TableHead>
                <TableHead>Bestand</TableHead>
                <TableHead>Zustand</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings?.map((listing: any) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    {listing.images?.[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-12 h-12 object-contain rounded border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded border" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {listing.title}
                  </TableCell>
                  <TableCell>{Number(listing.price).toFixed(2).replace(".", ",")} €</TableCell>
                  <TableCell className="text-muted-foreground">
                    {listing.original_price
                      ? `${Number(listing.original_price).toFixed(2).replace(".", ",")} €`
                      : "–"}
                  </TableCell>
                  <TableCell>
                    {hasDiscount(listing) ? (
                      <Badge variant="destructive" className="text-xs">
                        -{discountPercent(listing)}%
                      </Badge>
                    ) : (
                      "–"
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`font-mono text-sm ${(listing.stock ?? 0) === 0 ? 'text-destructive font-semibold' : (listing.stock ?? 0) <= 3 ? 'text-orange-500' : 'text-foreground'}`}>
                      {listing.stock ?? 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {CONDITIONS.find((c) => c.value === listing.condition)?.label || listing.condition}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColor(listing.status)}>
                      {STATUSES.find((s) => s.value === listing.status)?.label || listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{listing.categories?.name || "–"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" title="Seriennummern" onClick={() => setSerialDialog({ id: listing.id, title: listing.title })}>
                        <Hash className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(listing)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => {
                          if (confirm("Produkt wirklich löschen?")) deleteMutation.mutate(listing.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {listings?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Keine Produkte vorhanden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Produkt bearbeiten" : "Neues Produkt"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Beschreibung</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preis (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>UVP Preis (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.original_price}
                  onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Warenbestand</Label>
              <Input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Zustand</Label>
                <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kategorie</Label>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger><SelectValue placeholder="Wählen..." /></SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bilder (URLs, eine pro Zeile)</Label>
              <Textarea
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                rows={3}
                placeholder="https://example.com/bild1.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Technische Daten (Key: Value pro Zeile)</Label>
              <Textarea
                value={form.specs}
                onChange={(e) => setForm({ ...form, specs: e.target.value })}
                rows={4}
                placeholder={"Auflösung: 4K UHD\nWLAN: Ja\nBluetooth: 5.0"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Abbrechen</Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !form.title || !form.price || !form.category_id}
            >
              {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? "Speichern" : "Erstellen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
