"use client";

import { useState } from "react";
import styled from "styled-components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";

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
    <Container>
      <Title>가입 요청 ({requests.length})</Title>
      <RequestList>
        {requests.map((request) => (
          <RequestItem key={request.id}>
            <UserInfo>
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={request.user.avatar_url || ""}
                  alt={request.user.nickname || ""}
                />
                <AvatarFallback>
                  {(request.user.nickname || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <UserName>{request.user.nickname || "알 수 없음"}</UserName>
            </UserInfo>

            <Actions>
              {loadingId === request.id ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <RejectButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(request.id)}
                  >
                    <X size={16} />
                  </RejectButton>
                  <ApproveButton
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                  >
                    <Check size={16} />
                  </ApproveButton>
                </>
              )}
            </Actions>
          </RequestItem>
        ))}
      </RequestList>
    </Container>
  );
}

/* 스타일 컴포넌트 */
const Container = styled.div`
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
`;

const Title = styled.h3`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  background-color: var(--muted);
  border-bottom: 1px solid var(--border);
`;

const RequestList = styled.div`
  display: flex;
  flex-direction: column;
`;

const RequestItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserName = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: var(--foreground);
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted-foreground);
`;

const RejectButton = styled(Button)`
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--destructive);
`;

const ApproveButton = styled(Button)`
  width: 32px;
  height: 32px;
  padding: 0;
`;
