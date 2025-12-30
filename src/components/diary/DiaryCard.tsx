"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "@/utils/date";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import * as S from "./DiaryCard.styles";

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
    <S.CardContainer>
      {/* 작성자 헤더 */}
      <S.CardHeader>
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarUrl || ""} alt={nickname} />
          <AvatarFallback>{nickname.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <S.AuthorInfo>
          <S.AuthorName>{nickname}</S.AuthorName>
          <S.PostTime>{formatDistanceToNow(createdAt)}</S.PostTime>
        </S.AuthorInfo>

        {/* 본인 글: 더보기 메뉴 */}
        {isOwn && (
          <S.MenuWrapper>
            <S.MenuButton onClick={handleMenuToggle}>
              <MoreVertical size={20} />
            </S.MenuButton>

            {showMenu && (
              <>
                <S.MenuOverlay onClick={() => setShowMenu(false)} />
                <S.MenuDropdown>
                  <S.MenuItem onClick={handleEdit}>
                    <Pencil size={16} />
                    수정
                  </S.MenuItem>
                  <S.MenuItemDanger onClick={handleDelete}>
                    <Trash2 size={16} />
                    삭제
                  </S.MenuItemDanger>
                </S.MenuDropdown>
              </>
            )}
          </S.MenuWrapper>
        )}
      </S.CardHeader>

      {/* 이미지 */}
      {imageUrl && (
        <S.ImageContainer>
          <S.DiaryImage src={imageUrl} alt="다이어리 이미지" />
        </S.ImageContainer>
      )}

      {/* 내용 */}
      {content && <S.ContentText>{content}</S.ContentText>}
    </S.CardContainer>
  );
}
