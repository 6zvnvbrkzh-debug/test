import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Top padding clears: mobile top-bar (~52px) + bottom-tab nav (~64px) on mobile, floating nav on desktop */}
      <main className="flex-1 pt-[120px] lg:pt-28">{children}</main>
      <Footer />
    </div>
  );
}
