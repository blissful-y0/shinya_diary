import { createClient } from "@/lib/supabase/client";
import type { Diary, GroupMember } from "@/types/database";

/* =============================================
   다이어리 관련 Supabase 쿼리
   ============================================= */

export interface DiaryWithAuthor extends Diary {
  author: {
    nickname: string;
    avatar_url: string | null;
  };
}

/**
 * 특정 그룹의 특정 날짜 다이어리 목록 조회
 */
export async function getDiariesByDate(
  groupId: string,
  date: string
): Promise<DiaryWithAuthor[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("diaries")
    .select(
      `
      *,
      author:group_members!inner(
        nickname,
        avatar_url
      )
    `
    )
    .eq("group_id", groupId)
    .eq("date", date)
    .eq("group_members.group_id", groupId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("다이어리 조회 실패:", error);
    return [];
  }

  return data as DiaryWithAuthor[];
}

/**
 * 오늘 내가 작성한 다이어리가 있는지 확인
 */
export async function checkTodayDiary(
  groupId: string,
  userId: string,
  date: string
): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("diaries")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("다이어리 확인 실패:", error);
  }

  return !!data;
}

/**
 * 다이어리 작성
 */
export async function createDiary(params: {
  groupId: string;
  userId: string;
  content?: string;
  imageUrl?: string;
  date: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("diaries").insert({
    group_id: params.groupId,
    user_id: params.userId,
    content: params.content || null,
    image_url: params.imageUrl || null,
    date: params.date,
  });

  if (error) {
    console.error("다이어리 작성 실패:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 다이어리 수정
 */
export async function updateDiary(
  diaryId: string,
  params: {
    content?: string;
    imageUrl?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("diaries")
    .update({
      content: params.content,
      image_url: params.imageUrl,
    })
    .eq("id", diaryId);

  if (error) {
    console.error("다이어리 수정 실패:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 내 다이어리 조회 (특정 그룹, 특정 날짜)
 */
export async function getMyDiary(
  groupId: string,
  userId: string,
  date: string
): Promise<Diary | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("내 다이어리 조회 실패:", error);
  }

  return data;
}

/**
 * 그룹 멤버 정보 조회 (내 프로필)
 */
export async function getMyGroupProfile(
  groupId: string,
  userId: string
): Promise<GroupMember | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("그룹 프로필 조회 실패:", error);
    return null;
  }

  return data;
}
