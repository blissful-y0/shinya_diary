import { createClient } from "@/lib/supabase/client";
import {
  convertToWebP,
  generateWebPFilename,
  isValidImageFile,
  type ConversionOptions,
} from "./imageConverter";

const STORAGE_BUCKET = "diary-images";

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface UploadProgress {
  stage: "validating" | "converting" | "uploading" | "complete" | "error";
  progress: number;
  message: string;
}

/**
 * Uploads an image to Supabase Storage after converting to WebP
 * @param file - The image file to upload
 * @param userId - The user's ID for path namespacing
 * @param options - Optional conversion options
 * @param onProgress - Optional progress callback
 * @returns Promise<UploadResult>
 */
export async function uploadDiaryImage(
  file: File,
  userId: string,
  options?: ConversionOptions,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const supabase = createClient();

  try {
    // Stage 1: Validate
    onProgress?.({
      stage: "validating",
      progress: 10,
      message: "이미지 검증 중...",
    });

    if (!isValidImageFile(file)) {
      return {
        success: false,
        error: "지원하지 않는 이미지 형식입니다. (JPG, PNG, GIF, WebP, HEIC 지원)",
      };
    }

    // Stage 2: Convert to WebP
    onProgress?.({
      stage: "converting",
      progress: 30,
      message: "WebP로 변환 중...",
    });

    const webpBlob = await convertToWebP(file, options);
    const filePath = generateWebPFilename(file.name, userId);

    // Stage 3: Upload to Supabase Storage
    onProgress?.({
      stage: "uploading",
      progress: 60,
      message: "업로드 중...",
    });

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, webpBlob, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        error: `업로드 실패: ${error.message}`,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);

    onProgress?.({
      stage: "complete",
      progress: 100,
      message: "완료!",
    });

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";

    onProgress?.({
      stage: "error",
      progress: 0,
      message: errorMessage,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Deletes an image from Supabase Storage
 * @param path - The file path to delete
 * @returns Promise<boolean>
 */
export async function deleteDiaryImage(path: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);

  return !error;
}

/**
 * Gets a signed URL for temporary access (if bucket is private)
 * @param path - The file path
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Promise<string | null>
 */
export async function getSignedUrl(
  path: string,
  expiresIn: number = 3600
): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) return null;
  return data.signedUrl;
}
