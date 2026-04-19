/**
 * Client-side image optimization:
 * - Resize to max width (preserves aspect ratio, never upscales)
 * - Convert to WebP (keeps transparency for PNG inputs)
 * - Skips already small/optimized files when conversion would not help
 */
export interface OptimizeOptions {
  maxWidth?: number;
  quality?: number; // 0..1
}

const DEFAULT_OPTS: Required<OptimizeOptions> = {
  maxWidth: 1600,
  quality: 0.82,
};

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

export async function optimizeImage(
  file: File,
  options: OptimizeOptions = {},
): Promise<{ blob: Blob; ext: string; mime: string }> {
  const { maxWidth, quality } = { ...DEFAULT_OPTS, ...options };

  // Pass through unsupported / animated formats (gif, svg) — let the browser/server handle them.
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return { blob: file, ext: file.type === "image/gif" ? "gif" : "svg", mime: file.type };
  }

  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch {
    // If decoding fails, upload the original.
    return { blob: file, ext: (file.name.split(".").pop() || "bin").toLowerCase(), mime: file.type };
  }

  const scale = img.naturalWidth > maxWidth ? maxWidth / img.naturalWidth : 1;
  const targetW = Math.round(img.naturalWidth * scale);
  const targetH = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { blob: file, ext: (file.name.split(".").pop() || "bin").toLowerCase(), mime: file.type };
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const webp = await canvasToBlob(canvas, "image/webp", quality);
  if (webp && webp.size > 0 && webp.size < file.size) {
    return { blob: webp, ext: "webp", mime: "image/webp" };
  }

  // WebP not supported or no benefit — keep original.
  return {
    blob: file,
    ext: (file.name.split(".").pop() || "bin").toLowerCase(),
    mime: file.type,
  };
}
