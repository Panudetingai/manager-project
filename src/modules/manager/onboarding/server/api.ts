"use server";

import { getUserServer } from "@/lib/supabase/getUser-server";
import { createClient } from "../../../../../utils/supabase/server";
import { descriptiontype } from "../schema/onboard-schema";

export async function submitOnboarding(data: descriptiontype) {
  const supabase = await createClient();
  const user = await getUserServer();
  if (!user) throw new Error("User not found");

  const { error } = await supabase.rpc("create_onboarding_and_workspace", {
    p_user_id: user.id,
    p_description: data,
    p_user_type: data.role,
    p_workspace_name: data.workspaceName,
  });

  if (error) throw new Error(error.message);
  return true;
}
