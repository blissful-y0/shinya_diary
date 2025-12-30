import styled from "styled-components";
import { Button } from "@/components/ui/button";

/* =============================================
   CommentSection 스타일
   ============================================= */

export const Container = styled.div`
  /* 컨테이너 */
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 16px;
  border-top: 1px solid var(--border);
  background-color: var(--card);
`;

export const CommentList = styled.div`
  /* 코멘트 목록 */
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EmptyState = styled.p`
  /* 빈 상태 */
  font-size: 13px;
  color: var(--muted-foreground);
  text-align: center;
  padding: 8px 0;
`;

/* =============================================
   CommentItem 스타일
   ============================================= */

export const CommentItem = styled.div`
  /* 코멘트 아이템 */
  display: flex;
  gap: 10px;
`;

export const Avatar = styled.div`
  /* 아바타 */
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

export const AvatarImage = styled.img`
  /* 아바타 이미지 */
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.span`
  /* 아바타 플레이스홀더 */
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
`;

export const CommentBody = styled.div`
  /* 코멘트 본문 */
  flex: 1;
  min-width: 0;
`;

export const CommentHeader = styled.div`
  /* 코멘트 헤더 */
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
`;

export const Nickname = styled.span`
  /* 닉네임 */
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
`;

export const TimeAgo = styled.span`
  /* 시간 */
  font-size: 11px;
  color: var(--muted-foreground);
`;

export const EditedBadge = styled.span`
  /* 수정됨 뱃지 */
  font-size: 10px;
  color: var(--muted-foreground);
`;

export const Content = styled.p`
  /* 내용 */
  font-size: 14px;
  color: var(--foreground);
  line-height: 1.5;
  word-break: break-word;
`;

export const Actions = styled.div`
  /* 액션 버튼들 */
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

export const ActionButton = styled.button`
  /* 액션 버튼 */
  font-size: 12px;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--foreground);
  }
`;

/* =============================================
   CommentInput 스타일
   ============================================= */

export const InputContainer = styled.div`
  /* 입력 컨테이너 */
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const InputWrapper = styled.div`
  /* 입력 래퍼 */
  flex: 1;
  position: relative;
`;

export const TextArea = styled.textarea`
  /* 텍스트 영역 */
  width: 100%;
  min-height: 36px;
  max-height: 100px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background-color: var(--background);
  color: var(--foreground);
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;

  &:focus {
    border-color: var(--primary);
  }

  &::placeholder {
    color: var(--muted-foreground);
  }
`;

export const SubmitButton = styled(Button)`
  /* 전송 버튼 */
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EditInputContainer = styled.div`
  /* 수정 입력 컨테이너 */
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`;

export const EditTextArea = styled.textarea`
  /* 수정 텍스트 영역 */
  width: 100%;
  min-height: 60px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid var(--primary);
  border-radius: 8px;
  background-color: var(--background);
  color: var(--foreground);
  resize: none;
  outline: none;
  font-family: inherit;
`;

export const EditActions = styled.div`
  /* 수정 액션 버튼들 */
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
