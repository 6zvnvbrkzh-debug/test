import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type Status = "loading" | "valid" | "already" | "invalid" | "confirming" | "done" | "error";

export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON } },
        );
        const data = await res.json();
        if (data.valid) setStatus("valid");
        else if (data.reason === "already_unsubscribed") setStatus("already");
        else setStatus("invalid");
      } catch {
        setStatus("error");
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setStatus("confirming");
    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON },
          body: JSON.stringify({ token }),
        },
      );
      const data = await res.json();
      if (data.success || data.reason === "already_unsubscribed") setStatus("done");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout>
      <SEOHead title="Abmelden" description="E-Mail-Abmeldung" />
      <div className="container max-w-md mx-auto px-4 py-24">
        <div className="rounded-2xl border border-border bg-card p-8 backdrop-blur-2xl">
          <h1 className="text-2xl font-bold mb-4">E-Mail-Abmeldung</h1>
          {status === "loading" && <p className="text-muted-foreground">Wird geprüft …</p>}
          {status === "valid" && (
            <>
              <p className="text-muted-foreground mb-6">
                Möchtest du dich von zukünftigen E-Mails von Barbato Electronics abmelden?
              </p>
              <Button onClick={confirm} className="w-full">Abmeldung bestätigen</Button>
            </>
          )}
          {status === "confirming" && <p className="text-muted-foreground">Wird verarbeitet …</p>}
          {status === "done" && (
            <>
              <p className="mb-6">Du wurdest erfolgreich abgemeldet. Wir senden dir keine weiteren E-Mails mehr.</p>
              <Link to="/" className="text-primary underline">Zur Startseite</Link>
            </>
          )}
          {status === "already" && (
            <>
              <p className="mb-6">Du bist bereits abgemeldet.</p>
              <Link to="/" className="text-primary underline">Zur Startseite</Link>
            </>
          )}
          {status === "invalid" && <p className="text-destructive">Ungültiger oder abgelaufener Link.</p>}
          {status === "error" && <p className="text-destructive">Ein Fehler ist aufgetreten. Bitte versuche es später erneut.</p>}
        </div>
      </div>
    </Layout>
  );
}
