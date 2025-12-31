"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

/**
 * SWR 기본 설정
 * - fetcher: API 응답에서 data 추출
 * - 에러 재시도 설정
 * - 캐시 설정
 */

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();

  if (!json.success) {
    const error = new Error(json.error || "API 요청 실패");
    throw error;
  }

  return json.data;
};

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false, // 포커스 시 재검증 비활성화
        revalidateOnReconnect: true, // 재연결 시 재검증
        dedupingInterval: 2000, // 2초 내 중복 요청 방지
        errorRetryCount: 2, // 에러 시 2번까지 재시도
      }}
    >
      {children}
    </SWRConfig>
  );
}
