import { useState } from "react";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HoneypotField } from "@/components/security/HoneypotField";
import { useHoneypot } from "@/hooks/useHoneypot";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name zu kurz").max(100, "Name zu lang"),
  email: z.string().trim().email("Ungültige E-Mail").max(255),
  subject: z.string().trim().min(3, "Betreff zu kurz").max(200),
  message: z.string().trim().min(10, "Nachricht zu kurz").max(2000, "Nachricht zu lang"),
});

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const honeypot = useHoneypot();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!honeypot.validate()) return;

    const parsed = contactSchema.safeParse({ name, email, subject, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-message", {
        body: parsed.data,
      });
      if (error) throw error;
      setDone(true);
      toast.success("Nachricht gesendet!");
    } catch (err: any) {
      toast.error("Senden fehlgeschlagen", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Kontakt | Barbato Electronics"
        description="Schreib uns deine Frage – wir antworten in der Regel innerhalb weniger Stunden."
        canonical="https://webstudiocg.store/kontakt"
      />

      <section className="container py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Wir sind für dich da
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-4">
              Kontakt
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hast du Fragen zu einem Produkt oder deiner Bestellung? Schreib uns – wir helfen schnell und unkompliziert.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Info */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border/40 bg-card/40 p-5">
                <Mail className="h-5 w-5 text-primary mb-3" />
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">E-Mail</div>
                <a
                  href="mailto:barbato.electronics@gmail.com"
                  className="text-sm font-medium hover:text-primary transition-colors break-all"
                >
                  barbato.electronics@gmail.com
                </a>
              </div>
              <div className="rounded-2xl border border-border/40 bg-card/40 p-5">
                <MapPin className="h-5 w-5 text-primary mb-3" />
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Adresse</div>
                <p className="text-sm font-medium leading-relaxed">
                  Barbato Electronics<br />
                  Kemptnerstraße 11<br />
                  89079 Ulm
                </p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-card/40 p-5">
                <Clock className="h-5 w-5 text-primary mb-3" />
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Support-Zeiten</div>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li>Mo&nbsp;–&nbsp;Do: 9&nbsp;–&nbsp;20 Uhr</li>
                  <li>Fr: 9&nbsp;–&nbsp;21 Uhr</li>
                  <li>Sa: 10&nbsp;–&nbsp;21 Uhr</li>
                  <li>So: 10&nbsp;–&nbsp;20 Uhr</li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              {done ? (
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-10 text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 mb-4">
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Nachricht angekommen!</h2>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Vielen Dank für deine Nachricht. Wir melden uns so schnell wie möglich – meist innerhalb weniger Stunden.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8 space-y-5">
                  <HoneypotField {...honeypot.fieldProps} />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={100}
                        placeholder="Max Mustermann"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        maxLength={255}
                        placeholder="du@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Betreff</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      maxLength={200}
                      placeholder="Frage zu Produkt XY..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Nachricht</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      maxLength={2000}
                      placeholder="Hallo, ich hätte eine Frage zu..."
                    />
                    <p className="text-[11px] text-muted-foreground text-right">
                      {message.length} / 2000
                    </p>
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full sm:w-auto h-11 px-6">
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sende...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Nachricht senden
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
