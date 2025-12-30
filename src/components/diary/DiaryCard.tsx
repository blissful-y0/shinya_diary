"use client";

import styled from "styled-components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "@/utils/date";

/* =============================================
   다이어리 카드 컴포넌트
   - 작성자 정보, 이미지, 내용 표시
   ============================================= */

interface DiaryCardProps {
  nickname: string;
  avatarUrl?: string | null;
  imageUrl?: string | null;
  content?: string | null;
  createdAt: string;
}

export default function DiaryCard({
  nickname,
  avatarUrl,
  imageUrl,
  content,
  createdAt,
}: DiaryCardProps) {
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
