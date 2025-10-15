"use server";

import { getUserServer } from "@/lib/supabase/getUser-server";
import redis from "@/lib/upstash";
import { createClient } from "../../../../utils/supabase/server";
import { FormWorkspaceType } from "../schema/form-workspace";

export async function createWorkspaceAPI(data: FormWorkspaceType) {
  const user = await getUserServer();
  const supabase = await createClient();
  if (!user) throw new Error("User not found");

  const { error, data: workspace } = await supabase
    .from("workspace")
    .insert({
      name: data.workspacename,
      workspace_icon: data.icon,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw new Error("Create workspace failed");

  await redis.del(`workspaces:${user.id}`);
  return workspace;
}
