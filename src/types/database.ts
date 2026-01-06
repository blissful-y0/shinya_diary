export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface StickerData {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  zIndex: number;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          public_id: string;
          email: string;
          nickname: string | null;
          avatar_url: string | null;
          provider: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          nickname?: string | null;
          avatar_url?: string | null;
          provider?: string;
        };
        Update: {
          nickname?: string | null;
          avatar_url?: string | null;
        };
      };
      groups: {
        Row: {
          id: string;
          public_id: string;
          name: string;
          icon_url: string | null;
          cover_image_url: string | null;
          invite_code: string;
          owner_id: string;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          name: string;
          owner_id: string;
          icon_url?: string | null;
          cover_image_url?: string | null;
        };
        Update: {
          name?: string;
          icon_url?: string | null;
          cover_image_url?: string | null;
        };
      };
      group_members: {
        Row: {
          id: string;
          public_id: string;
          group_id: string;
          user_id: string;
          nickname: string | null;
          avatar_url: string | null;
          joined_at: string;
          deleted_at: string | null;
        };
        Insert: {
          group_id: string;
          user_id: string;
          nickname?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          nickname?: string | null;
          avatar_url?: string | null;
        };
      };
      diaries: {
        Row: {
          id: string;
          public_id: string;
          group_id: string;
          user_id: string;
          content: string | null;
          image_url: string | null;
          sticker_data: StickerData[] | null;
          date: string;
          created_at: string;
          deleted_at: string | null;
          comment_count: number;
        };
        Insert: {
          group_id: string;
          user_id: string;
          content?: string | null;
          image_url?: string | null;
          sticker_data?: StickerData[] | null;
          date: string;
        };
        Update: {
          content?: string | null;
          image_url?: string | null;
          sticker_data?: StickerData[] | null;
        };
      };
      comments: {
        Row: {
          id: string;
          public_id: string;
          diary_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          diary_id: string;
          user_id: string;
          content: string;
        };
        Update: {
          content?: string;
        };
      };
      join_requests: {
        Row: {
          id: string;
          public_id: string;
          group_id: string;
          user_id: string;
          status: "pending" | "approved" | "rejected";
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          group_id: string;
          user_id: string;
          status?: "pending" | "approved" | "rejected";
        };
        Update: {
          status?: "pending" | "approved" | "rejected";
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Group = Database["public"]["Tables"]["groups"]["Row"];
export type GroupMember = Database["public"]["Tables"]["group_members"]["Row"];
export type Diary = Database["public"]["Tables"]["diaries"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type JoinRequest = Database["public"]["Tables"]["join_requests"]["Row"];

export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type GroupInsert = Database["public"]["Tables"]["groups"]["Insert"];
export type DiaryInsert = Database["public"]["Tables"]["diaries"]["Insert"];
export type CommentInsert = Database["public"]["Tables"]["comments"]["Insert"];

export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type GroupUpdate = Database["public"]["Tables"]["groups"]["Update"];
export type DiaryUpdate = Database["public"]["Tables"]["diaries"]["Update"];
export type CommentUpdate = Database["public"]["Tables"]["comments"]["Update"];
