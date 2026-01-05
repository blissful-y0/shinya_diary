import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { createDirectUploadUrl, getImageUrl } from "@/lib/cloudflare/images";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { folder = "diaries" } = body;

      const { id, uploadURL } = await createDirectUploadUrl({
        userId: user!.id,
        folder,
        uploadedAt: new Date().toISOString(),
      });

      return apiResponse({
        uploadURL,
        imageId: id,
        deliveryUrl: getImageUrl(id),
      });
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "diaries";

      if (!file) {
        return apiError("파일이 필요합니다");
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/heic",
        "image/heif",
      ];
      if (!allowedTypes.includes(file.type)) {
        return apiError("지원하지 않는 이미지 형식입니다");
      }

      if (file.size > 10 * 1024 * 1024) {
        return apiError("파일 크기는 10MB 이하여야 합니다");
      }

      const { id, uploadURL } = await createDirectUploadUrl({
        userId: user!.id,
        folder,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      });

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch(uploadURL, {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Cloudflare upload failed:", errorText);
        return apiError("이미지 업로드에 실패했습니다", 500);
      }

      return apiResponse({ 
        url: getImageUrl(id),
        imageId: id,
      }, 201);
    }

    return apiError("지원하지 않는 Content-Type입니다", 400);
  } catch (err) {
    console.error("Upload error:", err);
    return apiError("업로드 실패", 500);
  }
}

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const folder = request.nextUrl.searchParams.get("folder") || "diaries";

    const { id, uploadURL } = await createDirectUploadUrl({
      userId: user!.id,
      folder,
      uploadedAt: new Date().toISOString(),
    });

    return apiResponse({
      uploadURL,
      imageId: id,
      deliveryUrl: getImageUrl(id),
    });
  } catch (err) {
    console.error("Upload URL generation error:", err);
    return apiError("업로드 URL 생성 실패", 500);
  }
}
