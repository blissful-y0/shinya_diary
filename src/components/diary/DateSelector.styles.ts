import styled from "styled-components";

/* =============================================
   DateSelector 스타일
   - 날짜 선택 네비게이션
   ============================================= */

export const Container = styled.div`
  /* 컨테이너 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
`;

export const NavButton = styled.button<{ disabled?: boolean }>`
  /* 네비게이션 버튼 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: ${({ disabled }) =>
    disabled ? "var(--muted-foreground)" : "var(--foreground)"};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: var(--accent);
  }
`;

export const DateDisplay = styled.button`
  /* 날짜 표시 영역 (클릭 가능) */
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--muted-foreground);
  position: relative;

  &:hover {
    background-color: var(--accent);
  }
`;

export const DateText = styled.span`
  /* 날짜 텍스트 */
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
`;

export const TodayBadge = styled.span`
  /* 오늘 뱃지 */
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  background-color: var(--primary);
  border-radius: 10px;
`;

export const HiddenDateInput = styled.input`
  /* 숨겨진 날짜 입력 */
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;
