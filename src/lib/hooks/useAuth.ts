"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import {
  authLoadingAtom,
  profileAtom,
  profileStatsAtom,
  profileLastFetchedAtom,
  isProfileCacheValidAtom,
  isAuthenticatedAtom,
} from "@/lib/store/auth";
import {
  getMyProfile,
  signOut as apiSignOut,
  deleteAccount as apiDeleteAccount,
} from "@/lib/api/client";

/**
 * 인증 상태 관리 훅
 * - 전역 상태로 프로필 관리
 * - localStorage 캐싱
 * - 자동 세션 체크
 */
export function useAuth() {
  const [profile, setProfile] = useAtom(profileAtom);
  const [stats, setStats] = useAtom(profileStatsAtom);
  const [isLoading, setIsLoading] = useAtom(authLoadingAtom);
  const setLastFetched = useSetAtom(profileLastFetchedAtom);
  const isCacheValid = useAtomValue(isProfileCacheValidAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  // 세션 체크 및 프로필 로드
  const checkAuth = useCallback(async (forceRefresh = false) => {
    // 캐시가 유효하고 강제 갱신이 아니면 스킵
    if (!forceRefresh && isCacheValid && profile) {
      setIsLoading(false);
      return true;
    }

    setIsLoading(true);

    try {
      // 프로필 로드 (인증 체크 포함)
      const profileResult = await getMyProfile();

      if (!profileResult.success || !profileResult.data) {
        // 인증 실패 - 상태 초기화
        setProfile(null);
        setIsLoading(false);
        return false;
      }

      setProfile(profileResult.data.profile);
      setStats(profileResult.data.stats);
      setLastFetched(Date.now());
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Auth check failed:", error);
      setProfile(null);
      setIsLoading(false);
      return false;
    }
  }, [profile, isCacheValid, setProfile, setStats, setLastFetched, setIsLoading]);

  // 프로필만 갱신 (수정 후 호출)
  const refreshProfile = useCallback(async () => {
    const result = await getMyProfile();

    if (result.success && result.data) {
      setProfile(result.data.profile);
      setStats(result.data.stats);
      setLastFetched(Date.now());
    }

    return result.success;
  }, [setProfile, setStats, setLastFetched]);

  // 로그아웃
  const signOut = useCallback(async () => {
    await apiSignOut();
    setProfile(null);
    setLastFetched(0);
    // localStorage 클리어
    if (typeof window !== "undefined") {
      localStorage.removeItem("shinya:profile");
      localStorage.removeItem("shinya:stats");
      localStorage.removeItem("shinya:profile_fetched");
    }
  }, [setProfile, setLastFetched]);

  // 회원 탈퇴
  const deleteAccount = useCallback(async () => {
    await apiDeleteAccount();
    setProfile(null);
    setLastFetched(0);
    if (typeof window !== "undefined") {
      localStorage.removeItem("shinya:profile");
      localStorage.removeItem("shinya:stats");
      localStorage.removeItem("shinya:profile_fetched");
    }
  }, [setProfile, setLastFetched]);

  return {
    profile,
    stats,
    isLoading,
    isAuthenticated,
    checkAuth,
    refreshProfile,
    signOut,
    deleteAccount,
  };
}

/**
 * 인증 필수 페이지용 훅
 * - 마운트 시 자동으로 인증 체크
 * - 미인증 시 로그인 페이지로 리다이렉트
 */
export function useRequireAuth(redirectTo = "/login") {
  const auth = useAuth();

  useEffect(() => {
    const check = async () => {
      const isAuth = await auth.checkAuth();
      if (!isAuth && typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    };
    check();
  }, [auth, redirectTo]);

  return auth;
}
