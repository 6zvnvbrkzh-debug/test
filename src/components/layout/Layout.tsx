import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Top padding for floating top nav */}
      <main className="flex-1 pt-16 lg:pt-28">{children}</main>
      <Footer />
    </div>
  );
}
