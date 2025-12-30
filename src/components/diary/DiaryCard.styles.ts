import styled from "styled-components";

/* =============================================
   DiaryCard 스타일
   - 다이어리 카드 레이아웃
   ============================================= */

export const CardContainer = styled.article`
  /* 카드 컨테이너 */
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
`;

export const CardHeader = styled.header`
  /* 카드 헤더 */
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
`;

export const AuthorInfo = styled.div`
  /* 작성자 정보 */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const AuthorName = styled.span`
  /* 작성자 이름 */
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
`;

export const PostTime = styled.span`
  /* 작성 시간 */
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const MenuWrapper = styled.div`
  /* 메뉴 래퍼 */
  position: relative;
`;

export const MenuButton = styled.button`
  /* 메뉴 버튼 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--muted-foreground);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--accent);
  }
`;

export const MenuOverlay = styled.div`
  /* 메뉴 오버레이 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

export const MenuDropdown = styled.div`
  /* 메뉴 드롭다운 */
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 120px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

export const MenuItem = styled.button`
  /* 메뉴 아이템 */
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--foreground);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--accent);
  }
`;

export const MenuItemDanger = styled(MenuItem)`
  /* 위험 메뉴 아이템 (삭제) */
  color: var(--destructive);
`;

export const ImageContainer = styled.div`
  /* 이미지 컨테이너 */
  width: 100%;
  aspect-ratio: 1;
  background-color: var(--muted);
`;

export const DiaryImage = styled.img`
  /* 다이어리 이미지 */
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ContentText = styled.p`
  /* 내용 텍스트 */
  padding: 16px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--foreground);
  white-space: pre-wrap;
  word-break: break-word;
`;
