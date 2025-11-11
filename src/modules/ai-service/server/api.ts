"use server";

import { Database } from "../../../../utils/supabase/database.types";
import { createClient } from "../../../../utils/supabase/server";

interface Conversation {
  payload: Pick<
    Database["public"]["Tables"]["conversations"]["Row"],
    "id" | "message_id" | "messages" | "title" | "user_id" | "vector"
  >;
}

export async function createConversation({ payload }: Conversation) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("conversations").upsert({
    ...payload,
  });

  if (error) throw error;

  return data;
}

export async function getConversationById(conversationId: string) {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (error) throw error;

  return data;

}
