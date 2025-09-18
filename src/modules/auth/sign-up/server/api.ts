'use server'
import { createClient } from "../../../../../utils/supabase/server";
import { createAuthService } from "../../server/auth.service";

interface SignUpRequest {
    email: string;
    password: string;
}

export async function SignUp({ email, password }: SignUpRequest) {
    const supabase = await createClient();
    const authService = createAuthService(supabase);
    const result = await authService.EmailSignIn({
        email,
        password
    });

    if (!result?.user || !result.user.id || !result.user.email) {
        throw new Error("Sign up succeeded but no user information was returned");
    }

    const username = result.user.email.split("@")[0];
    await supabase.from("account").insert({
        id: result.user.id,
        username,
        email: result.user.email,
        role: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    return result;
}