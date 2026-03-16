import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/images/b-electronics-logo.webp" 
              alt="B.Electronics Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="font-semibold">B.Electronics</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/produkte" className="hover:text-foreground transition-signal">Produkte</Link>
            <span className="hover:text-foreground transition-signal cursor-default">Impressum</span>
            <span className="hover:text-foreground transition-signal cursor-default">AGB</span>
            <span className="hover:text-foreground transition-signal cursor-default">Datenschutz</span>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">© 2026 B.Electronics. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
