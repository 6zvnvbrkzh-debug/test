import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  orderId: string;
  invoiceNumber?: string | null;
  size?: "sm" | "default";
  variant?: "outline" | "ghost" | "default" | "secondary";
  className?: string;
  label?: string;
}

/**
 * Opens the generated invoice PDF in a new tab.
 * Sends the user's auth token via query param so the edge function can
 * authorize buyers and admins (Supabase strips Authorization on window.open).
 */
export function InvoiceButton({
  orderId,
  invoiceNumber,
  size = "sm",
  variant = "outline",
  className,
  label,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Bitte melde dich an, um die Rechnung zu öffnen.");
        return;
      }
      const base = import.meta.env.VITE_SUPABASE_URL as string;
      const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
      const url =
        `${base}/functions/v1/generate-invoice` +
        `?order_id=${encodeURIComponent(orderId)}` +
        `&apikey=${encodeURIComponent(apikey)}` +
        `&token=${encodeURIComponent(session.access_token)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      toast.error(err.message || "Rechnung konnte nicht geöffnet werden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      onClick={handleClick}
      disabled={loading}
      title={invoiceNumber ? `Rechnung ${invoiceNumber}` : "Rechnung herunterladen"}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
      ) : (
        <FileText className="h-3.5 w-3.5 mr-1.5" />
      )}
      {label ?? "Rechnung"}
    </Button>
  );
}
