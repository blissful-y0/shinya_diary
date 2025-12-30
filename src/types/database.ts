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
          email: string;
          nickname: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nickname?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nickname?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          icon_url: string | null;
          cover_image_url: string | null;
          invite_code: string;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon_url?: string | null;
          cover_image_url?: string | null;
          invite_code: string;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          icon_url?: string | null;
          cover_image_url?: string | null;
          invite_code?: string;
          owner_id?: string;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          nickname: string | null;
          avatar_url: string | null;
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          nickname?: string | null;
          avatar_url?: string | null;
          joined_at?: string;
        };
        Update: {
          nickname?: string | null;
          avatar_url?: string | null;
        };
      };
      diaries: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          content: string | null;
          image_url: string | null;
          sticker_data: StickerData[] | null;
          created_at: string;
          date: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          content?: string | null;
          image_url?: string | null;
          sticker_data?: StickerData[] | null;
          created_at?: string;
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
          diary_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          diary_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          updated_at?: string;
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
