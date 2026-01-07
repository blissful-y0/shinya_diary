"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

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
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 10000,
        errorRetryCount: 1,
        errorRetryInterval: 3000,
        keepPreviousData: true,
        revalidateIfStale: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
