import { getUserServer } from "@/lib/supabase/getUser-server";
import { NextRequest, NextResponse } from "next/server";
import pathsConfig from "../../../../config/app.router";
import { createClient } from "../../../../utils/supabase/server";

export async function workspaceRedirect(request: NextRequest) {
  const supabase = await createClient();
  const pathParts = request.nextUrl.pathname.split("/");
  const params = pathParts.length > 2 ? { project: pathParts[2] } : {};
  const user = await getUserServer();

  if (!user) return;

  // ดึง workspace ที่ user เป็นเจ้าของ
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

    const allWorkspaces = [
      ...(workspaces ?? []),
      ...(Array.isArray(memberWorkspaces)
        ? memberWorkspaces.map((m) => m.workspace).filter(Boolean)
        : []),
    ];

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
