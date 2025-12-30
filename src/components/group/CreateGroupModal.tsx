"use client";

import { useState } from "react";
import styled from "styled-components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

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
          <CompletedContent>
            <SuccessMessage>
              그룹이 생성되었습니다!
            </SuccessMessage>

            <InviteCodeSection>
              <InviteCodeLabel>초대 코드</InviteCodeLabel>
              <InviteCodeBox>
                <InviteCode>{createdGroup.inviteCode}</InviteCode>
                <CopyButton variant="outline" size="sm" onClick={handleCopyCode}>
                  복사
                </CopyButton>
              </InviteCodeBox>
              <InviteCodeHint>
                친구들에게 이 코드를 공유하세요
              </InviteCodeHint>
            </InviteCodeSection>

            <CompleteButton onClick={handleComplete}>
              확인
            </CompleteButton>
          </CompletedContent>
        ) : (
          /* 입력 화면 */
          <FormContent>
            <FormField>
              <Label htmlFor="groupName">그룹 이름</Label>
              <Input
                id="groupName"
                placeholder="그룹 이름을 입력하세요"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={20}
                disabled={isCreating}
              />
              <CharCount>{groupName.length}/20</CharCount>
            </FormField>

            <ButtonGroup>
              <CancelButton variant="outline" onClick={handleClose}>
                취소
              </CancelButton>
              <CreateButton
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
              </CreateButton>
            </ButtonGroup>
          </FormContent>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* 스타일 컴포넌트 */
const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CharCount = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelButton = styled(Button)`
  flex: 1;
`;

const CreateButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CompletedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
`;

const SuccessMessage = styled.p`
  text-align: center;
  font-size: 16px;
  color: var(--foreground);
`;

const InviteCodeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InviteCodeLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

const InviteCodeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--muted);
  border-radius: 8px;
`;

const InviteCode = styled.span`
  flex: 1;
  font-size: 20px;
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 2px;
  color: var(--foreground);
`;

const CopyButton = styled(Button)`
  flex-shrink: 0;
`;

const InviteCodeHint = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
`;

const CompleteButton = styled(Button)`
  width: 100%;
`;
