'use server-only'

import { createClient } from "../../../utils/supabase/server";

export async function getUserServer() {
    const supabase = await createClient();
    const {data, error} = await supabase.auth.getUser();
    if (error) {
        throw new Error(error.message);
    }
    return data.user;
}