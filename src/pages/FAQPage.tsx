import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useSearchParams } from "react-router-dom";
import { MessageCircle, Mail, BookOpen, HelpCircle, Clock, ArrowRight, Loader2 } from "lucide-react";
import { usePublishedGuides } from "@/hooks/useGuides";

const faqs: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: "Versand & Lieferung",
    items: [
      {
        q: "Wie lange dauert der Versand?",
        a: "Wir versenden alle Bestellungen aus Deutschland mit DHL. Die Lieferzeit beträgt in der Regel 2–4 Werktage nach Zahlungseingang.",
      },
      {
        q: "Was kostet der Versand?",
        a: "Der Versand innerhalb Deutschlands kostet 5,99\u00A0€. Ab einem Bestellwert von 50\u00A0€ liefern wir versandkostenfrei. Wir versenden auch nach Österreich und in die Schweiz.",
      },
      {
        q: "Erhalte ich eine Sendungsverfolgung?",
        a: "Ja. Sobald deine Bestellung versandt wurde, erhältst du eine E-Mail mit der DHL-Tracking-Nummer. Den Status kannst du auch jederzeit in deinem Konto unter „Meine Bestellungen“ einsehen.",
      },
    ],
  },
  {
    category: "Zahlung & Sicherheit",
    items: [
      {
        q: "Welche Zahlungsmethoden bietet ihr an?",
        a: "Wir akzeptieren Kreditkarten (Visa, Mastercard, AmEx), PayPal, Klarna, SEPA-Lastschrift, Apple Pay und Google Pay. Die Abwicklung erfolgt sicher über Stripe (PCI-DSS zertifiziert).",
      },
      {
        q: "Sind meine Zahlungsdaten sicher?",
        a: "Ja. Sämtliche Zahlungen werden über eine SSL-verschlüsselte Verbindung an unseren Zahlungsdienstleister Stripe übermittelt. Wir selbst speichern keine Karten- oder Kontodaten.",
      },
      {
        q: "Kann ich auf Rechnung bestellen?",
        a: "Ja, über Klarna kannst du den Rechnungskauf auswählen. Die Bedingungen werden dir während des Checkouts angezeigt.",
      },
    ],
  },
  {
    category: "Garantie & Rückgabe",
    items: [
      {
        q: "Wie lange habe ich Garantie?",
        a: "Auf alle Neugeräte erhältst du 2 Jahre gesetzliche Gewährleistung. Bei Problemen kontaktiere uns einfach – wir kümmern uns schnell um eine Lösung.",
      },
      {
        q: "Kann ich meine Bestellung zurückgeben?",
        a: "Ja. Du hast 14 Tage Widerrufsrecht ab Erhalt der Ware. Die Ware muss vollständig und originalverpackt zurückgesendet werden. Details findest du in unserem Widerrufsrecht.",
      },
      {
        q: "Was passiert wenn mein Gerät defekt ankommt?",
        a: "Schreib uns sofort eine E-Mail mit Fotos. Wir tauschen das Gerät kostenfrei aus oder erstatten den Kaufpreis – ganz wie du möchtest.",
      },
    ],
  },
  {
    category: "Geräte & Technik",
    items: [
      {
        q: "Welche Marken führt ihr?",
        a: "Wir sind spezialisiert auf hochwertige Streaming- und IPTV-Geräte der Marken Formuler und Octagon sowie passendes Zubehör wie Fernbedienungen und HDMI-Kabel.",
      },
      {
        q: "Sind die Geräte freigeschaltet / kann ich IPTV einrichten?",
        a: "Alle unsere Geräte werden im Originalzustand des Herstellers ausgeliefert. Bei Fragen zur Einrichtung helfen wir dir gerne über Telegram oder WhatsApp weiter.",
      },
      {
        q: "Funktionieren die Geräte mit meinem Provider?",
        a: "Unsere Geräte unterstützen die gängigen Standards (M3U, Xtream Codes, Stalker-Portal). Ob dein Provider kompatibel ist, kannst du in unserem Telegram-Kanal erfragen.",
      },
    ],
  },
  {
    category: "Konto & Bestellung",
    items: [
      {
        q: "Muss ich ein Konto erstellen um zu bestellen?",
        a: "Nein, du kannst auch als Gast bestellen. Mit einem Konto siehst du jedoch deine Bestellhistorie, Tracking-Nummern und kannst Produkte auf deine Wunschliste setzen.",
      },
      {
        q: "Wo finde ich meine Rechnung?",
        a: "Nach dem Kauf erhältst du eine Bestellbestätigung per E-Mail. Eine offizielle Rechnung senden wir dir nach Versand zu. Bei Fragen melde dich gerne.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "ratgeber" ? "ratgeber" : "faq";
  const [tab, setTab] = useState<"faq" | "ratgeber">(initialTab);
  const { data: guides = [], isLoading: guidesLoading } = usePublishedGuides();

  const handleTabChange = (value: string) => {
    const next = value === "ratgeber" ? "ratgeber" : "faq";
    setTab(next);
    if (next === "ratgeber") {
      setSearchParams({ tab: "ratgeber" }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((cat) =>
      cat.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <Layout>
      <SEOHead
        title={tab === "ratgeber" ? "Ratgeber & Anleitungen" : "FAQ – Häufige Fragen"}
        description={
          tab === "ratgeber"
            ? "Anleitungen, Tipps und Vergleiche rund um Streaming-Hardware, IPTV-Receiver und Heimkino."
            : "Antworten auf häufige Fragen zu Versand, Zahlung, Garantie, Rückgabe und unseren Streaming-Geräten."
        }
        canonical="/faq"
        jsonLd={tab === "faq" ? faqJsonLd : undefined}
      />

      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Hilfe & Wissen
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-4">
              {tab === "ratgeber" ? "Ratgeber & Anleitungen" : "Häufige Fragen"}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {tab === "ratgeber"
                ? "Alles was du über Einrichtung, Vergleiche und Best Practices wissen musst."
                : "Alles was du über Versand, Zahlung, Garantie und unsere Geräte wissen musst."}
            </p>
          </div>

          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-10 h-12 bg-muted/40 p-1 rounded-xl">
              <TabsTrigger value="faq" className="rounded-lg gap-2 text-sm font-medium data-[state=active]:bg-background">
                <HelpCircle className="h-4 w-4" />
                Häufige Fragen
              </TabsTrigger>
              <TabsTrigger value="ratgeber" className="rounded-lg gap-2 text-sm font-medium data-[state=active]:bg-background">
                <BookOpen className="h-4 w-4" />
                Ratgeber
                {guides.length > 0 && (
                  <span className="text-[10px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full ml-0.5">
                    {guides.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* FAQ TAB */}
            <TabsContent value="faq" className="space-y-10 mt-0">
              {faqs.map((cat) => (
                <div key={cat.category}>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    {cat.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {cat.items.map((item, idx) => (
                      <AccordionItem
                        key={idx}
                        value={`${cat.category}-${idx}`}
                        className="border border-border/40 rounded-xl px-4 bg-card/40"
                      >
                        <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </TabsContent>

            {/* RATGEBER TAB */}
            <TabsContent value="ratgeber" className="mt-0">
              {guidesLoading ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : guides.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center">
                  <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" strokeWidth={1.5} />
                  <p className="text-sm text-muted-foreground">
                    Bald verfügbar – wir arbeiten an hilfreichen Ratgeber-Artikeln für dich.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guides.map((guide) => (
                    <Link
                      key={guide.id}
                      to={`/ratgeber/${guide.slug}`}
                      className="group block rounded-2xl border border-border/40 bg-card/40 overflow-hidden hover:border-primary/40 hover:shadow-[0_0_30px_-12px_hsl(var(--primary)/0.25)] transition-all duration-300"
                    >
                      {guide.cover_image_url && (
                        <div className="aspect-[16/9] overflow-hidden bg-muted/40">
                          <img
                            src={guide.cover_image_url}
                            alt={guide.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest">
                          <span className="text-primary">{guide.category}</span>
                          <span className="text-muted-foreground/50">·</span>
                          <span className="text-muted-foreground inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {guide.reading_time_minutes}\u00A0min
                          </span>
                        </div>
                        <h3 className="text-lg font-bold tracking-tight leading-snug group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {guide.excerpt}
                        </p>
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary pt-1">
                          Weiterlesen
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Contact CTA */}
          <div className="mt-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-transparent p-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Frage nicht beantwortet?</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Schreib uns – wir antworten in der Regel innerhalb weniger Stunden.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/kontakt"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Kontaktformular
              </Link>
              <a
                href="https://t.me/bElectronicsshop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-border/60 bg-background text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Telegram-Kanal
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
