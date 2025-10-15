import { getUserServer } from "@/lib/supabase/getUser-server";
import redis from "@/lib/upstash";
import Elysia from "elysia";
import { Database } from "../../../../../utils/supabase/database.types";
import { createClient } from "../../../../../utils/supabase/server";

type workspacesType = Pick<
  Database["public"]["Tables"]["workspace"]["Row"],
  "name" | "workspace_icon" | "id"
>;

const workspace = new Elysia().get("/workspaces", async () => {
  const supabase = await createClient();
  const user = await getUserServer();
  if (!user) return [];
  
  const cacheKey = `workspaces:${user.id}`;
  const cached = await redis.get(cacheKey) as string | null;
  if (cached) return cached as unknown as workspacesType[];

  const { data: workspaces, error } = await supabase
    .from("workspace")
    .select("name, workspace_icon, id")
    .eq("user_id", user.id);

  if (error) throw new Error("Fetch workspaces failed");

  if (workspaces && workspaces.length > 0) {
    await redis.set(cacheKey, JSON.stringify(workspaces), { ex: 60 * 60 });
  }
  return workspaces;
});

export default workspace;
