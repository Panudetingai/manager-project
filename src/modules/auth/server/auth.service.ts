import { type SignInWithOAuthCredentials } from "@supabase/auth-js";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { Database } from "../../../../utils/supabase/database.types";

class AuthService {
    private static supabase: ReturnType<typeof createServerClient<Database>>;
    public static provider: SignInWithOAuthCredentials['provider'] = 'google';

    constructor(supabaseClient: ReturnType<typeof createServerClient<Database>>) {
        AuthService.supabase = supabaseClient;
    }

    /**
     * 
     * @param email user email address
     * @param password user password
     * @returns user data or throws an error if sign in fails
     */
    public async EmailSignIn({email, password}: {email: string, password: string}) {
        const { data, error } = await AuthService.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    }

    /**
     * 
     * @param email user email address
     * @param password user password
     * @returns user data or throws an error if sign up fails
     */
    public async EmailSignUp({email, password}: {email: string, password: string}) {
        const { data, error } = await AuthService.supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        return data;
    }

    /**
     * Initiates the Google OAuth sign-in flow.
     * Redirects the user to Google's authentication page.
     * @returns OAuth data or throws an error if sign-in fails
     */
    public async GoogleSignIn() {
        const { data, error } = await AuthService.supabase.auth.signInWithOAuth({
            provider: AuthService.provider,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
                scopes: 'email'
            }
        });

        if (error) throw error;
        redirect(data.url);
    }
}

export const createAuthService = (supabaseClient: ReturnType<typeof createServerClient<Database>>) => {
    return new AuthService(supabaseClient);
}