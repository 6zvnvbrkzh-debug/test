import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Lazy-load non-critical font weights after initial render to keep them out of
// the critical request chain (LCP optimization). They'll be applied as soon as
// they're available; until then, the browser falls back to weight 400.
if (typeof window !== "undefined") {
  const loadDeferredFonts = () => {
    void import("@fontsource/space-grotesk/500.css");
    void import("@fontsource/space-grotesk/600.css");
    void import("@fontsource/space-grotesk/700.css");
    void import("@fontsource/jetbrains-mono/500.css");
  };
  if ("requestIdleCallback" in window) {
    (window as Window & typeof globalThis).requestIdleCallback(loadDeferredFonts, { timeout: 2000 });
  } else {
    setTimeout(loadDeferredFonts, 200);
  }
}
