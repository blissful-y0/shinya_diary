const CF_IMAGES_ACCOUNT_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH;

export const ImageVariants = {
  public: "public",
  thumbnail: "thumbnail",
  avatar: "avatar",
  avatarLarge: "avatar-lg",
  diary: "diary",
  diaryThumb: "diary-thumb",
  cover: "cover",
  coverThumb: "cover-thumb",
} as const;

export type ImageVariant = keyof typeof ImageVariants;

export function isCloudflareImageUrl(url: string): boolean {
  return url.includes("imagedelivery.net");
}

export function getImageWithVariant(
  url: string | null | undefined,
  variant: ImageVariant = "public"
): string | null {
  if (!url) return null;

  if (!isCloudflareImageUrl(url)) {
    return url;
  }

  const parts = url.split("/");
  parts[parts.length - 1] = ImageVariants[variant];
  return parts.join("/");
}

export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
    quality?: number;
    format?: "auto" | "webp" | "avif" | "json";
  } = {}
): string | null {
  if (!url) return null;

  if (!isCloudflareImageUrl(url)) {
    return url;
  }

  const params: string[] = [];
  if (options.width) params.push(`w=${options.width}`);
  if (options.height) params.push(`h=${options.height}`);
  if (options.fit) params.push(`fit=${options.fit}`);
  if (options.quality) params.push(`q=${options.quality}`);
  if (options.format) params.push(`f=${options.format}`);

  if (params.length === 0) {
    return url;
  }

  const parts = url.split("/");
  parts[parts.length - 1] = params.join(",");
  return parts.join("/");
}

export function buildImageDeliveryUrl(imageId: string, variant: ImageVariant = "public"): string {
  if (!CF_IMAGES_ACCOUNT_HASH) {
    console.warn("NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH is not set");
    return "";
  }
  return `https://imagedelivery.net/${CF_IMAGES_ACCOUNT_HASH}/${imageId}/${ImageVariants[variant]}`;
}

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
];

export function isValidImageFile(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export async function convertToWebP(file: File, quality: number = 0.85): Promise<File> {
  if (file.type === "image/webp") {
    return file;
  }

  if (file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to convert image"));
            return;
          }

          const originalName = file.name.replace(/\.[^/.]+$/, "");
          const webpFile = new File([blob], `${originalName}.webp`, {
            type: "image/webp",
          });

          resolve(webpFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function getDiaryImageUrl(url: string | null | undefined): string | null {
  return getOptimizedImageUrl(url, {
    width: 800,
    fit: "scale-down",
    quality: 85,
    format: "auto",
  });
}

export function getDiaryThumbnailUrl(url: string | null | undefined): string | null {
  return getOptimizedImageUrl(url, {
    width: 400,
    fit: "cover",
    quality: 80,
    format: "auto",
  });
}

export function getAvatarUrl(url: string | null | undefined, size: number = 80): string | null {
  return getOptimizedImageUrl(url, {
    width: size,
    height: size,
    fit: "cover",
    quality: 80,
    format: "auto",
  });
}

export function getOriginalImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (!isCloudflareImageUrl(url)) return url;
  
  const parts = url.split("/");
  parts[parts.length - 1] = "public";
  return parts.join("/");
}
