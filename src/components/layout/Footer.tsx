import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowUpRight, ShieldCheck, Lock, Truck } from "lucide-react";
import { TelegramIcon } from "@/components/icons";

const shopLinks = [
  { label: "Alle Produkte", to: "/produkte" },
  { label: "Highlights", to: "/produkte?category=highlights" },
  { label: "Formuler Geräte", to: "/produkte?category=formuler-geraete" },
  { label: "Octagon Geräte", to: "/produkte?category=octagon-geraete" },
  { label: "Zubehör", to: "/produkte?category=zubehoer" },
];

const legalLinks = [
  { label: "FAQ", to: "/faq" },
  { label: "Kontakt", to: "/kontakt" },
  { label: "Impressum", to: "/impressum" },
  { label: "AGB", to: "/agb" },
  { label: "Datenschutz", to: "/datenschutz" },
  { label: "Widerrufsrecht", to: "/widerrufsrecht" },
];

function GoogleMapsConsent() {
  const [consent, setConsent] = useState(() => localStorage.getItem("maps-consent") === "true");

  const handleConsent = () => {
    localStorage.setItem("maps-consent", "true");
    setConsent(true);
  };

  return (
    <div className="mt-8">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Unser Standort</h4>
      <div className="relative rounded-xl overflow-hidden border border-border/30">
        {consent ? (
          <>
            <iframe
              src="https://www.google.com/maps?q=Barbato+Electronics&output=embed"
              title="Barbato Electronics Standort"
              width="100%"
              height="250"
              style={{ border: 0, filter: 'saturate(0.2) brightness(0.7) hue-rotate(200deg) contrast(1.15)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-primary/15 mix-blend-overlay" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 bg-muted/50 py-12 px-6 text-center">
            <MapPin className="h-8 w-8 text-muted-foreground/50" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground max-w-md">
              Mit dem Laden der Karte akzeptierst du die{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                Datenschutzerklärung von Google
              </a>.
            </p>
            <button
              onClick={handleConsent}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Karte laden
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/30">
      <div className="container py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-5 flex flex-col justify-between space-y-4">
            <Link to="/" className="inline-flex items-center gap-4 group">
              <img
                src="/images/b-electronics-logo.webp"
                alt="Barbato Electronics Logo"
                className="h-24 md:h-32 w-auto object-contain rounded-xl group-hover:scale-105 transition-transform"
              />
              <span className="text-lg md:text-xl font-bold tracking-wide">Barbato Electronics</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Dein Fachhändler für Streaming-Hardware und IPTV-Receiver. Top-Marken, schneller Versand.
            </p>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              <a
                href="mailto:barbato.electronics@gmail.com"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors w-fit"
              >
                <Mail className="h-3.5 w-3.5 text-primary/70" strokeWidth={1.5} />
                barbato.electronics@gmail.com
              </a>
              <a
                href="https://t.me/bElectronicsshop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors w-fit"
              >
                <TelegramIcon className="h-3.5 w-3.5 text-primary/70" />
                Telegram Kanal
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary/70" strokeWidth={1.5} />
                Deutschland
              </span>
            </div>
          </div>

          {/* Shop links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Service */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Rechtliches</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Service</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>2–3 Werktage Lieferzeit</li>
              <li>2 Jahre Garantie</li>
              <li>14 Tage Rückgabe</li>
            </ul>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-6 mb-3">Öffnungszeiten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Mo – Do: 9 – 20 Uhr</li>
              <li>Fr: 9 – 21 Uhr</li>
              <li>Sa: 10 – 21 Uhr</li>
              <li>So: 10 – 20 Uhr</li>
            </ul>
          </div>
        </div>

        {/* Trust: Payment & Shipping */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sichere Zahlung */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-transparent p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 border border-primary/20">
                  <ShieldCheck className="h-4.5 w-4.5 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-wide flex items-center gap-2">
                    Sichere Zahlung
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                      <Lock className="h-2.5 w-2.5" strokeWidth={2.5} /> SSL
                    </span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Verschlüsselte Zahlung über Stripe – PCI-DSS zertifiziert
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { name: "Visa", bg: "bg-white", text: "text-[#1A1F71]" },
                  { name: "Mastercard", bg: "bg-white", text: "text-[#EB001B]" },
                  { name: "AmEx", bg: "bg-white", text: "text-[#006FCF]" },
                  { name: "Klarna", bg: "bg-[#FFA8CD]", text: "text-black" },
                  { name: "PayPal", bg: "bg-white", text: "text-[#003087]" },
                  { name: "SEPA", bg: "bg-white", text: "text-foreground" },
                  { name: "Apple Pay", bg: "bg-white", text: "text-black" },
                  { name: "Google Pay", bg: "bg-white", text: "text-foreground" },
                ].map((method) => (
                  <div
                    key={method.name}
                    className={`${method.bg} ${method.text} px-2.5 py-1.5 rounded-md text-[11px] font-bold tracking-tight border border-border/30 shadow-sm`}
                  >
                    {method.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Versand */}
            <div className="rounded-2xl border border-border/40 bg-card/40 p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#FFCC00]/15 border border-[#FFCC00]/30">
                  <Truck className="h-4.5 w-4.5 text-[#FFCC00]" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-wide">Versand mit DHL</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Versand aus Deutschland – 1–2 Werktage Lieferzeit
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-[#FFCC00] text-[#D40511] px-3 py-1.5 rounded-md text-sm font-black tracking-tighter italic shadow-sm">
                  DHL
                </div>
                <div className="px-2.5 py-1.5 rounded-md text-[11px] font-medium border border-border/40 bg-background/50">
                  Sendungsverfolgung
                </div>
                <div className="px-2.5 py-1.5 rounded-md text-[11px] font-medium border border-border/40 bg-background/50">
                  Versichert
                </div>
                <div className="px-2.5 py-1.5 rounded-md text-[11px] font-medium border border-primary/30 bg-primary/10 text-primary">
                  Gratis ab 50&nbsp;€
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <GoogleMapsConsent />
      </div>

      <div className="border-t border-border/20">
        <div className="container py-6 flex flex-col items-center gap-4">
          <a
            href="https://webstudiocg.de"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 transition-all group"
          >
            <img
              src="/images/webstudio-cg-logo-red.webp"
              alt="Webstudio CG Logo"
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
              className="h-8 w-auto object-contain"
            />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Designed by
            </span>
            <span className="text-sm font-bold text-primary group-hover:text-primary/80 transition-colors">
              Webstudio CG
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary transition-colors" />
          </a>
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Barbato Electronics — Alle Rechte vorbehalten
          </p>
        </div>
      </div>
    </footer>
  );
}
