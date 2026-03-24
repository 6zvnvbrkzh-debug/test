import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

const links = [
  { label: "Shop", to: "/produkte" },
  { label: "Impressum", to: "#" },
  { label: "AGB", to: "#" },
  { label: "Datenschutz", to: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/30 mb-28">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-6 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/images/b-electronics-logo.webp"
                alt="B.Electronics Logo"
                className="h-10 w-10 object-contain rounded-lg"
              />
              <span className="text-sm font-semibold tracking-wide">B.Electronics</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Ihr Fachhändler für Streaming-Hardware, IPTV-Receiver und Zubehör.
              Top-Marken – schnell geliefert mit persönlichem Service.
            </p>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
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

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Service</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>Mo–Fr, 9–17 Uhr</li>
              <li>2–3 Werktage Lieferzeit</li>
              <li>Händlergarantie</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border/20">
        <div className="container py-5 flex items-center justify-between">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} B.Electronics
          </p>
          <span className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">
            Made in Germany
          </span>
        </div>
      </div>
    </footer>
  );
}
