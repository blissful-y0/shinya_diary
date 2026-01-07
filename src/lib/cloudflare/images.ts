export const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
export const CF_IMAGES_TOKEN = process.env.CLOUDFLARE_IMAGES_TOKEN!;
export const CF_IMAGES_ACCOUNT_HASH = process.env.CLOUDFLARE_IMAGES_ACCOUNT_HASH!;

export interface DirectUploadResponse {
  id: string;
  uploadURL: string;
}

export async function createDirectUploadUrl(
  metadata?: Record<string, string>
): Promise<DirectUploadResponse> {
  if (!CF_ACCOUNT_ID || !CF_IMAGES_TOKEN) {
    throw new Error("Cloudflare credentials not configured");
  }

  const formData = new FormData();
  formData.append("requireSignedURLs", "false");
  
  if (metadata) {
    formData.append("metadata", JSON.stringify(metadata));
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_IMAGES_TOKEN}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Cloudflare API error: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    console.error("Cloudflare Images error:", result.errors);
    throw new Error(result.errors?.[0]?.message || "Failed to create upload URL");
  }

  return {
    id: result.result.id,
    uploadURL: result.result.uploadURL,
  };
}

export function getImageUrl(
  imageId: string,
  variant: string = "public"
): string {
  return `https://imagedelivery.net/${CF_IMAGES_ACCOUNT_HASH}/${imageId}/${variant}`;
}

export const ImageVariants = {
  thumbnail: "thumbnail",
  avatar: "avatar",
  diaryImage: "diary",
  cover: "cover",
  public: "public",
} as const;

export type ImageVariant = keyof typeof ImageVariants;
