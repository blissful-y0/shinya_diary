"use client";

import { use, useState } from "react";
import styled from "styled-components";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Sticker, Send } from "lucide-react";

/* =============================================
   다이어리 작성 페이지
   - 이미지 업로드 (WebP 변환)
   - 스티커 데코레이션
   - 텍스트 입력
   ============================================= */

interface WritePageProps {
  params: Promise<{ id: string }>;
}

export default function WritePage({ params }: WritePageProps) {
  const { id } = use(params);
  const [content, setContent] = useState("");

  /* 제출 버튼 */
  const headerRight = (
    <SubmitButton disabled={!content.trim()}>
      <Send size={18} />
    </SubmitButton>
  );

  return (
    <MobileLayout
      headerTitle="오늘의 일기"
      headerBackHref={`/groups/${id}`}
      headerRight={headerRight}
      showNav={false}
    >
      <Container>
        {/* 이미지 업로드 영역 */}
        <ImageUploadArea>
          <UploadPlaceholder>
            <ImagePlus size={32} />
            <UploadText>사진을 추가해보세요</UploadText>
          </UploadPlaceholder>
        </ImageUploadArea>

        {/* 스티커 툴바 */}
        <StickerToolbar>
          <ToolbarButton>
            <Sticker size={20} />
            스티커
          </ToolbarButton>
        </StickerToolbar>

        {/* 텍스트 입력 */}
        <ContentTextarea
          placeholder="오늘 하루는 어땠나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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

  &:hover {
    background-color: var(--accent);
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

const StickerToolbar = styled.div`
  /* 스티커 툴바 */
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;

  /* 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ToolbarButton = styled(Button)`
  /* 툴바 버튼 */
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
  font-size: 13px;
  white-space: nowrap;
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
`;
