"use server-only";

import { createClient } from "../../../utils/supabase/server";

export async function  getUserServer() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  return data.user;
}

export async function getUserRoleServer() {
  const supabase = await createClient();
  const user = await getUserServer();
  if (!user) return null;
  const { data } = await supabase
    .from("account")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!data) return "guest";
  return data.role;
}
