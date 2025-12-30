import imageCompression from "browser-image-compression";

export interface ConversionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
}

const DEFAULT_OPTIONS: ConversionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  quality: 0.8,
};

/**
 * Converts any image file to WebP format with compression
 * @param file - The original image file (any format: jpg, png, heic, etc.)
 * @param options - Compression and conversion options
 * @returns Promise<Blob> - WebP formatted blob
 */
export async function convertToWebP(
  file: File,
  options: ConversionOptions = {}
): Promise<Blob> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // First, compress the image
  const compressedFile = await imageCompression(file, {
    maxSizeMB: mergedOptions.maxSizeMB!,
    maxWidthOrHeight: mergedOptions.maxWidthOrHeight!,
    useWebWorker: true,
    fileType: "image/webp",
  });

  // Convert to WebP using canvas for precise quality control
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(compressedFile);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert image to WebP"));
          }
        },
        "image/webp",
        mergedOptions.quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Generates a unique filename for the WebP image
 * @param originalName - Original filename
 * @param userId - User ID for namespacing
 * @returns string - Unique WebP filename
 */
export function generateWebPFilename(
  originalName: string,
  userId: string
): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9가-힣]/g, "_").slice(0, 20);

  return `${userId}/${timestamp}_${randomStr}_${sanitizedName}.webp`;
}

/**
 * Validates if the file is an acceptable image type
 * @param file - File to validate
 * @returns boolean
 */
export function isValidImageFile(file: File): boolean {
  const acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/heic",
    "image/heif",
  ];
  return acceptedTypes.includes(file.type);
}

/**
 * Gets the file size in a human-readable format
 * @param bytes - File size in bytes
 * @returns string - Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
