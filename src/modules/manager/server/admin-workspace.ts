"use server";
import { getUserServer } from "@/lib/supabase/getUser-server";
import { adminAuthClient } from "@/utils/supabase/supabaseAdmin";

interface WorkspaceProps {
  workspaceName: string;
  workspaceId: string;
}
async function adminworkspaceUpdate({
  workspaceId,
  workspaceName,
}: WorkspaceProps) {
  const user = await getUserServer();

  if (!user) throw new Error("Unauthorized");

  const { error } = await adminAuthClient.updateUserById(user.id, {
    user_metadata: {
      workspaces: {
        workspace_id: workspaceId,
        workspace_name: workspaceName,
      },
    },
  });

  if (error) throw new Error("update Auth Fail");

  return;
}

export { adminworkspaceUpdate };
