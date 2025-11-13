"use server";

import { getUserServer } from "@/lib/supabase/getUser-server";
import { createClient } from "../../../../../utils/supabase/server";
import {
    ENVDB_LINE_SERVICE,
    LINE_SERVICE_CONFIG_PAYLOAD,
    LINE_SERVICE_GET_ENV_PAYLOAD,
} from "../../types/type";

export async function createLineServiceEnvDB(
  payload: LINE_SERVICE_CONFIG_PAYLOAD
) {
  const supabase = await createClient();
  const user = await getUserServer();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase.from("social_key_config").upsert({
    id: payload.id || undefined,
    env: payload.env,
    category: payload.category,
    user_id: user.id,
    workspace_id: payload.workspaceId,
    created_at: new Date().toISOString(),
    updated: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getLineServiceEnvDB(
  payload: LINE_SERVICE_GET_ENV_PAYLOAD
) {
  const supabase = await createClient();
  const user = await getUserServer();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("social_key_config")
    .select("id, env, category")
    .eq("workspace_id", payload.workspaceId)
    .eq("category", payload.category)
    .single();

  if (error) throw new Error(error.message);

  if (!data) return null;

  return data as {
    id: string;
    env: {data: ENVDB_LINE_SERVICE["data"]};
    category: LINE_SERVICE_CONFIG_PAYLOAD["category"];
  };
}
