"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import * as S from "./CreateGroupModal.styles";

/* =============================================
   그룹 생성 모달
   - 그룹 이름 입력
   - 생성 후 초대 코드 표시
   ============================================= */

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (group: { id: string; name: string; inviteCode: string }) => void;
}

export default function CreateGroupModal({
  open,
  onOpenChange,
  onCreated,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<{
    id: string;
    name: string;
    inviteCode: string;
  } | null>(null);

  /* 그룹 생성 */
  const handleCreate = async () => {
    if (!groupName.trim()) return;

    setIsCreating(true);

    /* Mock: 서버 지연 시뮬레이션 */
    await new Promise((resolve) => setTimeout(resolve, 500));

    /* Mock 서비스 사용 */
    const { createGroup } = await import("@/lib/mock/services");
    const group = createGroup(groupName.trim());

    const result = {
      id: group.id,
      name: group.name,
      inviteCode: group.invite_code,
    };

    setCreatedGroup(result);
    setIsCreating(false);
  };

  /* 완료 처리 */
  const handleComplete = () => {
    if (createdGroup) {
      onCreated(createdGroup);
    }
    handleClose();
  };

  /* 모달 닫기 */
  const handleClose = () => {
    setGroupName("");
    setCreatedGroup(null);
    onOpenChange(false);
  };

  /* 초대 코드 복사 */
  const handleCopyCode = async () => {
    if (createdGroup) {
      await navigator.clipboard.writeText(createdGroup.inviteCode);
      alert("초대 코드가 복사되었습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {createdGroup ? "그룹 생성 완료" : "새 그룹 만들기"}
          </DialogTitle>
        </DialogHeader>

        {createdGroup ? (
          /* 생성 완료 화면 */
          <S.CompletedContent>
            <S.SuccessMessage>그룹이 생성되었습니다!</S.SuccessMessage>

            <S.InviteCodeSection>
              <S.InviteCodeLabel>초대 코드</S.InviteCodeLabel>
              <S.InviteCodeBox>
                <S.InviteCode>{createdGroup.inviteCode}</S.InviteCode>
                <S.CopyButton variant="outline" size="sm" onClick={handleCopyCode}>
                  복사
                </S.CopyButton>
              </S.InviteCodeBox>
              <S.InviteCodeHint>친구들에게 이 코드를 공유하세요</S.InviteCodeHint>
            </S.InviteCodeSection>

            <S.CompleteButton onClick={handleComplete}>확인</S.CompleteButton>
          </S.CompletedContent>
        ) : (
          /* 입력 화면 */
          <S.FormContent>
            <S.FormField>
              <Label htmlFor="groupName">그룹 이름</Label>
              <Input
                id="groupName"
                placeholder="그룹 이름을 입력하세요"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={20}
                disabled={isCreating}
              />
              <S.CharCount>{groupName.length}/20</S.CharCount>
            </S.FormField>

            <S.ButtonGroup>
              <S.CancelButton variant="outline" onClick={handleClose}>
                취소
              </S.CancelButton>
              <S.CreateButton
                onClick={handleCreate}
                disabled={!groupName.trim() || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    생성 중...
                  </>
                ) : (
                  "만들기"
                )}
              </S.CreateButton>
            </S.ButtonGroup>
          </S.FormContent>
        )}
      </DialogContent>
    </Dialog>
  );
}
