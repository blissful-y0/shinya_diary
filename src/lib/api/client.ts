import { isValidImageFile, convertToWebP } from "@/lib/utils/image";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: "네트워크 오류가 발생했습니다" };
  }
}

// ============================================
// Auth API
// ============================================

export interface CurrentUser {
  id: string;
  email: string;
}

export async function getCurrentUser() {
  return fetchApi<CurrentUser>("/api/auth/me");
}

export function signInWithGoogle() {
  window.location.href = "/api/auth/google";
}

export async function signOut() {
  const result = await fetchApi<{ success: boolean }>("/api/auth/signout", {
    method: "POST",
  });
  if (result.success) {
    window.location.href = "/login";
  }
  return result;
}

export async function deleteAccount() {
  const result = await fetchApi<{ success: boolean }>(
    "/api/auth/delete-account",
    {
      method: "DELETE",
    }
  );
  if (result.success) {
    window.location.href = "/login";
  }
  return result;
}

// ============================================
// Groups API
// ============================================

export interface Group {
  id: string;
  name: string;
  owner_id: string;
  icon_url: string | null;
  cover_image_url: string | null;
  invite_code: string;
  created_at: string;
  memberCount?: number;
}

export interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  nickname: string | null;
  avatar_url: string | null;
  joined_at: string;
  isOwner?: boolean;
}

export async function getMyGroups() {
  return fetchApi<Group[]>("/api/groups");
}

export async function getGroup(groupId: string) {
  return fetchApi<Group>(`/api/groups/${groupId}`);
}

export async function createGroup(name: string, nickname: string) {
  return fetchApi<{ groupId: string }>("/api/groups", {
    method: "POST",
    body: JSON.stringify({ name, nickname }),
  });
}

