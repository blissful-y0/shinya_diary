import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* =============================================
   그룹 설정 페이지 스타일
   ============================================= */

export const Container = styled.div`
  /* 페이지 컨테이너 */
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Section = styled.section`
  /* 섹션 */
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionTitle = styled.h2`
  /* 섹션 제목 */
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
`;

export const IconPreview = styled.div`
  /* 아이콘 미리보기 (클릭하여 변경) */
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background-color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  &:hover > div:last-of-type {
    opacity: 1;
  }
`;

export const IconImage = styled.img`
  /* 아이콘 이미지 */
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const IconPlaceholder = styled.div`
  /* 아이콘 플레이스홀더 */
  font-size: 32px;
  font-weight: 700;
  color: var(--muted-foreground);
`;

export const IconOverlay = styled.div`
  /* 아이콘 호버 오버레이 */
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
`;

export const HiddenInput = styled.input`
  /* 숨겨진 파일 입력 */
  display: none;
`;

export const NameInput = styled(Input)`
  /* 그룹 이름 입력 */
  height: 48px;
  font-size: 16px;
`;

export const SaveButton = styled(Button)`
  /* 저장 버튼 */
  height: 48px;
  font-size: 16px;
  font-weight: 600;
`;

export const Divider = styled.hr`
  /* 구분선 */
  border: none;
  border-top: 1px solid var(--border);
  margin: 8px 0;
`;

export const InviteCodeCard = styled.div`
  /* 초대 코드 카드 */
  background-color: var(--muted);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const InviteCodeText = styled.span`
  /* 초대 코드 텍스트 */
  font-size: 18px;
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 2px;
  color: var(--foreground);
`;

export const CopyButton = styled(Button)`
  /* 복사 버튼 */
  gap: 8px;
`;

export const JoinRequestSection = styled.section`
  /* 가입 요청 섹션 */
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const JoinRequestHeader = styled.div`
  /* 가입 요청 헤더 */
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RequestCount = styled.span`
  /* 요청 수 뱃지 */
  background-color: var(--primary);
  color: var(--primary-foreground);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
`;

export const EmptyRequests = styled.p`
  /* 빈 요청 상태 */
  font-size: 14px;
  color: var(--muted-foreground);
  text-align: center;
  padding: 24px;
  background-color: var(--muted);
  border-radius: 12px;
`;
