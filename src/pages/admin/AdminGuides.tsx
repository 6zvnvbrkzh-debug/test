import { useState } from "react";
import { useAllGuidesAdmin, type Guide } from "@/hooks/useGuides";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface GuideFormState {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string;
  reading_time_minutes: number;
  status: "draft" | "published";
  seo_title: string;
  seo_description: string;
  sort_order: number;
}

const emptyForm: GuideFormState = {
  slug: "",
  title: "",
  subtitle: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  category: "Anleitung",
  reading_time_minutes: 5,
  status: "draft",
  seo_title: "",
  seo_description: "",
  sort_order: 0,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);

export default function AdminGuides() {
  const { data: guides = [], isLoading } = useAllGuidesAdmin();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Guide | null>(null);
  const [form, setForm] = useState<GuideFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["guides"] });
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (g: Guide) => {
    setEditing(g);
    setForm({
      slug: g.slug,
      title: g.title,
      subtitle: g.subtitle ?? "",
      excerpt: g.excerpt,
      content: g.content,
      cover_image_url: g.cover_image_url ?? "",
      category: g.category,
      reading_time_minutes: g.reading_time_minutes,
      status: g.status,
      seo_title: g.seo_title ?? "",
      seo_description: g.seo_description ?? "",
      sort_order: g.sort_order,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim() || !form.slug.trim()) {
      toast.error("Slug, Titel, Excerpt und Inhalt sind Pflichtfelder");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        excerpt: form.excerpt.trim(),
        content: form.content,
        cover_image_url: form.cover_image_url.trim() || null,
        category: form.category.trim() || "Anleitung",
        reading_time_minutes: Number(form.reading_time_minutes) || 5,
        status: form.status,
        seo_title: form.seo_title.trim() || null,
        seo_description: form.seo_description.trim() || null,
        sort_order: Number(form.sort_order) || 0,
        published_at:
          form.status === "published"
            ? editing?.published_at ?? new Date().toISOString()
            : null,
      };

      if (editing) {
        const { error } = await supabase.from("guides").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Ratgeber aktualisiert");
      } else {
        const { error } = await supabase.from("guides").insert(payload);
        if (error) throw error;
        toast.success("Ratgeber erstellt");
      }
      setOpen(false);
      invalidate();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
      toast.error(`Fehler: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (g: Guide) => {
    if (!confirm(`Ratgeber „${g.title}“ wirklich löschen?`)) return;
    const { error } = await supabase.from("guides").delete().eq("id", g.id);
    if (error) {
      toast.error(`Löschen fehlgeschlagen: ${error.message}`);
      return;
    }
    toast.success("Ratgeber gelöscht");
    invalidate();
  };

  const togglePublish = async (g: Guide) => {
    const newStatus = g.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("guides")
      .update({
        status: newStatus,
        published_at: newStatus === "published" ? g.published_at ?? new Date().toISOString() : null,
      })
      .eq("id", g.id);
    if (error) {
      toast.error(`Statusänderung fehlgeschlagen: ${error.message}`);
      return;
    }
    toast.success(newStatus === "published" ? "Veröffentlicht" : "Auf Entwurf gesetzt");
    invalidate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ratgeber</h1>
          <p className="text-sm text-muted-foreground">
            SEO-Artikel, die im FAQ-Bereich unter „Ratgeber“ erscheinen.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/faq?tab=ratgeber" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Öffentliche Ansicht
            </Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Neuer Ratgeber
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? "Ratgeber bearbeiten" : "Neuer Ratgeber"}</DialogTitle>
                <DialogDescription>
                  Inhalt unterstützt HTML (z.B. &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;a href&gt;, &lt;img&gt;).
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titel *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          title,
                          slug: !editing && !prev.slug ? slugify(title) : prev.slug,
                        }));
                      }}
                      placeholder="z.B. IPTV richtig einrichten"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL) *</Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                      placeholder="iptv-richtig-einrichten"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Untertitel</Label>
                  <Input
                    id="subtitle"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="Schritt-für-Schritt-Anleitung für Einsteiger"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Kurzbeschreibung (Excerpt) *</Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="1–2 Sätze, die im Karten-Grid und als Meta-Description erscheinen."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Inhalt (HTML) *</Label>
                  <Textarea
                    id="content"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="<h2>Einleitung</h2><p>...</p>"
                    rows={14}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategorie</Label>
                    <Input
                      id="category"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="Anleitung / Vergleich / Tipps"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reading_time">Lesezeit (min)</Label>
                    <Input
                      id="reading_time"
                      type="number"
                      min={1}
                      value={form.reading_time_minutes}
                      onChange={(e) =>
                        setForm({ ...form, reading_time_minutes: Number(e.target.value) || 1 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sort">Sortierung</Label>
                    <Input
                      id="sort"
                      type="number"
                      value={form.sort_order}
                      onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover">Cover-Bild URL</Label>
                  <Input
                    id="cover"
                    value={form.cover_image_url}
                    onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seo_title">SEO-Titel (optional)</Label>
                    <Input
                      id="seo_title"
                      value={form.seo_title}
                      onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                      placeholder="Wenn leer: Titel wird genutzt"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => setForm({ ...form, status: v as "draft" | "published" })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Entwurf</SelectItem>
                        <SelectItem value="published">Veröffentlicht</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_description">SEO-Beschreibung (optional)</Label>
                  <Textarea
                    id="seo_description"
                    value={form.seo_description}
                    onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                    placeholder="Wenn leer: Excerpt wird genutzt"
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                  Abbrechen
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                  {editing ? "Speichern" : "Erstellen"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Lade…
          </div>
        ) : guides.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            Noch keine Ratgeber vorhanden. Erstelle deinen ersten Artikel.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Sort</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guides.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>
                    <div className="font-medium">{g.title}</div>
                    <div className="text-xs text-muted-foreground">/ratgeber/{g.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{g.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => togglePublish(g)}
                      className="cursor-pointer"
                      title="Status wechseln"
                    >
                      {g.status === "published" ? (
                        <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-transparent">
                          Veröffentlicht
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Entwurf</Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {g.sort_order}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      {g.status === "published" && (
                        <Button asChild variant="ghost" size="icon" title="Ansehen">
                          <Link to={`/ratgeber/${g.slug}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => openEdit(g)} title="Bearbeiten">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(g)}
                        title="Löschen"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
