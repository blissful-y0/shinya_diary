"use client";

import { useState } from "react";
import styled from "styled-components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "@/utils/date";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

/* =============================================
   다이어리 카드 컴포넌트
   - 작성자 정보, 이미지, 내용 표시
   - 본인 글: 수정/삭제 메뉴
   ============================================= */

interface DiaryCardProps {
  id?: string;
  nickname: string;
  avatarUrl?: string | null;
  imageUrl?: string | null;
  content?: string | null;
  createdAt: string;
  isOwn?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function DiaryCard({
  nickname,
  avatarUrl,
  imageUrl,
  content,
  createdAt,
  isOwn = false,
  onEdit,
  onDelete,
}: DiaryCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    setShowMenu(false);
    onEdit?.();
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete?.();
  };

  return (
    <CardContainer>
      {/* 작성자 헤더 */}
      <CardHeader>
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarUrl || ""} alt={nickname} />
          <AvatarFallback>{nickname.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <AuthorInfo>
          <AuthorName>{nickname}</AuthorName>
          <PostTime>{formatDistanceToNow(createdAt)}</PostTime>
        </AuthorInfo>

        {/* 본인 글: 더보기 메뉴 */}
        {isOwn && (
          <MenuWrapper>
            <MenuButton onClick={handleMenuToggle}>
              <MoreVertical size={20} />
            </MenuButton>

            {showMenu && (
              <>
                <MenuOverlay onClick={() => setShowMenu(false)} />
                <MenuDropdown>
                  <MenuItem onClick={handleEdit}>
                    <Pencil size={16} />
                    수정
                  </MenuItem>
                  <MenuItemDanger onClick={handleDelete}>
                    <Trash2 size={16} />
                    삭제
                  </MenuItemDanger>
                </MenuDropdown>
              </>
            )}
          </MenuWrapper>
        )}
      </CardHeader>

      {/* 이미지 */}
      {imageUrl && (
        <ImageContainer>
          <DiaryImage src={imageUrl} alt="다이어리 이미지" />
        </ImageContainer>
      )}

      {/* 내용 */}
      {content && <ContentText>{content}</ContentText>}
    </CardContainer>
  );
}

/* 스타일 컴포넌트 - 계층 구조 */
const CardContainer = styled.article`
  /* 카드 컨테이너 */
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
`;

const CardHeader = styled.header`
  /* 카드 헤더 */
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
`;

const AuthorInfo = styled.div`
  /* 작성자 정보 */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AuthorName = styled.span`
  /* 작성자 이름 */
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
`;

const PostTime = styled.span`
  /* 작성 시간 */
  font-size: 12px;
  color: var(--muted-foreground);
`;

const MenuWrapper = styled.div`
  /* 메뉴 래퍼 */
  position: relative;
`;

const MenuButton = styled.button`
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

const MenuOverlay = styled.div`
  /* 메뉴 오버레이 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
`;

const MenuDropdown = styled.div`
  /* 메뉴 드롭다운 */
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 20;
  min-width: 120px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const MenuItem = styled.button`
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

const MenuItemDanger = styled(MenuItem)`
  /* 위험 메뉴 아이템 (삭제) */
  color: var(--destructive);
`;

const ImageContainer = styled.div`
  /* 이미지 컨테이너 */
  width: 100%;
  aspect-ratio: 1;
  background-color: var(--muted);
`;

const DiaryImage = styled.img`
  /* 다이어리 이미지 */
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentText = styled.p`
  /* 내용 텍스트 */
  padding: 16px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--foreground);
  white-space: pre-wrap;
  word-break: break-word;
`;
