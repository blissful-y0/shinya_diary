"use client";

import { UserStats } from "@/lib/api/client";
import { Loader2 } from "lucide-react";
import * as S from "./StatsCard.styles";

interface StatsCardProps {
  stats: UserStats | undefined;
  isLoading: boolean;
}

export default function StatsCard({ stats, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <S.Container>
        {[...Array(4)].map((_, i) => (
          <S.StatItem key={i}>
            <S.Label>LOADING</S.Label>
            <S.LoadingPlaceholder />
          </S.StatItem>
        ))}
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.StatItem>
        <S.Label>Streak</S.Label>
        <S.Value>
          {stats?.streak || 0}
          <span>일</span>
        </S.Value>
      </S.StatItem>
      
      <S.StatItem>
        <S.Label>Weekly</S.Label>
        <S.Value>
          {stats?.weekWritten || 0}/{stats?.weekTotal || 7}
        </S.Value>
      </S.StatItem>

      <S.StatItem>
        <S.Label>Monthly</S.Label>
        <S.Value>
          {stats?.monthWritten || 0}/{stats?.monthTotal || 30}
        </S.Value>
      </S.StatItem>

      <S.StatItem>
        <S.Label>Comments</S.Label>
        <S.Value>
          {stats?.recentComments || 0}
          <span>개</span>
        </S.Value>
      </S.StatItem>
    </S.Container>
  );
}
