import webhook from "@/lib/stripe/api";
import { default as auth_callback } from "@/modules/auth/server/route";
import workspace from "@/modules/manager/server/routes/workspace";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: ["http://e.ly", process.env.NEXT_PUBLIC_APP_URL!, "http://localhost:3000"],
    })
  )
  .get("/welcome", () => "Hello World")
  .use(auth_callback)
  .use(workspace)
  .use(webhook)

export const GET = (req: Request) => app.handle(req);
export const POST = (req: Request) => app.handle(req);
export const PUT = (req: Request) => app.handle(req);
export const DELETE = (req: Request) => app.handle(req);

export type API = typeof app;
