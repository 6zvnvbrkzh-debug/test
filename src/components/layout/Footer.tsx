import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

const productLinks = [
  { to: "/produkte?category=streaming-box", label: "Streaming Boxen" },
  { to: "/produkte?category=receiver", label: "Receiver" },
  { to: "/produkte", label: "Alle Produkte" },
];

const legalLinks = [
  { label: "Impressum", to: "#" },
  { label: "AGB", to: "#" },
  { label: "Datenschutz", to: "#" },
  { label: "Widerrufsbelehrung", to: "#" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/50">
      {/* Gradient accent top */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="bg-card/30 backdrop-blur-sm">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-5 space-y-4">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="relative">
                  <img
                    src="/images/b-electronics-logo.webp"
                    alt="B.Electronics Logo"
                    className="h-11 w-11 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wide leading-none">B.Electronics</span>
                  <span className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">
                    Streaming & Hardware
                  </span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Ihr Fachhändler für Streaming-Hardware, IPTV-Receiver und Zubehör.
                Top-Marken wie Octagon und Formuler – schnell geliefert mit persönlichem Service.
              </p>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="mailto:info@b-electronics.shop" className="inline-flex items-center gap-2 hover:text-foreground transition-colors w-fit">
                  <Mail className="h-3.5 w-3.5 text-primary/70" strokeWidth={1.5} />
                  info@b-electronics.shop
                </a>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary/70" strokeWidth={1.5} />
                  Deutschland
                </span>
              </div>
            </div>

            {/* Products */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Produkte
              </h4>
              <ul className="space-y-2.5">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Rechtliches
              </h4>
              <ul className="space-y-2.5">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter / CTA */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Service
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <span className="text-sm text-muted-foreground inline-flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary/70" strokeWidth={1.5} />
                    Mo–Fr, 9–17 Uhr
                  </span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">2–3 Werktage Lieferzeit</span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">Händlergarantie</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/40">
          <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} B.Electronics. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                Made with ♥ in Germany
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
