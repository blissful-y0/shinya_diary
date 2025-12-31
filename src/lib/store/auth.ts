import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Profile, ProfileStats } from "@/lib/api/client";

/**
 * 인증 상태 전역 관리 (Jotai + localStorage)
 */

// 현재 유저 정보
export interface AuthUser {
  id: string;
  email: string;
}

// localStorage에 저장되는 프로필 정보
export const profileAtom = atomWithStorage<Profile | null>("shinya:profile", null);

// 프로필 통계 (캐싱용, localStorage 저장 안함)
export const profileStatsAtom = atom<ProfileStats>({
  diaryCount: 0,
  groupCount: 0,
  streakDays: 0,
});

// 인증 유저 정보 (localStorage)
export const authUserAtom = atomWithStorage<AuthUser | null>("shinya:user", null);

// 인증 상태 로딩 중
export const authLoadingAtom = atom<boolean>(true);

// 인증 여부 (derived atom)
export const isAuthenticatedAtom = atom((get) => {
  return get(authUserAtom) !== null;
});

// 프로필 마지막 로드 시간 (캐시 유효성 체크용)
export const profileLastFetchedAtom = atomWithStorage<number>("shinya:profile_fetched", 0);

// 캐시 유효 시간 (5분)
const CACHE_TTL = 5 * 60 * 1000;

// 캐시가 유효한지 확인
export const isProfileCacheValidAtom = atom((get) => {
  const lastFetched = get(profileLastFetchedAtom);
  return Date.now() - lastFetched < CACHE_TTL;
});
