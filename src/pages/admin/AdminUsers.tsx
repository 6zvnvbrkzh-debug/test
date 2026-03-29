import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Shield } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export default function AdminUsers() {
  const queryClient = useQueryClient();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // Remove existing roles
      await supabase.from("user_roles").delete().eq("user_id", userId);
      if (role !== "none") {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: role as any });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast.success("Rolle aktualisiert");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const getUserRole = (userId: string) => {
    const userRole = roles?.find((r) => r.user_id === userId);
    return userRole?.role || "none";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Benutzer</h1>
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" />
          {profiles?.length || 0} Benutzer
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Standort</TableHead>
                <TableHead>Registriert</TableHead>
                <TableHead>Rolle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} className="w-8 h-8 rounded-full object-cover" alt="" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {(profile.display_name || "?")[0].toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{profile.display_name || "Unbenannt"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {profile.location || "–"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString("de-DE")}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={getUserRole(profile.user_id)}
                      onValueChange={(role) =>
                        roleMutation.mutate({ userId: profile.user_id, role })
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Kein</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {profiles?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Keine Benutzer vorhanden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
