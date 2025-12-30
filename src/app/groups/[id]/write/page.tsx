"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X, Send, Loader2 } from "lucide-react";
import { isValidImageFile } from "@/utils/imageConverter";
import { formatDateISO } from "@/utils/date";

/* =============================================
   다이어리 작성/수정 페이지
   - 이미지 업로드 (Mock: 로컬 미리보기만)
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
  const editDiaryId = searchParams.get("edit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  /* 수정 모드: 기존 다이어리 로드 */
  useEffect(() => {
    const init = async () => {
      const {
        getMyDiary,
        checkTodayDiary,
        getCurrentUser,
      } = await import("@/lib/mock/services");

      const today = formatDateISO(new Date());

      /* 수정 모드인 경우 */
      if (editDiaryId) {
        /* Mock에서는 특정 ID로 조회할 수 없으므로 오늘 다이어리 로드 */
        const diary = getMyDiary(groupId, today);
        if (diary) {
          setIsEditing(true);
          setContent(diary.content || "");
          if (diary.image_url) {
            setImagePreview(diary.image_url);
          }
        }
      } else {
        /* 신규 작성: 오늘 이미 작성했는지 확인 */
        const hasWritten = checkTodayDiary(groupId, today);
        if (hasWritten) {
          /* 이미 작성한 경우 수정 모드로 전환 */
          const diary = getMyDiary(groupId, today);
          if (diary) {
            setIsEditing(true);
            setContent(diary.content || "");
            if (diary.image_url) {
              setImagePreview(diary.image_url);
            }
          }
        }
      }
    };

    init();
  }, [groupId, editDiaryId]);

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
    if (!content.trim() && !imageFile && !imagePreview) {
      alert("내용 또는 이미지를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { createDiary, updateDiary, getMyDiary } = await import(
        "@/lib/mock/services"
      );

      const today = formatDateISO(new Date());

      if (isEditing) {
        /* 수정 */
        setUploadProgress("수정 중...");
        const diary = getMyDiary(groupId, today);
        if (diary) {
          updateDiary(diary.id, {
            content: content.trim() || undefined,
            imageUrl: imagePreview || undefined,
          });
        }
      } else {
        /* 신규 생성 */
        setUploadProgress("저장 중...");
        createDiary({
          groupId,
          content: content.trim() || undefined,
          imageUrl: imagePreview || undefined,
          date: today,
        });
      }

      /* Mock: 약간의 지연 시뮬레이션 */
      await new Promise((resolve) => setTimeout(resolve, 300));

      /* 성공 - 그룹 피드로 이동 */
      router.push(`/groups/${groupId}`);
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
      headerTitle={isEditing ? "일기 수정" : "오늘의 일기"}
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
