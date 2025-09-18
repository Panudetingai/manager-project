import { default as auth_callback } from "@/modules/auth/server/route"
import { treaty } from "@elysiajs/eden"
import { Elysia } from "elysia"

const app = new Elysia({ prefix: "/api" })
  .get("/welcome", () => "Hello World")
  .use(auth_callback)

export const GET = (req: Request) => app.handle(req)
export const POST = (req: Request) => app.handle(req)
export const PUT = (req: Request) => app.handle(req)
export const DELETE = (req: Request) => app.handle(req)

export type API = ReturnType<typeof treaty>

