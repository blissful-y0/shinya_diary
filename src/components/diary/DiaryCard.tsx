"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentSection from "@/components/comment/CommentSection";
import ImageLightbox from "@/components/common/ImageLightbox";
import { formatDistanceToNow } from "@/lib/utils/date";
import { getDiaryImageUrl, getOriginalImageUrl } from "@/lib/utils/image";
import { MoreVertical, Pencil, Trash2, MessageCircle } from "lucide-react";
import { type Comment } from "@/lib/api/client";
import * as S from "./DiaryCard.styles";

interface DiaryCardProps {
  id: string;
  groupId: string;
  nickname: string;
  avatarUrl?: string | null;
  imageUrl?: string | null;
  content?: string | null;
  createdAt: string;
  isOwn?: boolean;
  comments?: Comment[];
  commentCount?: number;
  currentUserAuthor?: { nickname: string; avatar_url: string | null } | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function DiaryCard({
  id,
  groupId,
  nickname,
  avatarUrl,
  imageUrl,
  content,
  createdAt,
  isOwn = false,
  comments = [],
  commentCount = 0,
  currentUserAuthor,
  onEdit,
  onDelete,
}: DiaryCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const optimizedImageUrl = getDiaryImageUrl(imageUrl);
  const originalImageUrl = getOriginalImageUrl(imageUrl);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
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
      <S.CardHeader>
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarUrl || ""} alt={nickname} />
          <AvatarFallback>{nickname.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <S.AuthorInfo>
          <S.AuthorName>{nickname}</S.AuthorName>
          <S.PostTime>{formatDistanceToNow(createdAt)}</S.PostTime>
        </S.AuthorInfo>

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

      {optimizedImageUrl && (
        <S.ImageContainer onClick={() => setShowLightbox(true)}>
          <S.DiaryImage src={optimizedImageUrl} alt="다이어리 이미지" />
        </S.ImageContainer>
      )}

      {showLightbox && originalImageUrl && (
        <ImageLightbox
          src={originalImageUrl}
          alt="다이어리 이미지"
          onClose={() => setShowLightbox(false)}
        />
      )}

      {content && <S.ContentText>{content}</S.ContentText>}

      <S.CommentToggle onClick={handleToggleComments}>
        <MessageCircle size={16} />
        {commentCount > 0 && <span>{commentCount}</span>}
      </S.CommentToggle>

      {showComments && (
        <CommentSection
          diaryId={id}
          groupId={groupId}
          initialComments={comments}
          currentUserAuthor={currentUserAuthor}
        />
      )}
    </S.CardContainer>
  );
}
