import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">S</span>
              </div>
              <span className="font-bold tracking-tight">Signal</span>
            </div>
            <p className="text-sm text-muted-foreground">The marketplace for streaming hardware.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Browse</h4>
            <div className="space-y-2">
              <Link to="/marketplace?category=streaming-box" className="block text-sm text-muted-foreground hover:text-foreground transition-signal">Streaming Boxes</Link>
              <Link to="/marketplace?category=receiver" className="block text-sm text-muted-foreground hover:text-foreground transition-signal">Receivers</Link>
              <Link to="/marketplace?category=accessories" className="block text-sm text-muted-foreground hover:text-foreground transition-signal">Accessories</Link>
              <Link to="/marketplace?category=remote" className="block text-sm text-muted-foreground hover:text-foreground transition-signal">Remotes</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Sell</h4>
            <div className="space-y-2">
              <Link to="/create-listing" className="block text-sm text-muted-foreground hover:text-foreground transition-signal">Create Listing</Link>
              <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-signal">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">About</span>
              <span className="block text-sm text-muted-foreground">Support</span>
              <span className="block text-sm text-muted-foreground">Terms</span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">© 2026 Signal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
