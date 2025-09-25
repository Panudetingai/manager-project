"use server";
import { getUserServer } from "@/lib/supabase/getUser-server";
import { createClient } from "../../../../../utils/supabase/server";

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
}
export async function inviteMember({workspace_owner_id, user_owner_id}: InviteMemberparams) {
  const supabase = await createClient();
  const user = await getUserServer()
  const {error} = await supabase
    .from("workspace_invite")
    .insert({
      workspace_owner_id,
      user_owner_id,
      invited_by: user.id,
      workspace_status: "pending",
      created_at: new Date().toISOString(),
    });

  if (error) return { error };

  return "success invite member";
}
