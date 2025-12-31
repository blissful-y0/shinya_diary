/* =============================================
   Mock 데이터 - Supabase 연결 없이 테스트용
   ============================================= */

import type { Profile, Group, GroupMember, Diary, Comment } from "@/types/database";

/* 현재 로그인 사용자 (Mock) */
export const MOCK_CURRENT_USER: Profile = {
  id: "user-1",
  email: "test@example.com",
  nickname: "테스트유저",
  avatar_url: null,
  provider: "google",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/* Mock 사용자 목록 */
export const MOCK_USERS: Profile[] = [
  MOCK_CURRENT_USER,
  {
    id: "user-2",
    email: "friend1@example.com",
    nickname: "친구1",
    avatar_url: null,
    provider: "google",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "user-3",
    email: "friend2@example.com",
    nickname: "친구2",
    avatar_url: null,
    provider: "apple",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/* Mock 그룹 목록 */
export let MOCK_GROUPS: Group[] = [
  {
    id: "group-1",
    name: "심심해요",
    icon_url: null,
    cover_image_url: null,
    invite_code: "ABC12345",
    owner_id: "user-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "group-2",
    name: "진짜 심심해요",
    icon_url: null,
    cover_image_url: null,
    invite_code: "XYZ98765",
    owner_id: "user-2",
    created_at: new Date().toISOString(),
  },
];

/* Mock 그룹 멤버 */
export let MOCK_GROUP_MEMBERS: GroupMember[] = [
  {
    id: "member-1",
    group_id: "group-1",
    user_id: "user-1",
    nickname: "테스트유저",
    avatar_url: null,
    joined_at: new Date().toISOString(),
  },
  {
    id: "member-2",
    group_id: "group-1",
    user_id: "user-2",
    nickname: "친구1",
    avatar_url: null,
    joined_at: new Date().toISOString(),
  },
  {
    id: "member-3",
    group_id: "group-2",
    user_id: "user-2",
    nickname: "친구1",
    avatar_url: null,
    joined_at: new Date().toISOString(),
  },
  {
    id: "member-4",
    group_id: "group-2",
    user_id: "user-1",
    nickname: "테스트유저",
    avatar_url: null,
    joined_at: new Date().toISOString(),
  },
];

/* 가입 요청 상태 타입 */
export type JoinRequestStatus = "pending" | "approved" | "rejected";

/* Mock 가입 요청 */
export interface JoinRequest {
  id: string;
  group_id: string;
  user_id: string;
  status: JoinRequestStatus;
  created_at: string;
  user?: Profile;
}

export let MOCK_JOIN_REQUESTS: JoinRequest[] = [
  {
    id: "request-1",
    group_id: "group-1",
    user_id: "user-3",
    status: "pending",
    created_at: new Date().toISOString(),
  },
];

/* Mock 다이어리 */
export let MOCK_DIARIES: Diary[] = [
  {
    id: "diary-1",
    group_id: "group-1",
    user_id: "user-1",
    content: "오늘은 정말 좋은 하루였어요. 날씨도 좋고 기분도 좋았습니다.",
    image_url: null,
    sticker_data: null,
    date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  },
  {
    id: "diary-2",
    group_id: "group-1",
    user_id: "user-2",
    content: "맛있는 점심을 먹었어요!",
    image_url: null,
    sticker_data: null,
    date: new Date().toISOString().split("T")[0],
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

/* Mock 코멘트 */
export let MOCK_COMMENTS: Comment[] = [
  {
    id: "comment-1",
    diary_id: "diary-1",
    user_id: "user-2",
    content: "정말 좋은 하루였네요! 부럽다~",
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "comment-2",
    diary_id: "diary-2",
    user_id: "user-1",
    content: "뭐 먹었어요? 나도 맛있는 거 먹고 싶다!",
    created_at: new Date(Date.now() - 900000).toISOString(),
    updated_at: new Date(Date.now() - 900000).toISOString(),
  },
];

/* 유틸리티 함수: 랜덤 ID 생성 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/* 유틸리티 함수: 초대 코드 생성 */
export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
