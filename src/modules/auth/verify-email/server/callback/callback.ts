'use server';
import { createClient } from "../../../../../../utils/supabase/server";

export async function CallBackSignUpWithEmail(code: string) {
    try {
        const supabase = await createClient();
        if (code) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(
                code
            );
            if (error) throw error;
            if (!data.session) throw new Error("No session data");
            const { error: accountError } = await supabase.from("account").upsert([
                {
                    id: data.session.user.id,
                    email: data.session.user.email,
                    username: data.session.user.user_metadata.full_name || data.user.email?.replace('@', ''),
                    avatar_url: data.session.user.user_metadata.avatar_url,
                    updated_at: new Date().toISOString(),
                },
            ]);
            if (accountError) throw new Error(accountError.message);
            return data;
        }
    } catch (error) {
        console.error("Error in CallBackSignUpWithEmail:", error);
        throw new Error("Failed to process email verification");
    }
}