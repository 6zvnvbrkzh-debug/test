import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Top padding for desktop floating header, bottom padding for mobile bottom nav */}
      <main className="flex-1 pt-0 md:pt-24 pb-24 md:pb-0">{children}</main>
      <Footer />
    </div>
  );
}