export async function updateGroup(
  groupId: string,
  data: {
    name?: string;
    iconUrl?: string | null;
    coverImageUrl?: string | null;
  }
) {
  return fetchApi<{ success: boolean }>(`/api/groups/${groupId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteGroup(groupId: string) {
  return fetchApi<{ success: boolean }>(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
}

export async function findGroupByInviteCode(code: string) {
  return fetchApi<Group>(`/api/groups/invite?code=${encodeURIComponent(code)}`);
}

export async function getGroupMembers(groupId: string) {
  return fetchApi<GroupMember[]>(`/api/groups/${groupId}/members`);
}

export async function updateGroupProfile(
  groupId: string,
  userId: string,
  data: { nickname?: string; avatarUrl?: string | null }
) {
  return fetchApi<{ success: boolean }>(
    `/api/groups/${groupId}/members/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function removeMember(groupId: string, userId: string) {
  return fetchApi<{ success: boolean }>(
    `/api/groups/${groupId}/members/${userId}`,
    {
      method: "DELETE",
    }
  );
}

// Join Requests
export interface JoinRequest {
  id: string;
  user_id: string;
  group_id: string;
  status: string;
  created_at: string;
  user: {
    nickname: string | null;
    avatar_url: string | null;
  };
}

export async function getJoinRequests(groupId: string) {
  return fetchApi<JoinRequest[]>(`/api/groups/${groupId}/join-requests`);
}

export async function createJoinRequest(groupId: string) {
  return fetchApi<{ success: boolean }>(
    `/api/groups/${groupId}/join-requests`,
    {
      method: "POST",
    }
  );
}

export async function handleJoinRequest(
  groupId: string,
  requestId: string,
  action: "approve" | "reject",
  nickname?: string
) {
  return fetchApi<{ success: boolean }>(
    `/api/groups/${groupId}/join-requests/${requestId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ action, nickname }),
    }
  );
}

// ============================================
// Diaries API
// ============================================

export interface Diary {
  id: string;
  group_id: string;
  user_id: string | null;
  content: string | null;
  image_url: string | null;
  date: string;
  created_at: string;
  author?: {
    nickname: string | null;
    avatar_url: string | null;
  } | null;
  comments?: Comment[];
  comment_count?: number;
}

export async function getDiaries(groupId: string, date: string) {
  return fetchApi<Diary[]>(
    `/api/diaries?groupId=${encodeURIComponent(
      groupId
    )}&date=${encodeURIComponent(date)}`
  );
}

export async function getMyDiary(groupId: string, date: string) {
  return fetchApi<Diary | null>(
    `/api/diaries/my?groupId=${encodeURIComponent(
      groupId
    )}&date=${encodeURIComponent(date)}`
  );
}

export async function checkTodayDiary(groupId: string, date: string) {
  return fetchApi<{ hasWritten: boolean }>(
    `/api/diaries/check?groupId=${encodeURIComponent(
      groupId
    )}&date=${encodeURIComponent(date)}`
  );
}

export async function createDiary(data: {
  groupId: string;
  content?: string;
  imageUrl?: string;
  date: string;
}) {
  return fetchApi<Diary>("/api/diaries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDiary(
  diaryId: string,
  data: { content?: string; imageUrl?: string | null }
) {
  return fetchApi<{ success: boolean }>(`/api/diaries/${diaryId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteDiary(diaryId: string) {
  return fetchApi<{ success: boolean }>(`/api/diaries/${diaryId}`, {
    method: "DELETE",
  });
}

// ============================================
// Comments API
// ============================================

export interface Comment {
  id: string;
  diary_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: {
    nickname: string | null;
    avatar_url: string | null;
  };
  isOwn?: boolean;
}

export async function getComments(diaryId: string, groupId: string) {
  return fetchApi<Comment[]>(
    `/api/comments?diaryId=${encodeURIComponent(
      diaryId
    )}&groupId=${encodeURIComponent(groupId)}`
  );
}

export async function getCommentCount(diaryId: string) {
  return fetchApi<{ count: number }>(
    `/api/comments/count?diaryId=${encodeURIComponent(diaryId)}`
  );
}

export async function createComment(diaryId: string, content: string) {
  return fetchApi<Comment>("/api/comments", {
    method: "POST",
    body: JSON.stringify({ diaryId, content }),
  });
}

export async function updateComment(commentId: string, content: string) {
  return fetchApi<{ success: boolean }>(`/api/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(commentId: string) {
  return fetchApi<{ success: boolean }>(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
}

// ============================================
// Profile API
// ============================================

export interface Profile {
  id: string;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  provider: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileStats {
  groupCount: number;
}

export async function getMyProfile() {
  return fetchApi<{ profile: Profile; stats: ProfileStats }>("/api/profile");
}

export async function updateMyProfile(data: {
  nickname?: string;
  avatarUrl?: string | null;
}) {
  return fetchApi<{ success: boolean }>("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ============================================
// Upload API (Cloudflare Images)
// ============================================

export async function uploadImage(file: File, folder: string = "diaries") {
  try {
    if (!isValidImageFile(file)) {
      return { 
        success: false, 
        error: "지원하지 않는 이미지 형식입니다. (JPG, PNG, GIF, WebP, HEIC 지원)" 
      };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "파일 크기는 10MB 이하여야 합니다" };
    }

    const webpFile = await convertToWebP(file);

    const formData = new FormData();
    formData.append("file", webpFile);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    return json as ApiResponse<{ url: string; imageId: string }>;
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, error: "업로드 실패" };
  }
}

export async function getUploadUrl(folder: string = "diaries") {
  return fetchApi<{ uploadURL: string; imageId: string; deliveryUrl: string }>(
    `/api/upload?folder=${encodeURIComponent(folder)}`
  );
}

export async function uploadImageDirect(
  uploadURL: string,
  file: File
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(uploadURL, {
      method: "POST",
      body: formData,
    });

    return res.ok;
  } catch (error) {
    console.error("Direct Upload Error:", error);
    return false;
  }
}
