import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

const shopLinks = [
  { label: "Alle Produkte", to: "/produkte" },
  { label: "Streaming Boxen", to: "/produkte?category=streaming-box" },
  { label: "Receiver", to: "/produkte?category=receiver" },
  { label: "Zubehör", to: "/produkte?category=accessories" },
];

const legalLinks = [
  { label: "Impressum", to: "#" },
  { label: "AGB", to: "#" },
  { label: "Datenschutz", to: "#" },
  { label: "Widerrufsrecht", to: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/30">
      <div className="container py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/images/b-electronics-logo.webp"
                alt="Barbato Electronics Logo"
                className="h-9 w-9 object-contain rounded-lg"
              />
              <span className="text-sm font-bold tracking-wide">Barbato Electronics</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Dein Fachhändler für Streaming-Hardware und IPTV-Receiver. Top-Marken, schneller Versand.
            </p>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              <a
                href="mailto:info@b-electronics.shop"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors w-fit"
              >
                <Mail className="h-3.5 w-3.5 text-primary/70" strokeWidth={1.5} />
                info@b-electronics.shop
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
              <li>Mo–Fr, 9–17 Uhr</li>
              <li>1–2 Werktage Lieferzeit</li>
              <li>2 Jahre Garantie</li>
              <li>30 Tage Rückgabe</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/20">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Barbato Electronics — Alle Rechte vorbehalten
          </p>
          <span className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">
            Made in Germany
          </span>
        </div>
      </div>
    </footer>
  );
}
