import styled from "styled-components";
import { Button } from "@/components/ui/button";

/* =============================================
   CreateGroupModal 스타일
   - 그룹 생성 모달 레이아웃
   ============================================= */

export const FormContent = styled.div`
  /* 폼 컨텐츠 */
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
`;

export const FormField = styled.div`
  /* 폼 필드 */
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CharCount = styled.span`
  /* 글자 수 */
  font-size: 12px;
  color: var(--muted-foreground);
  text-align: right;
`;

export const ButtonGroup = styled.div`
  /* 버튼 그룹 */
  display: flex;
  gap: 12px;
`;

export const CancelButton = styled(Button)`
  /* 취소 버튼 */
  flex: 1;
`;

export const CreateButton = styled(Button)`
  /* 생성 버튼 */
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CompletedContent = styled.div`
  /* 완료 컨텐츠 */
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
`;

export const SuccessMessage = styled.p`
  /* 성공 메시지 */
  text-align: center;
  font-size: 16px;
  color: var(--foreground);
`;

export const InviteCodeSection = styled.div`
  /* 초대 코드 섹션 */
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InviteCodeLabel = styled.span`
  /* 초대 코드 레이블 */
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const InviteCodeBox = styled.div`
  /* 초대 코드 박스 */
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--muted);
  border-radius: 8px;
`;

export const InviteCode = styled.span`
  /* 초대 코드 */
  flex: 1;
  font-size: 20px;
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 2px;
  color: var(--foreground);
`;

export const CopyButton = styled(Button)`
  /* 복사 버튼 */
  flex-shrink: 0;
`;

export const InviteCodeHint = styled.span`
  /* 초대 코드 힌트 */
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const CompleteButton = styled(Button)`
  /* 완료 버튼 */
  width: 100%;
`;
