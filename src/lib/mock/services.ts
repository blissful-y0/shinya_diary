/* =============================================
   Mock 서비스 - Supabase 연결 없이 테스트용
   ============================================= */

import {
  MOCK_CURRENT_USER,
  MOCK_USERS,
  MOCK_GROUPS,
  MOCK_GROUP_MEMBERS,
  MOCK_JOIN_REQUESTS,
  MOCK_DIARIES,
  MOCK_COMMENTS,
  generateId,
  generateInviteCode,
  type JoinRequest,
} from "./data";
import type { Group, GroupMember, Diary, Comment } from "@/types/database";

/* =============================================
   인증 관련
   ============================================= */

export function getCurrentUser() {
  return MOCK_CURRENT_USER;
}

/* =============================================
   그룹 관련
   ============================================= */

/* 내가 속한 그룹 목록 조회 */
export function getMyGroups(): (Group & { memberCount: number })[] {
  const userId = MOCK_CURRENT_USER.id;
  const myGroupIds = MOCK_GROUP_MEMBERS
    .filter((m) => m.user_id === userId)
    .map((m) => m.group_id);

  return MOCK_GROUPS
    .filter((g) => myGroupIds.includes(g.id))
    .map((g) => ({
      ...g,
      memberCount: MOCK_GROUP_MEMBERS.filter((m) => m.group_id === g.id).length,
    }));
}

/* 그룹 상세 조회 */
export function getGroup(groupId: string): Group | null {
  return MOCK_GROUPS.find((g) => g.id === groupId) || null;
}

/* 그룹 생성 */
export function createGroup(name: string): Group {
  const newGroup: Group = {
    id: `group-${generateId()}`,
    name,
    icon_url: null,
    cover_image_url: null,
    invite_code: generateInviteCode(),
    owner_id: MOCK_CURRENT_USER.id,
    created_at: new Date().toISOString(),
  };

  MOCK_GROUPS.push(newGroup);

  /* 생성자를 멤버로 추가 */
  const newMember: GroupMember = {
    id: `member-${generateId()}`,
    group_id: newGroup.id,
    user_id: MOCK_CURRENT_USER.id,
    nickname: MOCK_CURRENT_USER.nickname,
    avatar_url: MOCK_CURRENT_USER.avatar_url,
    joined_at: new Date().toISOString(),
  };

  MOCK_GROUP_MEMBERS.push(newMember);

  return newGroup;
}

/* 그룹 정보 수정 (방장만 가능) */
export function updateGroup(
  groupId: string,
  params: { name?: string; iconUrl?: string | null; coverImageUrl?: string | null }
): boolean {
  const group = MOCK_GROUPS.find((g) => g.id === groupId);
  if (!group || group.owner_id !== MOCK_CURRENT_USER.id) {
    return false;
  }

  if (params.name !== undefined) {
    group.name = params.name;
  }
  if (params.iconUrl !== undefined) {
    group.icon_url = params.iconUrl;
  }
  if (params.coverImageUrl !== undefined) {
    group.cover_image_url = params.coverImageUrl;
  }

  return true;
}

/* 초대 코드로 그룹 찾기 */
export function findGroupByInviteCode(code: string): Group | null {
  return MOCK_GROUPS.find(
    (g) => g.invite_code.toUpperCase() === code.toUpperCase()
  ) || null;
}

