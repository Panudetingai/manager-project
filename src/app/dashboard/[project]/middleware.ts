import { getUserServer } from "@/lib/supabase/getUser-server";
import redis from "@/lib/upstash";
import { NextRequest, NextResponse } from "next/server";
import pathsConfig from "../../../../config/app.router";
import { createClient } from "../../../../utils/supabase/server";

type OwnedWorkspace = {
  name: string;
  id: string;
};

type MemberWorkspace = {
  name: string;
  workspace_icon: string | null;
};

type Workspace = OwnedWorkspace | MemberWorkspace;

export async function workspaceRedirect(request: NextRequest) {
  const supabase = await createClient();
  const pathParts = request.nextUrl.pathname.split("/");
  const params = pathParts.length > 2 ? { project: pathParts[2] } : {};
  const user = await getUserServer();

  // redis cache worksapce list per user could be implemented here for optimization
  const cacheKey = `workspaces:${user.id}`;
  let allWorkspaces = await redis.get(cacheKey) as Workspace[] | null;

  // ดึง workspace ที่ user เป็นเจ้าของ
  if (!allWorkspaces) {
    const { data: workspaces } = await supabase
      .from("workspace")
      .select("name, id")
      .eq("user_id", user.id);

    // ดึง workspace ที่ user เป็น member (ถูกเชิญ)
    const { data: memberWorkspaces } = await supabase
      .from("workspace_member")
      .select("role, workspace:workspace_owner_id(name, workspace_icon)")
      .eq("user_id_owner_id", user.id)
      .eq("workspace.name", params.project || "");

    allWorkspaces = [
      ...(workspaces ?? []),
      ...(Array.isArray(memberWorkspaces)
        ? memberWorkspaces.map((m) => m.workspace).filter(Boolean)
        : []),
    ];

    await redis.set(cacheKey, allWorkspaces, {ex: 60 * 60})
  }

  const found = allWorkspaces.find((w) => w.name === params.project);

  if (
    found &&
    request.nextUrl.pathname.startsWith(
      pathsConfig.app.workspaceDashboard.replace("[workspace]", params.project!)
    )
  ) {
    return;
  }

  if (!found && allWorkspaces && allWorkspaces.length > 0) {
    const url = request.nextUrl.clone();
    url.pathname = pathsConfig.app.workspaceDashboard.replace(
      "[workspace]",
      allWorkspaces[0].name
    );
    return NextResponse.redirect(url, 302);
  }

  if (!found && (!allWorkspaces || allWorkspaces.length === 0)) {
    const url = request.nextUrl.clone();
    url.pathname = pathsConfig.app.onboarding;
    return NextResponse.redirect(url, 302);
  }
}
