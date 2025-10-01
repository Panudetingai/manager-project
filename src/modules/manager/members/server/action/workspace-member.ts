"use server";
import { getUserServer } from "@/lib/supabase/getUser-server";
import redis from "@/lib/upstash";
import { Database } from "../../../../../../utils/supabase/database.types";
import { createClient } from "../../../../../../utils/supabase/server";
import { tableInvitationType } from "../../invitations/table-list-invitations";

export async function cancelInvite(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workspace_invite")
    .delete()
    .eq("workspace_owner_id", id);

  if (error) return { error };

  return "success cancel invite";
}

// Future feature Invite Member Again
export type InviteMemberparams = {
  workspace_owner_id: string;
  user_owner_id: string;
};
export async function inviteMember({
  workspace_owner_id,
  user_owner_id,
}: InviteMemberparams) {
  const supabase = await createClient();
  const user = await getUserServer();

  if (!user) return { error: "User not found" };

  const { error } = await supabase.from("workspace_invite").insert({
    workspace_owner_id,
    user_owner_id,
    invited_by: user.id,
    workspace_status: "pending",
    created_at: new Date().toISOString(),
  });

  if (error) return { error };

  return "success invite member";
}

// approve invitation
/**
 *
 * @param value tableInvitationType
 * @returns
 */
export async function approveInvitation({
  value,
}: {
  value: tableInvitationType;
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("workspace_approved", {
    w_user_owner_id: value.user_owner_id,
    w_workspace_owner_id: value.workspace_owner_id,
    w_invited_by: value.invited_by,
    w_workspace_status: "answer",
    w_role: "member",
    w_joined: new Date().toISOString(),
  });

  if (error) return { error };

  await redis.del(`workspaces:${value.user_owner_id}`);

  return "success approve invitation";
}

// cancel invitation
export async function cancelInvitation({
  value,
}: {
  value: tableInvitationType;
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("cancel_workspace", {
    c_user_owner_id: value.user_owner_id,
    c_workspace_owner_id: value.workspace_owner_id,
  });

  if (error) return { error };

  return "success cancel invitation";
}

// update role member
export async function updateRoleMember({
  memberId,
  user_owner_id,
  role
}: {
  memberId: string;
  user_owner_id: string;
  role: Database["public"]["Enums"]["workspace_role"];
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("workspace_member")
    .update({ role: role })
    .eq("workspace_owner_id", memberId)
    .eq("user_id_owner_id", user_owner_id);

  if (error) return { error };

  return "success update role member";
}
