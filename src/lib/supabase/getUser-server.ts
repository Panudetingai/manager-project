'use server-only'

import { createClient } from "../../../utils/supabase/server";

export async function getUserServer() {
    const supabase = await createClient();
    const {data, error} = await supabase.auth.getUser();
    return data.user;
}

export async function getUserRoleServer() {
    const supabase = await createClient();
    const user = await getUserServer();
    const {data, error} = await supabase.from('account').select('role').eq('id', user?.id || "").single();
    return data?.role;
}