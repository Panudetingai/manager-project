import { createClient } from "@supabase/supabase-js";

const supabase_url =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabase_url) {
  throw new Error("Missing SUPABASE_URL. Check your .env file.");
}

if (!service_role_key) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY. Note: This key cannot be used on the client-side."
  );
}

const supabase = createClient(supabase_url, service_role_key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const adminAuthClient = supabase.auth.admin;
