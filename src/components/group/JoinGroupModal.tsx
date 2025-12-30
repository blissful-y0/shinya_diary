"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Users, CheckCircle } from "lucide-react";
import * as S from "./JoinGroupModal.styles";

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
          <S.FormContent>
            <S.FormField>
              <Label htmlFor="inviteCode">초대 코드</Label>
              <S.CodeInput
                id="inviteCode"
                placeholder="초대 코드 8자리"
                value={inviteCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                maxLength={8}
                disabled={isLoading}
              />
              {error && <S.ErrorText>{error}</S.ErrorText>}
            </S.FormField>

            <S.ButtonGroup>
              <S.CancelButton variant="outline" onClick={handleClose}>
                취소
              </S.CancelButton>
              <S.SearchButton
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
              </S.SearchButton>
            </S.ButtonGroup>
          </S.FormContent>
        )}

        {step === "confirm" && foundGroup && (
          /* 그룹 정보 확인 */
          <S.ConfirmContent>
            <S.GroupInfo>
              <S.GroupIcon>
                <Users size={32} />
              </S.GroupIcon>
              <S.GroupName>{foundGroup.name}</S.GroupName>
              <S.MemberCount>{foundGroup.memberCount}/4명</S.MemberCount>
            </S.GroupInfo>

            <S.InfoText>
              이 그룹에 가입 요청을 보내시겠습니까?
              <br />
              방장의 승인 후 참여할 수 있습니다.
            </S.InfoText>

            {error && <S.ErrorText>{error}</S.ErrorText>}

            <S.ButtonGroup>
              <S.CancelButton variant="outline" onClick={() => setStep("input")}>
                뒤로
              </S.CancelButton>
              <S.RequestButton onClick={handleRequestJoin} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    요청 중...
                  </>
                ) : (
                  "가입 요청"
                )}
              </S.RequestButton>
            </S.ButtonGroup>
          </S.ConfirmContent>
        )}

        {step === "success" && (
          /* 성공 화면 */
          <S.SuccessContent>
            <S.SuccessIcon>
              <CheckCircle size={48} />
            </S.SuccessIcon>
            <S.SuccessTitle>가입 요청을 보냈습니다!</S.SuccessTitle>
            <S.SuccessText>
              방장이 요청을 승인하면
              <br />
              그룹에 참여할 수 있습니다.
            </S.SuccessText>
            <S.CompleteButton onClick={handleComplete}>확인</S.CompleteButton>
          </S.SuccessContent>
        )}
      </DialogContent>
    </Dialog>
  );
}
