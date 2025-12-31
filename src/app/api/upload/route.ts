import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2/client";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * POST /api/upload - 이미지 업로드 (Cloudflare R2)
 *
 * FormData로 file 전송
 * 반환: { url: string } - CDN 공개 URL
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "diaries";

    if (!file) {
      return apiError("파일이 필요합니다");
    }

    // 파일 타입 검증
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return apiError("지원하지 않는 이미지 형식입니다");
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return apiError("파일 크기는 10MB 이하여야 합니다");
    }

    // 파일명 생성
    const ext = file.type.split("/")[1];
    const filename = `${folder}/${user!.id}/${crypto.randomUUID()}.${ext}`;

    // R2에 업로드 (Edge Runtime에서는 Uint8Array 사용)
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: filename,
        Body: uint8Array,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000", // 1년 캐시
      })
    );

    // 공개 URL 반환
    const publicUrl = `${R2_PUBLIC_URL}/${filename}`;

    return apiResponse({ url: publicUrl }, 201);
  } catch (err) {
    console.error("Upload error:", err);
    return apiError("업로드 실패", 500);
  }
}
