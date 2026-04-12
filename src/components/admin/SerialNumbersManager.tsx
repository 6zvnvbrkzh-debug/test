import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Hash } from "lucide-react";

interface SerialNumbersManagerProps {
  listingId: string;
  listingTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SerialNumbersManager({ listingId, listingTitle, open, onOpenChange }: SerialNumbersManagerProps) {
  const queryClient = useQueryClient();
  const [newSerials, setNewSerials] = useState("");

  const { data: serials, isLoading } = useQuery({
    queryKey: ["serial-numbers", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("serial_numbers")
        .select("*")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const addMutation = useMutation({
    mutationFn: async (serialNumbers: string[]) => {
      const rows = serialNumbers.map((sn) => ({
        listing_id: listingId,
        serial_number: sn,
      }));
      const { error } = await supabase.from("serial_numbers").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serial-numbers", listingId] });
      toast.success("Seriennummern hinzugefügt");
      setNewSerials("");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("serial_numbers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serial-numbers", listingId] });
      toast.success("Seriennummer gelöscht");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleAdd = () => {
    const lines = newSerials
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length === 0) return;
    addMutation.mutate(lines);
  };

  const availableCount = serials?.filter((s) => s.status === "available").length ?? 0;
  const soldCount = serials?.filter((s) => s.status === "sold").length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Seriennummern – {listingTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 text-sm">
          <Badge variant="default">{availableCount} verfügbar</Badge>
          <Badge variant="secondary">{soldCount} verkauft</Badge>
          <Badge variant="outline">{(serials?.length ?? 0)} gesamt</Badge>
        </div>

        {/* Add new serial numbers */}
        <div className="space-y-2">
          <Label>Neue Seriennummern (eine pro Zeile)</Label>
          <Textarea
            value={newSerials}
            onChange={(e) => setNewSerials(e.target.value)}
            rows={3}
            placeholder={"SN-001\nSN-002\nSN-003"}
          />
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={addMutation.isPending || !newSerials.trim()}
          >
            {addMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Hinzufügen
          </Button>
        </div>

        {/* List existing serial numbers */}
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : serials && serials.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seriennummer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serials.map((sn) => (
                  <TableRow key={sn.id}>
                    <TableCell className="font-mono text-sm">{sn.serial_number}</TableCell>
                    <TableCell>
                      <Badge variant={sn.status === "available" ? "default" : "secondary"}>
                        {sn.status === "available" ? "Verfügbar" : "Verkauft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {sn.status === "available" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => {
                            if (confirm("Seriennummer löschen?")) deleteMutation.mutate(sn.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Keine Seriennummern hinterlegt
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Schließen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
