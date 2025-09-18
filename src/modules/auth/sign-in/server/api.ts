'use server'
import { createClient } from "../../../../../utils/supabase/server";

interface SigninProps {
  email: string;
  password: string;
}

export async function Signin({ email, password }: SigninProps){
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}