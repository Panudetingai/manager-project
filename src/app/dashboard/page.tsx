// checked users onboarding status
// if not onboarded, redirect to onboarding page
// if onboarded, redirect to workspace page

import { redirect } from "next/navigation";
import pathsConfig from "../../../config/app.router";
import { createClient } from "../../../utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) redirect(pathsConfig.auth.signIn);
  if (!user) redirect(pathsConfig.auth.signIn);

  const { data: onboarded } = await supabase
    .from("onboarding")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (!onboarded || !onboarded.workspace) redirect("/onboarding");

  redirect(
    pathsConfig.app.workspaceDashboard.replace(
      "[workspace]",
      onboarded.workspace
    )
  );
}
