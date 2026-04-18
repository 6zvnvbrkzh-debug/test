import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";

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
  const jsonLd = {
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
        title="FAQ – Häufige Fragen | Barbato Electronics"
        description="Antworten auf häufige Fragen zu Versand, Zahlung, Garantie, Rückgabe und unseren Streaming-Geräten."
        canonical="https://webstudiocg.store/faq"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Hilfe & Support
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-4">
              Häufige Fragen
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Alles was du über Versand, Zahlung, Garantie und unsere Geräte wissen musst.
            </p>
          </div>

          <div className="space-y-10">
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
          </div>

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
