import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/* =============================================
   다이어리 작성/수정 페이지 스타일
   ============================================= */

export const Container = styled.div`
  /* 페이지 컨테이너 */
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  gap: 16px;
`;

export const SubmitButton = styled(Button)`
  /* 제출 버튼 (하단 고정) */
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: auto;

  &:disabled {
    opacity: 0.5;
  }
`;

export const ImageUploadArea = styled.div`
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

export const ImagePreviewContainer = styled.div`
  /* 이미지 미리보기 컨테이너 */
  width: 100%;
  height: 100%;
  position: relative;
`;

export const PreviewImage = styled.img`
  /* 미리보기 이미지 */
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const RemoveImageButton = styled.button`
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

export const UploadPlaceholder = styled.div`
  /* 업로드 플레이스홀더 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--muted-foreground);
  gap: 12px;
`;

export const UploadText = styled.span`
  /* 업로드 텍스트 */
  font-size: 14px;
`;

export const HiddenInput = styled.input`
  /* 숨겨진 파일 입력 */
  display: none;
`;

export const ProgressText = styled.p`
  /* 진행 상태 텍스트 */
  text-align: center;
  font-size: 14px;
  color: var(--primary);
`;

export const ContentTextarea = styled(Textarea)`
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
