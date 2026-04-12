import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  type?: "website" | "product";
  noindex?: boolean;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = "https://b-electronics.shop";
const DEFAULT_OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e89a4a51-2d74-4f68-8184-64bc47152114/id-preview-0ac99a76--9b92000a-9016-4ffd-953d-1b740cd041f0.lovable.app-1774352734641.png";

export function SEOHead({ title, description, canonical, type = "website", noindex = false, ogImage, jsonLd }: SEOHeadProps) {
  const fullTitle = `${title} | Barbato Electronics`;
  const canonicalUrl = `${BASE_URL}${canonical ?? ""}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:type", type);
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", "Barbato Electronics");
    setMeta("property", "og:locale", "de_DE");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // Canonical
    if (!noindex) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonicalUrl);
    } else {
      const link = document.querySelector('link[rel="canonical"]');
      if (link) link.remove();
    }

    // JSON-LD
    const scriptId = "seo-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [fullTitle, description, canonicalUrl, type, noindex, image, jsonLd]);

  return null;
}
