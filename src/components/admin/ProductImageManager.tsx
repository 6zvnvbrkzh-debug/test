import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload, X, GripVertical, Star } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const BUCKET = "listing-images";

function SortableImage({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted"
    >
      <img src={url} alt={`Bild ${index + 1}`} className="w-full h-full object-contain" />

      {/* Hauptbild Badge */}
      {index === 0 && (
        <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded inline-flex items-center gap-1">
          <Star className="h-2.5 w-2.5 fill-current" />
          Hauptbild
        </div>
      )}

      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        aria-label="Bild ziehen, um Reihenfolge zu ändern"
      >
        <span className="sr-only">Ziehen</span>
      </button>

      {/* Visual hint */}
      <div className="absolute bottom-1.5 left-1.5 bg-background/80 backdrop-blur rounded p-0.5 opacity-0 group-hover:opacity-100 transition pointer-events-none">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1.5 right-1.5 bg-background/90 hover:bg-destructive hover:text-destructive-foreground rounded-full p-1 transition opacity-0 group-hover:opacity-100"
        title="Bild entfernen"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Position number */}
      <div className="absolute bottom-1.5 right-1.5 bg-background/90 text-foreground text-[10px] font-mono font-semibold w-5 h-5 rounded-full flex items-center justify-center">
        {index + 1}
      </div>
    </div>
  );
}

export function ProductImageManager({ images, onChange, maxImages = 8 }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = images.indexOf(active.id as string);
    const newIndex = images.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(images, oldIndex, newIndex));
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Maximal ${maxImages} Bilder pro Produkt.`);
      return;
    }
    const toUpload = arr.slice(0, remaining);
    if (arr.length > remaining) {
      toast.warning(`Nur die ersten ${remaining} Bilder werden hochgeladen.`);
    }

    setUploading(true);
    const uploaded: string[] = [];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Nicht angemeldet");

      for (const file of toUpload) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name}: Nur Bilder erlaubt.`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: Max. 5 MB pro Bild.`);
          continue;
        }
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const path = `${user.id}/${safeName}`;

        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (upErr) {
          toast.error(`${file.name}: ${upErr.message}`);
          continue;
        }
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(pub.publicUrl);
      }

      if (uploaded.length > 0) {
        onChange([...images, ...uploaded]);
        toast.success(`${uploaded.length} Bild${uploaded.length === 1 ? "" : "er"} hochgeladen`);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = async (idx: number) => {
    const url = images[idx];
    const next = images.filter((_, i) => i !== idx);
    onChange(next);

    // Try to extract storage path from public URL and delete the file from the bucket.
    // Public URL format: <SUPABASE_URL>/storage/v1/object/public/<bucket>/<path>
    try {
      const marker = `/storage/v1/object/public/${BUCKET}/`;
      const i = url.indexOf(marker);
      if (i === -1) return; // External URL — nothing to delete in our bucket.
      const path = decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
      if (!path) return;

      const { error } = await supabase.storage.from(BUCKET).remove([path]);
      if (error) {
        // Non-fatal: image is already removed from the product; just inform.
        toast.warning(`Bild entfernt, aber Datei konnte nicht aus dem Speicher gelöscht werden: ${error.message}`);
      }
    } catch {
      // Silent fail — UI state is already updated.
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {images.length} / {maxImages} Bilder · Erstes Bild = Hauptbild · Ziehen zum Sortieren
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5 mr-1.5" />
          )}
          Bilder hochladen
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
      />

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`w-full border-2 border-dashed rounded-lg py-10 px-4 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground transition ${
            dragOver
              ? "border-primary bg-primary/5 text-foreground"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <Upload className="h-6 w-6" />
          <span className="font-medium">Bilder hier ablegen oder klicken zum Auswählen</span>
          <span className="text-xs">PNG, JPG, WEBP · max. 5&nbsp;MB pro Bild</span>
        </button>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-lg p-2 transition ${
            dragOver ? "bg-primary/5 ring-2 ring-primary" : ""
          }`}
        >
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((url, idx) => (
                  <SortableImage
                    key={url}
                    url={url}
                    index={idx}
                    onRemove={() => removeImage(idx)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {dragOver && (
            <p className="text-xs text-center text-primary mt-2 font-medium">
              Loslassen, um weitere Bilder hinzuzufügen
            </p>
          )}
        </div>
      )}
    </div>
  );
}
