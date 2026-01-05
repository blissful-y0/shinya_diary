import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Profile, ProfileStats } from "@/lib/api/client";

/**
 * 인증 상태 전역 관리 (Jotai + localStorage)
 * profile에 id, email 포함되어 있으므로 profile만 저장
 */

// localStorage에 저장되는 프로필 정보
export const profileAtom = atomWithStorage<Profile | null>("shinya:profile", null);

// 프로필 통계 (localStorage 저장)
export const profileStatsAtom = atomWithStorage<ProfileStats>("shinya:stats", {
  groupCount: 0,
});

// 인증 상태 로딩 중
export const authLoadingAtom = atom<boolean>(true);

// 인증 여부 (derived atom)
export const isAuthenticatedAtom = atom((get) => {
  return get(profileAtom) !== null;
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
