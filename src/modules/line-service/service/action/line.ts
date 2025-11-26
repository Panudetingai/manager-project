"use server";

import { getUserServer } from "@/lib/supabase/getUser-server";
import { createClient } from "../../../../../utils/supabase/server";
import {
  ENVDB_LINE_SERVICE,
  FollowEvent,
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
    env: { data: ENVDB_LINE_SERVICE["data"] };
    category: LINE_SERVICE_CONFIG_PAYLOAD["category"];
  };
}

// follow webhook insert data for webhook Line
export async function createfollowWebhook(event: FollowEvent) {
  try {
    const supabase = await createClient();
    const user = await getUserServer();

    if (!user) throw Error("Not Authorization");
    if (!user.user_metadata.workspaces.workspace_id)
      throw new Error("Not Workspace Id");

    const { error } = await supabase.from("line_follow_event").insert({
      isUnblocked: event.follow.isUnblocked,
      webhookEventId: event.webhookEventId,
      isRedelivery: event.deliveryContext.isRedelivery,
      timestamp: new Date(event.timestamp).toISOString(),
      type: event.source.type,
      userId: event.source.userId,
      replyToken: event.replyToken,
      mode: event.mode,
      user_owner_id: user.id,
      workspace_owner_id: user.user_metadata.workspaces.workspace_id,
    });

    if (error) throw new Error("Insert follow data Fail");
  } catch (error) {
    console.error("Error creating follow webhook:", error);
  }
}
