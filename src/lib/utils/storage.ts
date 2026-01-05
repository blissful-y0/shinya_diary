import {
  convertToWebP,
  isValidImageFile,
  type ConversionOptions,
} from "./image";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadProgress {
  stage: "validating" | "converting" | "uploading" | "complete" | "error";
  progress: number;
  message: string;
}

/**
 * Uploads an image to Cloudflare R2 via API after converting to WebP
 * @param file - The image file to upload
 * @param folder - The folder name (default: "diaries")
 * @param options - Optional conversion options
 * @param onProgress - Optional progress callback
 * @returns Promise<UploadResult>
 */
export async function uploadImage(
  file: File,
  folder: string = "diaries",
  options?: ConversionOptions,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
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

    // Stage 3: Upload to R2 via API
    onProgress?.({
      stage: "uploading",
      progress: 60,
      message: "업로드 중...",
    });

    const formData = new FormData();
    formData.append("file", webpBlob, "image.webp");
    formData.append("folder", folder);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || "업로드 실패",
      };
    }

    onProgress?.({
      stage: "complete",
      progress: 100,
      message: "완료!",
    });

    return {
      success: true,
      url: result.data.url,
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
 * Legacy function - 기존 코드 호환용
 * @deprecated Use uploadImage instead
 */
export async function uploadDiaryImage(
  file: File,
  userId: string,
  options?: ConversionOptions,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return uploadImage(file, "diaries", options, onProgress);
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(
  file: File,
  options?: ConversionOptions,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return uploadImage(file, "avatars", options, onProgress);
}

/**
 * Upload group image (icon or cover)
 */
export async function uploadGroupImage(
  file: File,
  type: "icon" | "cover",
  options?: ConversionOptions,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return uploadImage(file, `groups/${type}`, options, onProgress);
}
