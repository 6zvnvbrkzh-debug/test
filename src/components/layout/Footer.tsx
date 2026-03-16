import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-surface-sunken mt-auto">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
                <span className="text-primary-foreground font-bold text-[10px] tracking-tighter">B</span>
              </div>
              <span className="font-bold tracking-tight">B-Electronics</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Dein Shop für Streaming-Hardware & Zubehör.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Produkte</h4>
            <div className="space-y-2.5">
              <Link to="/produkte?category=streaming-box" className="block text-sm text-foreground/70 hover:text-primary transition-signal">Streaming Boxen</Link>
              <Link to="/produkte?category=receiver" className="block text-sm text-foreground/70 hover:text-primary transition-signal">Receiver</Link>
              <Link to="/produkte?category=accessories" className="block text-sm text-foreground/70 hover:text-primary transition-signal">Zubehör</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Kontakt</h4>
            <div className="space-y-2.5">
              <span className="block text-sm text-foreground/70">Über uns</span>
              <span className="block text-sm text-foreground/70">Support</span>
              <span className="block text-sm text-foreground/70">AGB</span>
              <span className="block text-sm text-foreground/70">Impressum</span>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t">
          <p className="text-xs text-muted-foreground font-mono-data">© 2026 B-Electronics. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
