"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createGroup, getGroup } from "@/lib/api/client";
import * as S from "./CreateGroupModal.styles";

/* =============================================
   그룹 생성 모달
   - 그룹 이름 입력
   - 닉네임 입력
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
  const [nickname, setNickname] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<{
    id: string;
    name: string;
    inviteCode: string;
  } | null>(null);

  /* 그룹 생성 */
  const handleCreate = async () => {
    if (!groupName.trim() || !nickname.trim()) return;

    setIsCreating(true);

    const res = await createGroup(groupName.trim(), nickname.trim());

    if (res.success && res.data) {
      // 생성된 그룹 정보 조회하여 초대 코드 가져오기
      const groupRes = await getGroup(res.data.groupId);
      if (groupRes.success && groupRes.data) {
        const result = {
          id: res.data.groupId,
          name: groupName.trim(),
          inviteCode: groupRes.data.invite_code,
        };
        setCreatedGroup(result);
      }
    } else {
      toast.error(res.error || "그룹 생성에 실패했습니다.");
    }

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
    setNickname("");
    setCreatedGroup(null);
    onOpenChange(false);
  };

  /* 초대 코드 복사 */
  const handleCopyCode = async () => {
    if (createdGroup) {
      await navigator.clipboard.writeText(createdGroup.inviteCode);
      toast.success("초대 코드가 복사되었습니다.");
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

            <S.FormField>
              <Label htmlFor="nickname">이 그룹에서 사용할 닉네임</Label>
              <Input
                id="nickname"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={10}
                disabled={isCreating}
              />
              <S.CharCount>{nickname.length}/10</S.CharCount>
            </S.FormField>

            <S.ButtonGroup>
              <S.CancelButton variant="outline" onClick={handleClose}>
                취소
              </S.CancelButton>
              <S.CreateButton
                onClick={handleCreate}
                disabled={!groupName.trim() || !nickname.trim() || isCreating}
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
