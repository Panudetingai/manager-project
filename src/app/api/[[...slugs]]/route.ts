import { Elysia } from "elysia"

const app = new Elysia({ prefix: "/api" })
  .get("/welcome", () => "Hello World")

export const GET = (req: Request) => app.handle(req)
export const POST = (req: Request) => app.handle(req)
