'use server'
import { type SignInWithOAuthCredentials } from "@supabase/auth-js";
import { createClient } from "../../../../utils/supabase/server";
import { createAuthService } from "./auth.service";

interface APIAuthServiceProps {
    email?: string;
    password?: string;
    provider: SignInWithOAuthCredentials['provider'] | 'email';
}

export async function APIAuthService({ email, password, provider }: APIAuthServiceProps) {
    const supabase = await createClient();
    const authService = createAuthService(supabase);
    switch (provider) {
        case 'google':
            return await authService.GoogleSignIn();
        case 'email':
            if (!email || !password) throw new Error("Email and password are required for email sign-in");
            return await authService.EmailSignIn({ email, password });           
    }
}