import { useEffect } from "react";

interface ProductMeta {
  price: number;
  currency?: string;
  availability?: "in stock" | "out of stock" | "preorder";
  condition?: "new" | "refurbished" | "used";
  brand?: string;
  retailerItemId?: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  type?: "website" | "product";
  noindex?: boolean;
  ogImage?: string;
  ogImages?: string[];
  jsonLd?: Record<string, unknown>;
  product?: ProductMeta;
}

export const BASE_URL = "https://b-electronics.shop";
const DEFAULT_OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e89a4a51-2d74-4f68-8184-64bc47152114/id-preview-0ac99a76--9b92000a-9016-4ffd-953d-1b740cd041f0.lovable.app-1774352734641.png";

export function SEOHead({
  title,
  description,
  canonical,
  type = "website",
  noindex = false,
  ogImage,
  ogImages,
  jsonLd,
  product,
}: SEOHeadProps) {
  const fullTitle = `${title} | Barbato Electronics`;
  const canonicalUrl = `${BASE_URL}${canonical ?? ""}`;
  // Truncate descriptions to 160 chars (search-result limit) — break at last word boundary.
  const truncatedDescription = description.length > 160
    ? description.slice(0, 157).replace(/\s+\S*$/, "").trimEnd() + "…"
    : description;
  const images = (ogImages && ogImages.length > 0 ? ogImages : [ogImage || DEFAULT_OG_IMAGE]).filter(Boolean) as string[];
  const primaryImage = images[0];
  const imagesKey = images.join("|");

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const removeMeta = (attr: "name" | "property", key: string) => {
      document.querySelectorAll(`meta[${attr}="${key}"]`).forEach((el) => el.remove());
    };

    setMeta("name", "description", truncatedDescription);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", truncatedDescription);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", "Barbato Electronics");
    setMeta("property", "og:locale", "de_DE");

    // Multiple og:image tags — first one is used by WhatsApp/Telegram
    document
      .querySelectorAll(
        'meta[property="og:image"], meta[property="og:image:alt"], meta[property="og:image:width"], meta[property="og:image:height"]',
      )
      .forEach((el) => el.remove());
    images.forEach((img) => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:image");
      m.setAttribute("content", img);
      document.head.appendChild(m);
    });
    if (primaryImage) {
      setMeta("property", "og:image:alt", title);
      setMeta("property", "og:image:width", "1200");
      setMeta("property", "og:image:height", "630");
    }

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", truncatedDescription);
    if (primaryImage) setMeta("name", "twitter:image", primaryImage);

    // Product-specific OG tags (used by WhatsApp/Telegram/Pinterest for rich previews)
    const productKeys = [
      "product:price:amount",
      "product:price:currency",
      "product:availability",
      "product:condition",
      "product:brand",
      "product:retailer_item_id",
      "og:price:amount",
      "og:price:currency",
      "og:availability",
    ];
    productKeys.forEach((k) => removeMeta("property", k));

    if (product) {
      const currency = product.currency ?? "EUR";
      setMeta("property", "product:price:amount", product.price.toFixed(2));
      setMeta("property", "product:price:currency", currency);
      setMeta("property", "og:price:amount", product.price.toFixed(2));
      setMeta("property", "og:price:currency", currency);
      if (product.availability) {
        setMeta("property", "product:availability", product.availability);
        setMeta("property", "og:availability", product.availability);
      }
      if (product.condition) setMeta("property", "product:condition", product.condition);
      if (product.brand) setMeta("property", "product:brand", product.brand);
      if (product.retailerItemId) setMeta("property", "product:retailer_item_id", product.retailerItemId);
    }

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
  }, [fullTitle, description, canonicalUrl, type, noindex, primaryImage, imagesKey, jsonLd, product, title, images]);

  return null;
}
