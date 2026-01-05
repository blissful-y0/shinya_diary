"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { formatDistanceToNow } from "@/utils/date";
import {
  getComments,
  createComment as apiCreateComment,
  updateComment as apiUpdateComment,
  deleteComment as apiDeleteComment,
  type Comment,
} from "@/lib/api/client";
import * as S from "./CommentSection.styles";

/* =============================================
   코멘트 섹션 컴포넌트
   - 코멘트 목록 및 입력
   - CRUD 기능 포함
   ============================================= */

interface CommentSectionProps {
  diaryId: string;
  groupId: string;
  currentUserAuthor?: { nickname: string; avatar_url: string | null } | null;
}

export default function CommentSection({
  diaryId,
  groupId,
  currentUserAuthor,
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
  const loadComments = async () => {
    setIsLoading(true);
    const result = await getComments(diaryId, groupId);
    if (result.success && result.data) {
      setComments(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
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

  /* 코멘트 작성 (Optimistic Update) */
  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    const content = newComment.trim();
    const tempId = `temp-${Date.now()}`;
    const optimisticComment: Comment = {
      id: tempId,
      diary_id: diaryId,
      user_id: "",
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        nickname: currentUserAuthor?.nickname || "나",
        avatar_url: currentUserAuthor?.avatar_url || null,
      },
      isOwn: true,
    };

    // UI 먼저 업데이트
    setComments((prev) => [...prev, optimisticComment]);
    setNewComment("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "36px";
    }

    setIsSubmitting(true);
    const result = await apiCreateComment(diaryId, content);

    if (result.success && result.data) {
      // 실제 데이터로 교체 (author는 유지)
      setComments((prev) =>
        prev.map((c) =>
          c.id === tempId
            ? { ...result.data!, author: c.author, isOwn: true }
            : c
        )
      );
      toast.success("코멘트를 작성했습니다.");
    } else {
      // 롤백
      setComments((prev) => prev.filter((c) => c.id !== tempId));
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

  /* 수정 저장 (Optimistic Update) */
  const handleEditSave = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    const newContent = editContent.trim();
    const originalComment = comments.find((c) => c.id === commentId);

    // UI 먼저 업데이트
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, content: newContent, updated_at: new Date().toISOString() }
          : c
      )
    );
    setEditingId(null);
    setEditContent("");

    const result = await apiUpdateComment(commentId, newContent);

    if (result.success) {
      toast.success("코멘트를 수정했습니다.");
    } else {
      // 롤백
      if (originalComment) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? originalComment : c))
        );
      }
      toast.error("수정에 실패했습니다.");
    }
  };

  /* 삭제 실행 (Optimistic Update) */
  const handleDelete = async () => {
    const { commentId } = deleteDialog;
    const originalComments = [...comments];

    // UI 먼저 업데이트
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    const result = await apiDeleteComment(commentId);

    if (result.success) {
      toast.success("코멘트를 삭제했습니다.");
    } else {
      // 롤백
      setComments(originalComments);
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
                    {(comment.author.nickname || "?").charAt(0).toUpperCase()}
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
