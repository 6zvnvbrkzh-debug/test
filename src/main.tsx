import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Lazy-load non-critical font weights after initial render to keep them out of
// the critical request chain (LCP optimization). Injects @font-face rules directly
// to avoid render-blocking CSS stubs from @fontsource. Until loaded, the browser
// falls back to weight 400.
if (typeof window !== "undefined") {
  const loadDeferredFonts = async () => {
    const [sg500, sg600, sg700, jb500] = await Promise.all([
      import("@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2?url"),
      import("@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2?url"),
      import("@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2?url"),
      import("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2?url"),
    ]);
    const style = document.createElement("style");
    style.textContent = `
      @font-face{font-family:'Space Grotesk';font-style:normal;font-display:swap;font-weight:500;src:url(${sg500.default}) format('woff2')}
      @font-face{font-family:'Space Grotesk';font-style:normal;font-display:swap;font-weight:600;src:url(${sg600.default}) format('woff2')}
      @font-face{font-family:'Space Grotesk';font-style:normal;font-display:swap;font-weight:700;src:url(${sg700.default}) format('woff2')}
      @font-face{font-family:'JetBrains Mono';font-style:normal;font-display:swap;font-weight:500;src:url(${jb500.default}) format('woff2')}
    `;
    document.head.appendChild(style);
  };
  if ("requestIdleCallback" in window) {
    (window as Window & typeof globalThis).requestIdleCallback(() => void loadDeferredFonts(), { timeout: 2000 });
  } else {
    setTimeout(() => void loadDeferredFonts(), 200);
  }
}
