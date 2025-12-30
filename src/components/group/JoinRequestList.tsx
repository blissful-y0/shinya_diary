"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Loader2 } from "lucide-react";
import * as S from "./JoinRequestList.styles";

/* =============================================
   가입 요청 목록 컴포넌트
   - 방장이 가입 요청을 승인/거절
   ============================================= */

interface JoinRequest {
  id: string;
  user: {
    nickname: string | null;
    avatar_url: string | null;
  };
  created_at: string;
}

interface JoinRequestListProps {
  requests: JoinRequest[];
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export default function JoinRequestList({
  requests,
  onApprove,
  onReject,
}: JoinRequestListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (requestId: string) => {
    setLoadingId(requestId);
    await onApprove(requestId);
    setLoadingId(null);
  };

  const handleReject = async (requestId: string) => {
    setLoadingId(requestId);
    await onReject(requestId);
    setLoadingId(null);
  };

  if (requests.length === 0) {
    return null;
  }

  return (
    <S.Container>
      <S.Title>가입 요청 ({requests.length})</S.Title>
      <S.RequestList>
        {requests.map((request) => (
          <S.RequestItem key={request.id}>
            <S.UserInfo>
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={request.user.avatar_url || ""}
                  alt={request.user.nickname || ""}
                />
                <AvatarFallback>
                  {(request.user.nickname || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <S.UserName>{request.user.nickname || "알 수 없음"}</S.UserName>
            </S.UserInfo>

            <S.Actions>
              {loadingId === request.id ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <S.RejectButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(request.id)}
                  >
                    <X size={16} />
                  </S.RejectButton>
                  <S.ApproveButton
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                  >
                    <Check size={16} />
                  </S.ApproveButton>
                </>
              )}
            </S.Actions>
          </S.RequestItem>
        ))}
      </S.RequestList>
    </S.Container>
  );
}
