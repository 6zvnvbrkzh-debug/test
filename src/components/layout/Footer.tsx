import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-surface-sunken mt-auto">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
                <span className="text-primary-foreground font-bold text-[10px] tracking-tighter">SG</span>
              </div>
              <span className="font-bold tracking-tight">Signal</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Der Marktplatz für Streaming-Hardware.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Durchsuchen</h4>
            <div className="space-y-2.5">
              <Link to="/marketplace?category=streaming-box" className="block text-sm text-foreground/70 hover:text-primary transition-signal">Streaming Boxen</Link>
              <Link to="/marketplace?category=receiver" className="block text-sm text-foreground/70 hover:text-primary transition-signal">Receiver</Link>
              <Link to="/marketplace?category=accessories" className="block text-sm text-foreground/70 hover:text-primary transition-signal">Zubehör</Link>
              <Link to="/marketplace?category=remote" className="block text-sm text-foreground/70 hover:text-primary transition-signal">Fernbedienungen</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Verkaufen</h4>
            <div className="space-y-2.5">
              <Link to="/create-listing" className="block text-sm text-foreground/70 hover:text-primary transition-signal">Anzeige erstellen</Link>
              <Link to="/dashboard" className="block text-sm text-foreground/70 hover:text-primary transition-signal">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Unternehmen</h4>
            <div className="space-y-2.5">
              <span className="block text-sm text-foreground/70">Über uns</span>
              <span className="block text-sm text-foreground/70">Support</span>
              <span className="block text-sm text-foreground/70">AGB</span>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t">
          <p className="text-xs text-muted-foreground font-mono-data">© 2026 Signal. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