/* 그룹 가입 요청 */
export function requestJoinGroup(groupId: string): { success: boolean; message: string } {
  const userId = MOCK_CURRENT_USER.id;

  /* 이미 멤버인지 확인 */
  const isMember = MOCK_GROUP_MEMBERS.some(
    (m) => m.group_id === groupId && m.user_id === userId
  );
  if (isMember) {
    return { success: false, message: "이미 그룹의 멤버입니다." };
  }

  /* 이미 요청했는지 확인 */
  const existingRequest = MOCK_JOIN_REQUESTS.find(
    (r) => r.group_id === groupId && r.user_id === userId && r.status === "pending"
  );
  if (existingRequest) {
    return { success: false, message: "이미 가입 요청을 보냈습니다." };
  }

  /* 멤버 수 확인 (최대 4명) */
  const memberCount = MOCK_GROUP_MEMBERS.filter((m) => m.group_id === groupId).length;
  if (memberCount >= 4) {
    return { success: false, message: "그룹의 최대 인원(4명)을 초과했습니다." };
  }

  /* 요청 생성 */
  const newRequest: JoinRequest = {
    id: `request-${generateId()}`,
    group_id: groupId,
    user_id: userId,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  MOCK_JOIN_REQUESTS.push(newRequest);

  return { success: true, message: "가입 요청을 보냈습니다." };
}

/* 가입 요청 목록 조회 (방장용) */
export function getJoinRequests(groupId: string): (JoinRequest & { user: typeof MOCK_CURRENT_USER })[] {
  const group = getGroup(groupId);
  if (!group || group.owner_id !== MOCK_CURRENT_USER.id) {
    return [];
  }

  return MOCK_JOIN_REQUESTS
    .filter((r) => r.group_id === groupId && r.status === "pending")
    .map((r) => ({
      ...r,
      user: MOCK_USERS.find((u) => u.id === r.user_id) || MOCK_CURRENT_USER,
    }));
}

/* 가입 요청 승인 */
export function approveJoinRequest(requestId: string): boolean {
  const request = MOCK_JOIN_REQUESTS.find((r) => r.id === requestId);
  if (!request) return false;

  /* 멤버 수 확인 */
  const memberCount = MOCK_GROUP_MEMBERS.filter((m) => m.group_id === request.group_id).length;
  if (memberCount >= 4) return false;

  /* 요청 상태 변경 */
  request.status = "approved";

  /* 멤버로 추가 */
  const user = MOCK_USERS.find((u) => u.id === request.user_id);
  if (user) {
    const newMember: GroupMember = {
      id: `member-${generateId()}`,
      group_id: request.group_id,
      user_id: user.id,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      joined_at: new Date().toISOString(),
    };
    MOCK_GROUP_MEMBERS.push(newMember);
  }

  return true;
}

/* 가입 요청 거절 */
export function rejectJoinRequest(requestId: string): boolean {
  const request = MOCK_JOIN_REQUESTS.find((r) => r.id === requestId);
  if (!request) return false;

  request.status = "rejected";
  return true;
}

/* 그룹 멤버 목록 조회 */
export function getGroupMembers(groupId: string): GroupMember[] {
  return MOCK_GROUP_MEMBERS.filter((m) => m.group_id === groupId);
}

/* 내가 방장인지 확인 */
export function isGroupOwner(groupId: string): boolean {
  const group = getGroup(groupId);
  return group?.owner_id === MOCK_CURRENT_USER.id;
}

/* 내가 그룹 멤버인지 확인 */
export function isGroupMember(groupId: string): boolean {
  const userId = MOCK_CURRENT_USER.id;
  return MOCK_GROUP_MEMBERS.some(
    (m) => m.group_id === groupId && m.user_id === userId
  );
}

/* 내 그룹 프로필 조회 */
export function getMyGroupProfile(groupId: string): GroupMember | null {
  const userId = MOCK_CURRENT_USER.id;
  return MOCK_GROUP_MEMBERS.find(
    (m) => m.group_id === groupId && m.user_id === userId
  ) || null;
}

/* 내 그룹 프로필 수정 */
export function updateMyGroupProfile(
  groupId: string,
  params: { nickname?: string; avatarUrl?: string | null }
): boolean {
  const userId = MOCK_CURRENT_USER.id;
  const member = MOCK_GROUP_MEMBERS.find(
    (m) => m.group_id === groupId && m.user_id === userId
  );

  if (!member) return false;

  if (params.nickname !== undefined) {
    member.nickname = params.nickname || null;
  }
  if (params.avatarUrl !== undefined) {
    member.avatar_url = params.avatarUrl;
  }

  return true;
}

/* 그룹 삭제 (방장만 가능) */
export function deleteGroup(groupId: string): boolean {
  const group = getGroup(groupId);
  if (!group || group.owner_id !== MOCK_CURRENT_USER.id) {
    return false;
  }

  /* 그룹 삭제 */
  const groupIndex = MOCK_GROUPS.findIndex((g) => g.id === groupId);
  if (groupIndex !== -1) {
    MOCK_GROUPS.splice(groupIndex, 1);
  }

  /* 멤버 삭제 */
  for (let i = MOCK_GROUP_MEMBERS.length - 1; i >= 0; i--) {
    if (MOCK_GROUP_MEMBERS[i].group_id === groupId) {
      MOCK_GROUP_MEMBERS.splice(i, 1);
    }
  }

  /* 가입 요청 삭제 */
  for (let i = MOCK_JOIN_REQUESTS.length - 1; i >= 0; i--) {
    if (MOCK_JOIN_REQUESTS[i].group_id === groupId) {
      MOCK_JOIN_REQUESTS.splice(i, 1);
    }
  }

  /* 다이어리 삭제 */
  for (let i = MOCK_DIARIES.length - 1; i >= 0; i--) {
    if (MOCK_DIARIES[i].group_id === groupId) {
      MOCK_DIARIES.splice(i, 1);
    }
  }

  return true;
}

/* 멤버 강퇴 (방장만 가능, 자기 자신은 강퇴 불가) */
export function removeMember(groupId: string, memberId: string): boolean {
  const group = getGroup(groupId);
  if (!group || group.owner_id !== MOCK_CURRENT_USER.id) {
    return false;
  }

  const member = MOCK_GROUP_MEMBERS.find((m) => m.id === memberId);
  if (!member || member.group_id !== groupId) {
    return false;
  }

  /* 자기 자신 강퇴 불가 */
  if (member.user_id === MOCK_CURRENT_USER.id) {
    return false;
  }

  /* 멤버 삭제 */
  const index = MOCK_GROUP_MEMBERS.findIndex((m) => m.id === memberId);
  if (index !== -1) {
    MOCK_GROUP_MEMBERS.splice(index, 1);
  }

  return true;
}

/* 그룹 멤버 상세 정보 조회 (방장용) */
export interface GroupMemberWithUser extends GroupMember {
  isOwner: boolean;
}

export function getGroupMembersWithDetails(groupId: string): GroupMemberWithUser[] {
  const group = getGroup(groupId);
  if (!group) return [];

  return MOCK_GROUP_MEMBERS
    .filter((m) => m.group_id === groupId)
    .map((m) => ({
      ...m,
      isOwner: m.user_id === group.owner_id,
    }));
}

/* =============================================
   다이어리 관련
   ============================================= */

export interface DiaryWithAuthor extends Diary {
  author: {
    nickname: string;
    avatar_url: string | null;
  };
}

/* 날짜별 다이어리 조회 (멤버만 조회 가능) */
export function getDiariesByDate(groupId: string, date: string): DiaryWithAuthor[] {
  /* 멤버 여부 확인 */
  if (!isGroupMember(groupId)) {
    return [];
  }

  return MOCK_DIARIES
    .filter((d) => d.group_id === groupId && d.date === date)
    .map((d) => {
      const member = MOCK_GROUP_MEMBERS.find(
        (m) => m.group_id === groupId && m.user_id === d.user_id
      );
      return {
        ...d,
        author: {
          nickname: member?.nickname || "알 수 없음",
          avatar_url: member?.avatar_url || null,
        },
      };
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/* 오늘 작성 여부 확인 */
export function checkTodayDiary(groupId: string, date: string): boolean {
  const userId = MOCK_CURRENT_USER.id;
  return MOCK_DIARIES.some(
    (d) => d.group_id === groupId && d.user_id === userId && d.date === date
  );
}

/* 내 다이어리 조회 */
export function getMyDiary(groupId: string, date: string): Diary | null {
  const userId = MOCK_CURRENT_USER.id;
  return MOCK_DIARIES.find(
    (d) => d.group_id === groupId && d.user_id === userId && d.date === date
  ) || null;
}

/* 다이어리 생성 */
export function createDiary(params: {
  groupId: string;
  content?: string;
  imageUrl?: string;
  date: string;
}): Diary {
  const userId = MOCK_CURRENT_USER.id;

  const newDiary: Diary = {
    id: `diary-${generateId()}`,
    group_id: params.groupId,
    user_id: userId,
    content: params.content || null,
    image_url: params.imageUrl || null,
    sticker_data: null,
    date: params.date,
    created_at: new Date().toISOString(),
  };

  MOCK_DIARIES.push(newDiary);
  return newDiary;
}

/* 다이어리 수정 */
export function updateDiary(
  diaryId: string,
  params: { content?: string; imageUrl?: string }
): boolean {
  const diary = MOCK_DIARIES.find((d) => d.id === diaryId);
  if (!diary || diary.user_id !== MOCK_CURRENT_USER.id) {
    return false;
  }

  if (params.content !== undefined) {
    diary.content = params.content || null;
  }
  if (params.imageUrl !== undefined) {
    diary.image_url = params.imageUrl || null;
  }

  return true;
}

/* 다이어리 삭제 */
export function deleteDiary(diaryId: string): boolean {
  const index = MOCK_DIARIES.findIndex(
    (d) => d.id === diaryId && d.user_id === MOCK_CURRENT_USER.id
  );
  if (index === -1) return false;

  MOCK_DIARIES.splice(index, 1);

  /* 관련 코멘트도 삭제 */
  for (let i = MOCK_COMMENTS.length - 1; i >= 0; i--) {
    if (MOCK_COMMENTS[i].diary_id === diaryId) {
      MOCK_COMMENTS.splice(i, 1);
    }
  }

  return true;
}

/* =============================================
   코멘트 관련
   ============================================= */

export interface CommentWithAuthor extends Comment {
  author: {
    nickname: string;
    avatar_url: string | null;
  };
  isOwn: boolean;
}

/* 다이어리의 코멘트 목록 조회 */
export function getCommentsByDiary(diaryId: string, groupId: string): CommentWithAuthor[] {
  /* 멤버 여부 확인 */
  if (!isGroupMember(groupId)) {
    return [];
  }

  return MOCK_COMMENTS
    .filter((c) => c.diary_id === diaryId)
    .map((c) => {
      const member = MOCK_GROUP_MEMBERS.find(
        (m) => m.group_id === groupId && m.user_id === c.user_id
      );
      return {
        ...c,
        author: {
          nickname: member?.nickname || "알 수 없음",
          avatar_url: member?.avatar_url || null,
        },
        isOwn: c.user_id === MOCK_CURRENT_USER.id,
      };
    })
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

/* 코멘트 수 조회 */
export function getCommentCount(diaryId: string): number {
  return MOCK_COMMENTS.filter((c) => c.diary_id === diaryId).length;
}

/* 코멘트 생성 */
export function createComment(diaryId: string, content: string): Comment | null {
  if (!content.trim()) return null;

  const newComment: Comment = {
    id: `comment-${generateId()}`,
    diary_id: diaryId,
    user_id: MOCK_CURRENT_USER.id,
    content: content.trim(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  MOCK_COMMENTS.push(newComment);
  return newComment;
}

/* 코멘트 수정 */
export function updateComment(commentId: string, content: string): boolean {
  const comment = MOCK_COMMENTS.find((c) => c.id === commentId);
  if (!comment || comment.user_id !== MOCK_CURRENT_USER.id) {
    return false;
  }

  if (!content.trim()) return false;

  comment.content = content.trim();
  comment.updated_at = new Date().toISOString();
  return true;
}

/* 코멘트 삭제 */
export function deleteComment(commentId: string): boolean {
  const index = MOCK_COMMENTS.findIndex(
    (c) => c.id === commentId && c.user_id === MOCK_CURRENT_USER.id
  );
  if (index === -1) return false;

  MOCK_COMMENTS.splice(index, 1);
  return true;
}
