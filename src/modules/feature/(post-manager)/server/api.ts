"use server";
import { getUserServer } from "@/lib/supabase/getUser-server";
import { createClient } from "../../../../../utils/supabase/server";
import { AIToolsPostsOutput } from "../../types/ai-service/ai-service-type";

interface PostManagerFeatureApiRequest extends AIToolsPostsOutput {
  workspaceId: string;
}

export async function createPostManagerFeatureApi(
  payload: PostManagerFeatureApiRequest
) {
  try {
    const supabase = await createClient();
    const user = await getUserServer();

    if (!user) {
      throw new Error("User not authenticated");
    }
    console.log(JSON.stringify(payload, null, 2));
    const { error } = await supabase.from("posts").insert({
      title: payload.title,
      content: payload.content,
      category: JSON.stringify(payload.category),
      images: JSON.stringify(payload.images),
      provider: payload.provider,
      user_owner_id: user.id,
      workspace_owner_id: payload.workspaceId,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

export async function getPostManagerFeatureApi(workspaceId: string) {
  try {
    const supabase = await createClient();
    const user = await getUserServer();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("workspace_owner_id", workspaceId)
      .eq("user_owner_id", user.id)

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}
