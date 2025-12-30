"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X, Send, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createDiary, getMyDiary } from "@/lib/supabase/queries/diary";
import { uploadDiaryImage } from "@/utils/storageUploader";
import { isValidImageFile } from "@/utils/imageConverter";
import { formatDateISO } from "@/utils/date";

/* =============================================
   다이어리 작성 페이지
   - 이미지 업로드 (WebP 변환)
   - 텍스트 입력
   - 저장 기능
   ============================================= */

interface WritePageProps {
  params: Promise<{ id: string }>;
}

export default function WritePage({ params }: WritePageProps) {
  const { id: groupId } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [existingDiary, setExistingDiary] = useState(false);

  /* 현재 사용자 정보 및 기존 다이어리 확인 */
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUserId(data.user.id);

        /* 오늘 이미 작성한 다이어리가 있는지 확인 */
        const today = formatDateISO(new Date());
        const diary = await getMyDiary(groupId, data.user.id, today);

        if (diary) {
          setExistingDiary(true);
          setContent(diary.content || "");
          if (diary.image_url) {
            setImagePreview(diary.image_url);
          }
        }
      }
    };

    init();
  }, [groupId]);

  /* 이미지 선택 처리 */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      alert("지원하지 않는 이미지 형식입니다.");
      return;
    }

    setImageFile(file);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* 다이어리 제출 */
  const handleSubmit = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!content.trim() && !imageFile && !imagePreview) {
      alert("내용 또는 이미지를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    let imageUrl: string | undefined;

    try {
      /* 이미지 업로드 */
      if (imageFile) {
        setUploadProgress("이미지 업로드 중...");
        const result = await uploadDiaryImage(imageFile, userId, undefined, (p) => {
          setUploadProgress(p.message);
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        imageUrl = result.url;
      }

      /* 다이어리 저장 */
      setUploadProgress("저장 중...");
      const today = formatDateISO(new Date());
      const result = await createDiary({
        groupId,
        userId,
        content: content.trim() || undefined,
        imageUrl: imageUrl || (imagePreview && !imageFile ? imagePreview : undefined),
        date: today,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      /* 성공 - 그룹 피드로 이동 */
      router.push(`/groups/${groupId}`);
      router.refresh();
    } catch (error) {
      console.error("다이어리 저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  const canSubmit = (content.trim() || imageFile || imagePreview) && !isSubmitting;

  /* 제출 버튼 */
  const headerRight = (
    <SubmitButton onClick={handleSubmit} disabled={!canSubmit}>
      {isSubmitting ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Send size={18} />
      )}
    </SubmitButton>
  );

  return (
    <MobileLayout
      headerTitle={existingDiary ? "일기 수정" : "오늘의 일기"}
      headerBackHref={`/groups/${groupId}`}
      headerRight={headerRight}
      showNav={false}
    >
      <Container>
        {/* 이미지 업로드 영역 */}
        <ImageUploadArea onClick={() => fileInputRef.current?.click()}>
          {imagePreview ? (
            <ImagePreviewContainer>
              <PreviewImage src={imagePreview} alt="미리보기" />
              <RemoveImageButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
              >
                <X size={20} />
              </RemoveImageButton>
            </ImagePreviewContainer>
          ) : (
            <UploadPlaceholder>
              <ImagePlus size={32} />
              <UploadText>사진을 추가해보세요</UploadText>
            </UploadPlaceholder>
          )}
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
          />
        </ImageUploadArea>

        {/* 업로드 진행 상태 */}
        {uploadProgress && <ProgressText>{uploadProgress}</ProgressText>}

        {/* 텍스트 입력 */}
        <ContentTextarea
          placeholder="오늘 하루는 어땠나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
      </Container>
    </MobileLayout>
  );
}

/* 스타일 컴포넌트 - 계층 구조 */
const Container = styled.div`
  /* 페이지 컨테이너 */
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  gap: 16px;
`;

const SubmitButton = styled(Button)`
  /* 제출 버튼 */
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;

  &:disabled {
    opacity: 0.5;
  }
`;

const ImageUploadArea = styled.div`
  /* 이미지 업로드 영역 */
  aspect-ratio: 1;
  background-color: var(--muted);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: var(--accent);
  }
`;

const ImagePreviewContainer = styled.div`
  /* 이미지 미리보기 컨테이너 */
  width: 100%;
  height: 100%;
  position: relative;
`;

const PreviewImage = styled.img`
  /* 미리보기 이미지 */
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  /* 이미지 제거 버튼 */
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const UploadPlaceholder = styled.div`
  /* 업로드 플레이스홀더 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--muted-foreground);
  gap: 12px;
`;

const UploadText = styled.span`
  /* 업로드 텍스트 */
  font-size: 14px;
`;

const HiddenInput = styled.input`
  /* 숨겨진 파일 입력 */
  display: none;
`;

const ProgressText = styled.p`
  /* 진행 상태 텍스트 */
  text-align: center;
  font-size: 14px;
  color: var(--primary);
`;

const ContentTextarea = styled(Textarea)`
  /* 내용 텍스트 영역 */
  flex: 1;
  min-height: 120px;
  resize: none;
  border: none;
  background-color: transparent;
  font-size: 16px;
  line-height: 1.6;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:disabled {
    opacity: 0.7;
  }
`;
