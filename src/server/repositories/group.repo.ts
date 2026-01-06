import { SupabaseClient } from "@supabase/supabase-js";

export const groupRepo = {
  async findById(db: SupabaseClient, groupId: string) {
    return db
      .from("groups")
      .select("id, public_id, name, owner_id, icon_url, cover_image_url, invite_code, created_at")
      .eq("id", groupId)
      .single();
  },

  async findByPublicId(db: SupabaseClient, publicId: string) {
    return db
      .from("groups")
      .select("id, public_id, name, owner_id, icon_url, cover_image_url, invite_code, created_at")
      .eq("public_id", publicId)
      .single();
  },

  async findByInviteCode(db: SupabaseClient, inviteCode: string) {
    return db
      .from("groups")
      .select("id, public_id, name, owner_id, icon_url, cover_image_url, invite_code, created_at")
      .eq("invite_code", inviteCode)
      .single();
  },

  async findByMembership(db: SupabaseClient, userId: string) {
    return db
      .from("group_members")
      .select("group_id")
      .eq("user_id", userId);
  },

  async findByIds(db: SupabaseClient, groupIds: string[]) {
    if (groupIds.length === 0) return { data: [], error: null };

    return db
      .from("groups")
      .select("id, public_id, name, owner_id, icon_url, cover_image_url, invite_code, created_at")
      .in("id", groupIds);
  },

  async create(db: SupabaseClient, data: { name: string; ownerId: string }) {
    return db
      .from("groups")
      .insert({
        name: data.name,
        owner_id: data.ownerId,
        invite_code: "",
      })
      .select("id, public_id")
      .single();
  },

  async update(
    db: SupabaseClient,
    groupId: string,
    data: { name?: string; iconUrl?: string | null; coverImageUrl?: string | null }
  ) {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.iconUrl !== undefined) updateData.icon_url = data.iconUrl;
    if (data.coverImageUrl !== undefined) updateData.cover_image_url = data.coverImageUrl;

    return db.from("groups").update(updateData).eq("id", groupId);
  },

  async delete(db: SupabaseClient, groupId: string) {
    return db.from("groups").delete().eq("id", groupId);
  },

  async getMemberCount(db: SupabaseClient, groupIds: string[]) {
    if (groupIds.length === 0) return { data: [], error: null };

    return db
      .from("group_members")
      .select("group_id")
      .in("group_id", groupIds);
  },
};
