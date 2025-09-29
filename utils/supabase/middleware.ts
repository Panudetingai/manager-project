import { workspaceRedirect } from "@/app/dashboard/[project]/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import pathsConfig from "../../config/app.router";
import { Database } from "./database.types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ถ้าไม่ได้ login และเข้า path ที่ต้อง login
  if (
    !user &&
    request.nextUrl.pathname !== pathsConfig.auth.signIn &&
    request.nextUrl.pathname !== pathsConfig.auth.signUp &&
    (request.nextUrl.pathname.startsWith(
      pathsConfig.app.workspaceDashboard.replace("[workspace]", "")
    ) ||
      request.nextUrl.pathname.startsWith(pathsConfig.app.onboarding))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathsConfig.auth.signIn;
    return NextResponse.redirect(url, 302);
  }

  // ถ้า login แล้วเข้า sign-in หรือ sign-up ให้ไป workspace
  if (
    user &&
    (request.nextUrl.pathname === pathsConfig.auth.signIn ||
      request.nextUrl.pathname === pathsConfig.auth.signUp)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathsConfig.app.workspaceDashboard.replace(
      "[workspace]",
      "workspace"
    );
    return NextResponse.redirect(url, 302);
  }

  // ตรวจสอบ onboarding เฉพาะเมื่อ login แล้ว
  let onboarded;
  if (user) {
    const { data } = await supabase
      .from("onboarding")
      .select("*")
      .eq("user_id", user.id)
      .single();
    onboarded = data;
  }

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = pathsConfig.auth.signIn;
    return NextResponse.redirect(url, 302);
  }

  // ตรวจสอบ workspace เฉพาะเมื่อ login แล้ว
  if (
    user &&
    onboarded &&
    onboarded.workspace &&
    request.nextUrl.pathname === pathsConfig.app.onboarding
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathsConfig.app.workspaceDashboard.replace(
      "[workspace]",
      onboarded.workspace // ใช้ workspace จริง
    );
    return NextResponse.redirect(url, 302);
  }

  // ถ้า login แล้ว ยังไม่ onboarded และไม่ได้อยู่หน้า onboarding ให้ไป onboarding
  if (
    user &&
    (!onboarded || !onboarded.workspace) &&
    !request.nextUrl.pathname.startsWith(pathsConfig.app.onboarding)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathsConfig.app.onboarding;
    return NextResponse.redirect(url, 302);
  }
  // ถ้า login แล้ว onboarded แล้ว และไม่ได้อยู่ workspace ให้ไป workspace

if (
  user &&
  onboarded &&
  onboarded.workspace &&
  request.nextUrl.pathname.startsWith(
    pathsConfig.app.workspaceDashboard.replace("[workspace]", "")
  )
) {
  const result = await workspaceRedirect(request);
  if (result) return result;
}

  // ไม่ต้อง redirect
  return supabaseResponse;
}
