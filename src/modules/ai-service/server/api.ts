"use server";
import redis from "@/lib/upstash";
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
  const { data, error } = await supabase
    .from("conversations")
    .upsert({
      ...payload,
    })
    .select();

  if (error) return error;

  await redis.set(`conversation:${payload.id}`, JSON.stringify(data), {
    ex: 60 * 60,
  });

  return data;
}

export async function getConversationById(
  conversationId: string
): Promise<Database["public"]["Tables"]["conversations"]["Row"] | undefined> {
  const supabase = await createClient();

  // Check cache first Redis
  const cached = await redis.get<
    Database["public"]["Tables"]["conversations"]["Row"]
  >(`conversation:${conversationId}`);
  if (cached) {
    const parse = typeof cached === "string" ? JSON.parse(cached) : cached;
    return Array.isArray(parse) ? parse[0] : parse;
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (error) throw error;

  return data;
}
