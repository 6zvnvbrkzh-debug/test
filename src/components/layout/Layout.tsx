import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Bottom padding for floating bottom nav */}
      <main className="flex-1 pb-28">{children}</main>
      <Footer />
    </div>
  );
}
