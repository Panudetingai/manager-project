import { getUserServer } from "@/lib/supabase/getUser-server";
import { NextRequest, NextResponse } from "next/server";
import pathsConfig from "../../../../config/app.router";
import { createClient } from "../../../../utils/supabase/server";

export async function workspaceRedirect(request: NextRequest) {
  const supabase = await createClient();
  const pathParts = request.nextUrl.pathname.split("/");
  const params = pathParts.length > 2 ? { project: pathParts[2] } : {};
  const user = await getUserServer();

  const { data: workspaces } = await supabase
    .from("workspace")
    .select("name")
    .eq("user_id", user.id);

  const found = workspaces?.find((w) => w.name === params.project);

  if (
    found &&
    request.nextUrl.pathname.startsWith(pathsConfig.app.workspaceDashboard.replace('[workspace]', params.project!))
  ) {
    return;
  }

  if (!found && workspaces && workspaces.length > 0) {
    const url = request.nextUrl.clone();
    url.pathname = pathsConfig.app.workspaceDashboard.replace('[workspace]', workspaces[0].name);
    return NextResponse.redirect(url, 302);
  }

  if (!found && (!workspaces || workspaces.length === 0)) {
    const url = request.nextUrl.clone();
    url.pathname = pathsConfig.app.onboarding;
    return NextResponse.redirect(url, 302);
  }
}
