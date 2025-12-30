import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* =============================================
   JoinGroupModal 스타일
   - 그룹 참여 모달 레이아웃
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

export const CodeInput = styled(Input)`
  /* 코드 입력 */
  font-size: 12px;
  font-family: monospace;
  text-align: left;
`;

export const ErrorText = styled.span`
  /* 에러 텍스트 */
  font-size: 13px;
  color: var(--destructive);
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

export const SearchButton = styled(Button)`
  /* 검색 버튼 */
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ConfirmContent = styled.div`
  /* 확인 컨텐츠 */
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
`;

export const GroupInfo = styled.div`
  /* 그룹 정보 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background-color: var(--muted);
  border-radius: 12px;
`;

export const GroupIcon = styled.div`
  /* 그룹 아이콘 */
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background);
  border-radius: 16px;
  color: var(--primary);
`;

export const GroupName = styled.h3`
  /* 그룹 이름 */
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
`;

export const MemberCount = styled.span`
  /* 멤버 수 */
  font-size: 14px;
  color: var(--muted-foreground);
`;

export const InfoText = styled.p`
  /* 정보 텍스트 */
  text-align: center;
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
`;

export const RequestButton = styled(Button)`
  /* 요청 버튼 */
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SuccessContent = styled.div`
  /* 성공 컨텐츠 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
`;

export const SuccessIcon = styled.div`
  /* 성공 아이콘 */
  color: var(--primary);
`;

export const SuccessTitle = styled.h3`
  /* 성공 제목 */
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
`;

export const SuccessText = styled.p`
  /* 성공 텍스트 */
  text-align: center;
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
`;

export const CompleteButton = styled(Button)`
  /* 완료 버튼 */
  width: 100%;
  margin-top: 8px;
`;
