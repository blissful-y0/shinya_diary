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
import { Loader2, Users, CheckCircle } from "lucide-react";

/* =============================================
   초대 코드로 그룹 참여 모달
   - 초대 코드 입력
   - 그룹 정보 확인 후 가입 요청
   ============================================= */

interface JoinGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequested: () => void;
}

type Step = "input" | "confirm" | "success";

interface FoundGroup {
  id: string;
  name: string;
  memberCount: number;
}

export default function JoinGroupModal({
  open,
  onOpenChange,
  onRequested,
}: JoinGroupModalProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [foundGroup, setFoundGroup] = useState<FoundGroup | null>(null);
  const [error, setError] = useState("");

  /* 초대 코드로 그룹 찾기 */
  const handleSearch = async () => {
    if (!inviteCode.trim()) return;

    setIsLoading(true);
    setError("");

    /* Mock: 서버 지연 시뮬레이션 */
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { findGroupByInviteCode, getGroupMembers } = await import(
      "@/lib/mock/services"
    );
    const group = findGroupByInviteCode(inviteCode.trim());

    if (!group) {
      setError("유효하지 않은 초대 코드입니다.");
      setIsLoading(false);
      return;
    }

    const members = getGroupMembers(group.id);
    setFoundGroup({
      id: group.id,
      name: group.name,
      memberCount: members.length,
    });
    setStep("confirm");
    setIsLoading(false);
  };

  /* 가입 요청 */
  const handleRequestJoin = async () => {
    if (!foundGroup) return;

    setIsLoading(true);

    /* Mock: 서버 지연 시뮬레이션 */
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { requestJoinGroup } = await import("@/lib/mock/services");
    const result = requestJoinGroup(foundGroup.id);

    if (!result.success) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    setStep("success");
    setIsLoading(false);
  };

  /* 완료 처리 */
  const handleComplete = () => {
    onRequested();
    handleClose();
  };

  /* 모달 닫기 */
  const handleClose = () => {
    setInviteCode("");
    setStep("input");
    setFoundGroup(null);
    setError("");
    onOpenChange(false);
  };

  /* 초대 코드 입력 처리 (대문자 변환) */
  const handleCodeChange = (value: string) => {
    setInviteCode(value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === "success" ? "요청 완료" : "초대 코드로 참여"}
          </DialogTitle>
        </DialogHeader>

        {step === "input" && (
          /* 초대 코드 입력 */
          <FormContent>
            <FormField>
              <Label htmlFor="inviteCode">초대 코드</Label>
              <CodeInput
                id="inviteCode"
                placeholder="초대 코드 8자리"
                value={inviteCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                maxLength={8}
                disabled={isLoading}
              />
              {error && <ErrorText>{error}</ErrorText>}
            </FormField>

            <ButtonGroup>
              <CancelButton variant="outline" onClick={handleClose}>
                취소
              </CancelButton>
              <SearchButton
                onClick={handleSearch}
                disabled={inviteCode.length < 8 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    찾는 중...
                  </>
                ) : (
                  "확인"
                )}
              </SearchButton>
            </ButtonGroup>
          </FormContent>
        )}

        {step === "confirm" && foundGroup && (
          /* 그룹 정보 확인 */
          <ConfirmContent>
            <GroupInfo>
              <GroupIcon>
                <Users size={32} />
              </GroupIcon>
              <GroupName>{foundGroup.name}</GroupName>
              <MemberCount>{foundGroup.memberCount}/4명</MemberCount>
            </GroupInfo>

            <InfoText>
              이 그룹에 가입 요청을 보내시겠습니까?
              <br />
              방장의 승인 후 참여할 수 있습니다.
            </InfoText>

            {error && <ErrorText>{error}</ErrorText>}

            <ButtonGroup>
              <CancelButton variant="outline" onClick={() => setStep("input")}>
                뒤로
              </CancelButton>
              <RequestButton onClick={handleRequestJoin} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    요청 중...
                  </>
                ) : (
                  "가입 요청"
                )}
              </RequestButton>
            </ButtonGroup>
          </ConfirmContent>
        )}

        {step === "success" && (
          /* 성공 화면 */
          <SuccessContent>
            <SuccessIcon>
              <CheckCircle size={48} />
            </SuccessIcon>
            <SuccessTitle>가입 요청을 보냈습니다!</SuccessTitle>
            <SuccessText>
              방장이 요청을 승인하면
              <br />
              그룹에 참여할 수 있습니다.
            </SuccessText>
            <CompleteButton onClick={handleComplete}>확인</CompleteButton>
          </SuccessContent>
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

const CodeInput = styled(Input)`
  font-size: 20px;
  font-family: monospace;
  letter-spacing: 4px;
  text-align: center;
  text-transform: uppercase;
`;

const ErrorText = styled.span`
  font-size: 13px;
  color: var(--destructive);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelButton = styled(Button)`
  flex: 1;
`;

const SearchButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConfirmContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
`;

const GroupInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background-color: var(--muted);
  border-radius: 12px;
`;

const GroupIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background);
  border-radius: 16px;
  color: var(--primary);
`;

const GroupName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
`;

const MemberCount = styled.span`
  font-size: 14px;
  color: var(--muted-foreground);
`;

const InfoText = styled.p`
  text-align: center;
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
`;

const RequestButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
`;

const SuccessIcon = styled.div`
  color: var(--primary);
`;

const SuccessTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
`;

const SuccessText = styled.p`
  text-align: center;
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
`;

const CompleteButton = styled(Button)`
  width: 100%;
  margin-top: 8px;
`;
