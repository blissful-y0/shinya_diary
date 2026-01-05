"use client";

export const runtime = "edge";

import { use, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import MobileLayout from "@/components/layout/MobileLayout";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { isValidImageFile } from "@/lib/utils/image";
import { formatDateISO } from "@/lib/utils/date";
import {
  getMyDiary,
  checkTodayDiary,
  createDiary,
  updateDiary,
  uploadImage,
} from "@/lib/api/client";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import * as S from "./styles/page.styles";

/* =============================================
   다이어리 작성/수정 페이지
   - 이미지 업로드 (Cloudflare Images)
   - 텍스트 입력
   - 저장/수정 기능
   ============================================= */

interface WritePageProps {
  params: Promise<{ id: string }>;
}

export default function WritePage({ params }: WritePageProps) {
  const { id: groupId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, isLoading: authLoading } = useRequireAuth();
  const editDiaryId = searchParams.get("edit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imageDeleted, setImageDeleted] = useState(false); // 이미지 삭제 여부 추적
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [diaryId, setDiaryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* 초기화: 수정 모드 또는 기존 다이어리 확인 */
  useEffect(() => {
    const init = async () => {
      if (!profile || authLoading) return;

      const today = formatDateISO(new Date());

      /* 수정 모드인 경우 또는 오늘 이미 작성했는지 확인 */
      if (editDiaryId) {
        const diaryRes = await getMyDiary(groupId, today);
        if (diaryRes.success && diaryRes.data) {
          setIsEditing(true);
          setDiaryId(diaryRes.data.id);
          setContent(diaryRes.data.content || "");
          if (diaryRes.data.image_url) {
            setExistingImageUrl(diaryRes.data.image_url);
            setImagePreview(diaryRes.data.image_url);
          }
        }
      } else {
        const checkRes = await checkTodayDiary(groupId, today);
        if (checkRes.success && checkRes.data?.hasWritten) {
          /* 이미 작성한 경우 수정 모드로 전환 */
          const diaryRes = await getMyDiary(groupId, today);
          if (diaryRes.success && diaryRes.data) {
            setIsEditing(true);
            setDiaryId(diaryRes.data.id);
            setContent(diaryRes.data.content || "");
            if (diaryRes.data.image_url) {
              setExistingImageUrl(diaryRes.data.image_url);
              setImagePreview(diaryRes.data.image_url);
            }
          }
        }
      }

      setIsLoading(false);
    };

    init();
  }, [groupId, editDiaryId, router, profile, authLoading]);

  /* 이미지 선택 처리 */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error("지원하지 않는 이미지 형식입니다.");
      return;
    }

    setImageFile(file);
    setExistingImageUrl(null);
    setImageDeleted(false); // 새 이미지 선택 시 삭제 상태 리셋

    /* 미리보기 생성 */
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* 이미지 제거 */
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setImageDeleted(true); // 이미지 삭제 명시적 추적
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* 다이어리 제출 */
  const handleSubmit = async () => {
    if (!content.trim() && !imageFile && !existingImageUrl) {
      toast.error("내용 또는 이미지를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = existingImageUrl;

      /* 새 이미지가 있으면 업로드 */
      if (imageFile) {
        setUploadProgress("이미지 업로드 중...");
        const uploadRes = await uploadImage(imageFile, "diaries");
        if (!uploadRes.success || !uploadRes.data) {
          toast.error("이미지 업로드에 실패했습니다.");
          setIsSubmitting(false);
          setUploadProgress("");
          return;
        }
        imageUrl = uploadRes.data.url;
      }

      const today = formatDateISO(new Date());

      if (isEditing && diaryId) {
        /* 수정 */
        setUploadProgress("수정 중...");
        const updateRes = await updateDiary(diaryId, {
          content: content.trim() || undefined,
          // 이미지 삭제 시 명시적으로 null 전달, 그 외에는 새 URL 또는 기존 URL
          imageUrl: imageDeleted ? null : (imageUrl || undefined),
        });

        if (!updateRes.success) {
          toast.error("수정에 실패했습니다.");
          setIsSubmitting(false);
          setUploadProgress("");
          return;
        }
      } else {
        /* 신규 생성 */
        setUploadProgress("저장 중...");
        const createRes = await createDiary({
          groupId,
          content: content.trim() || undefined,
          imageUrl: imageUrl || undefined,
          date: today,
        });

        if (!createRes.success) {
          toast.error("저장에 실패했습니다.");
          setIsSubmitting(false);
          setUploadProgress("");
          return;
        }
      }

      toast.success(isEditing ? "수정되었습니다." : "저장되었습니다.");
      router.push(`/groups/${groupId}`);
    } catch (error) {
      console.error("다이어리 저장 실패:", error);
      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  const canSubmit =
    (content.trim() || imageFile || existingImageUrl) && !isSubmitting;

  if (isLoading) {
    return (
      <MobileLayout
        headerTitle="로딩 중..."
        headerBackHref={`/groups/${groupId}`}
        showNav={false}
      >
        <S.Container style={{ alignItems: "center", paddingTop: 48 }}>
          <Loader2 size={32} className="animate-spin" />
        </S.Container>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      headerTitle={isEditing ? "일기 수정" : "오늘의 일기"}
      headerBackHref={`/groups/${groupId}`}
      showNav={false}
    >
      <S.Container>
        {/* 이미지 업로드 영역 */}
        <S.ImageUploadArea onClick={() => fileInputRef.current?.click()}>
          {imagePreview ? (
            <S.ImagePreviewContainer>
              <S.PreviewImage src={imagePreview} alt="미리보기" />
              <S.RemoveImageButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
              >
                <X size={20} />
              </S.RemoveImageButton>
            </S.ImagePreviewContainer>
          ) : (
            <S.UploadPlaceholder>
              <ImagePlus size={32} />
              <S.UploadText>사진을 추가해보세요</S.UploadText>
            </S.UploadPlaceholder>
          )}
          <S.HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
          />
        </S.ImageUploadArea>

        {/* 업로드 진행 상태 */}
        {uploadProgress && <S.ProgressText>{uploadProgress}</S.ProgressText>}

        {/* 텍스트 입력 */}
        <S.ContentTextarea
          placeholder="오늘 하루는 어땠나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />

        {/* 제출 버튼 (하단) */}
        <S.SubmitButton onClick={handleSubmit} disabled={!canSubmit}>
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>{isEditing ? "수정" : "작성"}</>
          )}
        </S.SubmitButton>
      </S.Container>
    </MobileLayout>
  );
}
