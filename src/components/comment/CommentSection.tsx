"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { formatDistanceToNow } from "@/utils/date";
import * as S from "./CommentSection.styles";

/* =============================================
   코멘트 섹션 컴포넌트
   - 코멘트 목록 및 입력
   - CRUD 기능 포함
   ============================================= */

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: {
    nickname: string;
    avatar_url: string | null;
  };
  isOwn: boolean;
}

interface CommentSectionProps {
  diaryId: string;
  groupId: string;
}

export default function CommentSection({
  diaryId,
  groupId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    commentId: string;
  }>({
    open: false,
    commentId: "",
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* 코멘트 목록 로드 */
  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      const { getCommentsByDiary } = await import("@/lib/mock/services");
      const data = getCommentsByDiary(diaryId, groupId);
      setComments(data);
      setIsLoading(false);
    };

    loadComments();
  }, [diaryId, groupId]);

  /* 텍스트 영역 자동 높이 조절 */
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "36px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        100
      )}px`;
    }
  };

  /* 코멘트 작성 */
  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const { createComment, getCommentsByDiary } = await import(
      "@/lib/mock/services"
    );
    const result = createComment(diaryId, newComment);

    if (result) {
      const updatedComments = getCommentsByDiary(diaryId, groupId);
      setComments(updatedComments);
      setNewComment("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "36px";
      }
      toast.success("코멘트를 작성했습니다.");
    } else {
      toast.error("코멘트 작성에 실패했습니다.");
    }

    setIsSubmitting(false);
  };

  /* 엔터키로 전송 */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /* 수정 시작 */
  const handleEditStart = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  /* 수정 취소 */
  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  /* 수정 저장 */
  const handleEditSave = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    const { updateComment, getCommentsByDiary } = await import(
      "@/lib/mock/services"
    );
    const success = updateComment(commentId, editContent);

    if (success) {
      const updatedComments = getCommentsByDiary(diaryId, groupId);
      setComments(updatedComments);
      setEditingId(null);
      setEditContent("");
      toast.success("코멘트를 수정했습니다.");
    } else {
      toast.error("수정에 실패했습니다.");
    }
  };

  /* 삭제 실행 */
  const handleDelete = async () => {
    const { deleteComment, getCommentsByDiary } = await import(
      "@/lib/mock/services"
    );
    const success = deleteComment(deleteDialog.commentId);

    if (success) {
      const updatedComments = getCommentsByDiary(diaryId, groupId);
      setComments(updatedComments);
      toast.success("코멘트를 삭제했습니다.");
    } else {
      toast.error("삭제에 실패했습니다.");
    }
  };

  /* 수정 여부 확인 */
  const isEdited = (comment: Comment) => {
    return comment.created_at !== comment.updated_at;
  };

  return (
    <S.Container>
      {/* 코멘트 목록 */}
      {isLoading ? (
        <S.EmptyState>
          <Loader2 size={16} className="animate-spin" />
        </S.EmptyState>
      ) : comments.length > 0 ? (
        <S.CommentList>
          {comments.map((comment) => (
            <S.CommentItem key={comment.id}>
              <S.Avatar>
                {comment.author.avatar_url ? (
                  <S.AvatarImage src={comment.author.avatar_url} alt="" />
                ) : (
                  <S.AvatarPlaceholder>
                    {comment.author.nickname.charAt(0).toUpperCase()}
                  </S.AvatarPlaceholder>
                )}
              </S.Avatar>

              <S.CommentBody>
                <S.CommentHeader>
                  <S.Nickname>{comment.author.nickname}</S.Nickname>
                  <S.TimeAgo>
                    {formatDistanceToNow(comment.created_at)}
                  </S.TimeAgo>
                  {isEdited(comment) && <S.EditedBadge>(수정됨)</S.EditedBadge>}
                </S.CommentHeader>

                {editingId === comment.id ? (
                  <S.EditInputContainer>
                    <S.EditTextArea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      autoFocus
                    />
                    <S.EditActions>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditCancel}
                      >
                        취소
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditSave(comment.id)}
                      >
                        저장
                      </Button>
                    </S.EditActions>
                  </S.EditInputContainer>
                ) : (
                  <>
                    <S.Content>{comment.content}</S.Content>
                    {comment.isOwn && (
                      <S.Actions>
                        <S.ActionButton
                          onClick={() => handleEditStart(comment)}
                        >
                          수정
                        </S.ActionButton>
                        <S.ActionButton
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              commentId: comment.id,
                            })
                          }
                        >
                          삭제
                        </S.ActionButton>
                      </S.Actions>
                    )}
                  </>
                )}
              </S.CommentBody>
            </S.CommentItem>
          ))}
        </S.CommentList>
      ) : (
        <S.EmptyState>첫 번째 코멘트를 남겨보세요!</S.EmptyState>
      )}

      {/* 코멘트 입력 */}
      <S.InputContainer>
        <S.InputWrapper>
          <S.TextArea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="코멘트를 입력하세요..."
            rows={1}
          />
        </S.InputWrapper>
        <S.SubmitButton
          onClick={handleSubmit}
          disabled={!newComment.trim() || isSubmitting}
          size="icon"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </S.SubmitButton>
      </S.InputContainer>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title="코멘트 삭제"
        description="이 코멘트를 삭제하시겠습니까?"
        confirmText="삭제"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </S.Container>
  );
}
