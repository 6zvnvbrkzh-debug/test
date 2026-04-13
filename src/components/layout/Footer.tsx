import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

const shopLinks = [
  { label: "Alle Produkte", to: "/produkte" },
  { label: "Highlights", to: "/produkte?category=highlights" },
  { label: "Formuler Geräte", to: "/produkte?category=formuler-geraete" },
  { label: "Octagon Geräte", to: "/produkte?category=octagon-geraete" },
  { label: "Zubehör", to: "/produkte?category=zubehoer" },
];

const legalLinks = [
  { label: "Impressum", to: "/impressum" },
  { label: "AGB", to: "/agb" },
  { label: "Datenschutz", to: "/datenschutz" },
  { label: "Widerrufsrecht", to: "/widerrufsrecht" },
];

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
                <svg className="h-3.5 w-3.5 text-primary/70" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
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
              <li>2–4 Werktage Lieferzeit</li>
              <li>2 Jahre Garantie</li>
              <li>30 Tage Rückgabe</li>
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

        {/* Google Maps */}
        <div className="mt-8">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Unser Standort</h4>
          <div className="rounded-xl overflow-hidden border border-border/30">
            <iframe
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Barbato+Electronics&language=de"
              title="Barbato Electronics Standort"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
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
              src="/images/webstudio-cg-logo-red.png"
              alt="Webstudio CG Logo"
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
