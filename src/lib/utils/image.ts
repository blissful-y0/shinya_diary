/**
 * 이미지를 WebP 형식으로 변환
 * Canvas API를 사용하여 클라이언트에서 변환
 */
export async function convertToWebP(
  file: File,
  quality: number = 0.85
): Promise<File> {
  // 이미 WebP인 경우 그대로 반환
  if (file.type === "image/webp") {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      // 원본 크기 유지
      canvas.width = img.width;
      canvas.height = img.height;

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      // 이미지 그리기
      ctx.drawImage(img, 0, 0);

      // WebP로 변환
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to convert image"));
            return;
          }

          // 새 파일 생성 (확장자를 .webp로 변경)
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

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // 파일을 Data URL로 읽기
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * 이미지 리사이즈 및 WebP 변환
 * 최대 크기를 지정하여 리사이즈
 */
export async function resizeAndConvertToWebP(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

      // 비율 유지하면서 리사이즈
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // WebP로 변환
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

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}
