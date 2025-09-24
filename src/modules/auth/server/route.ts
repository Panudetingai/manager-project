import Elysia from "elysia";
import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

const auth_callback = new Elysia().get(
  "/auth/callback",
  async ({ request }) => {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    let next = searchParams.get("next") ?? "/";
    if (!next.startsWith("/")) {
      next = "/";
    }
    if (code) {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if(!data.session) return NextResponse.redirect(`${origin}/auth/auth-code-error`);

      const {error: accountError} = await supabase.from("account").upsert([{
        id: data.session.user.id,
        email: data.session.user.email,
        username: data.session.user.user_metadata.full_name,
        avatar_url: data.session.user.user_metadata.avatar_url,
        updated_at: new Date().toISOString()
      }]);

      if (accountError) throw new Error(accountError.message);

      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      }
    }
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
);

export default auth_callback;
