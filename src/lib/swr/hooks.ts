"use client";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import type { Group, GroupMember, Diary, Comment, Profile, ProfileStats, UserStats, CalendarData, AllGroupsStatus } from "@/lib/api/client";
import { isToday } from "@/lib/utils/date";

/**
 * SWR Hooks for API
 * - 자동 캐싱 및 재검증
 * - 중복 요청 방지
 * - 로딩/에러 상태 관리
 */

// ============================================
// Groups
// ============================================

export function useGroups() {
  const { data, error, isLoading, mutate } = useSWR<Group[]>("/api/groups");

  return {
    groups: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useGroup(groupId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Group>(
    groupId ? `/api/groups/${groupId}` : null
  );

  return {
    group: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useGroupMembers(groupId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<GroupMember[]>(
    groupId ? `/api/groups/${groupId}/members` : null
  );

  return {
    members: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// ============================================
// Diaries
// ============================================

export function useDiaries(groupId: string | null, date: string | null) {
  const isPastDate = date ? !isToday(new Date(date)) : false;

  const { data, error, isLoading, mutate } = useSWR<Diary[]>(
    groupId && date ? `/api/diaries?groupId=${groupId}&date=${date}` : null,
    {
      revalidateOnMount: !isPastDate,
      revalidateIfStale: !isPastDate,
    }
  );

  return {
    diaries: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useDiariesWithAuth(groupId: string | null, date: string | null, userId: string | null) {
  const isPastDate = date ? !isToday(new Date(date)) : false;
  const isTodayDate = !isPastDate;

  const { hasWritten, isLoading: checkLoading } = useTodayDiaryCheck(
    isTodayDate ? groupId : null,
    isTodayDate ? date : null
  );

  const canView = isPastDate || hasWritten;

  const { data, error, isLoading, mutate } = useSWR<Diary[]>(
    groupId && date && canView ? `/api/diaries?groupId=${groupId}&date=${date}` : null,
    {
      revalidateOnMount: !isPastDate,
      revalidateIfStale: !isPastDate,
    }
  );

  const myDiary = data?.find((d) => d.user_id === userId) ?? null;

  return {
    diaries: data,
    myDiary,
    hasWritten: isPastDate ? true : hasWritten,
    canView,
    isLoading: (isTodayDate && checkLoading) || isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useMyDiary(groupId: string | null, date: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Diary | null>(
    groupId && date ? `/api/diaries/my?groupId=${groupId}&date=${date}` : null
  );

  return {
    diary: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useTodayDiaryCheck(groupId: string | null, date: string | null) {
  const { data, error, isLoading } = useSWR<{ hasWritten: boolean }>(
    groupId && date ? `/api/diaries/check?groupId=${groupId}&date=${date}` : null
  );

  return {
    hasWritten: data?.hasWritten ?? false,
    isLoading,
    isError: !!error,
  };
}

// ============================================
// Comments
// ============================================

export function useComments(diaryId: string | null, groupId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Comment[]>(
    diaryId && groupId ? `/api/comments?diaryId=${diaryId}&groupId=${groupId}` : null
  );

  return {
    comments: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useCommentCount(diaryId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ count: number }>(
    diaryId ? `/api/comments/count?diaryId=${diaryId}` : null
  );

  return {
    count: data?.count ?? 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// ============================================
// Profile
// ============================================

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<{ profile: Profile; stats: ProfileStats }>(
    "/api/profile"
  );

  return {
    profile: data?.profile,
    stats: data?.stats,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// ============================================
// Join Requests
// ============================================

export function useJoinRequests(groupId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    groupId ? `/api/groups/${groupId}/join-requests` : null
  );

  return {
    requests: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// ============================================
// Stats & Dashboard
// ============================================

export function useMyStats() {
  const { data, error, isLoading, mutate } = useSWR<UserStats>("/api/stats");

  return {
    stats: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useMyCalendar(year: number, month: number) {
  const { data, error, isLoading, mutate } = useSWR<CalendarData>(
    `/api/calendar?year=${year}&month=${month}`
  );

  return {
    calendar: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useAllGroupsStatus() {
  const { data, error, isLoading, mutate } = useSWR<AllGroupsStatus>(
    "/api/groups/status"
  );

  return {
    status: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
