/**
 * Supabase Storage Image Transformations helper.
 *
 * Rewrites a public storage URL to use the on-the-fly render endpoint,
 * which serves a resized + WebP-encoded variant — dramatically reducing
 * payload for product card thumbnails (was 1200×1200 → now ~500×500).
 *
 * Falls back to the original URL for non-Supabase URLs (e.g. /placeholder.svg).
 */
export interface ImgTransformOptions {
  width?: number;
  height?: number;
  quality?: number; // 20..100
  resize?: "cover" | "contain" | "fill";
}

const SUPABASE_PUBLIC_PATH = "/storage/v1/object/public/";
const SUPABASE_RENDER_PATH = "/storage/v1/render/image/public/";

export function getOptimizedImageUrl(
  url: string | undefined | null,
  opts: ImgTransformOptions = {},
): string {
  if (!url) return "";
  if (!url.includes(SUPABASE_PUBLIC_PATH)) return url; // not a Supabase storage URL

  const { width, height, quality = 75, resize = "contain" } = opts;
  const rendered = url.replace(SUPABASE_PUBLIC_PATH, SUPABASE_RENDER_PATH);

  const params = new URLSearchParams();
  if (width) params.set("width", String(width));
  if (height) params.set("height", String(height));
  params.set("quality", String(quality));
  params.set("resize", resize);

  return `${rendered}?${params.toString()}`;
}

/**
 * Build a srcSet for responsive <img srcSet>. Useful for product cards rendered
 * across mobile (≈245px) and desktop (≈300px) at 1x-2x DPR.
 */
export function getImageSrcSet(
  url: string | undefined | null,
  widths: number[],
  opts: Omit<ImgTransformOptions, "width"> = {},
): string {
  if (!url || !url.includes(SUPABASE_PUBLIC_PATH)) return "";
  return widths
    .map((w) => `${getOptimizedImageUrl(url, { ...opts, width: w })} ${w}w`)
    .join(", ");
}
