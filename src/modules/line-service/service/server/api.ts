import { LineWebhook } from "@/lib/line/line.webhook";
import Elysia from "elysia";
import { NextResponse } from "next/server";
import { webhookEvent } from "../../types/type";

export const webhook_line = new Elysia().post(
  "/line/webhook",
  async ({ request }) => {
    try {
      const body = await request.text();
      const signature = request.headers.get("x-line-signature");

      if (!signature) {
        return NextResponse.json(
          { message: "Missing signature" },
          { status: 400 }
        );
      }

      if (!LineWebhook.verifySignature(body, signature)) {
        return NextResponse.json(
          { message: "Invalid signature" },
          { status: 401 }
        );
      }

      const events = JSON.parse(body).events;

      console.log("Line webhook Event:", events);
      
      await Promise.all(
        events.map(async (event: webhookEvent["events"][0]) => {
          await LineWebhook.handleEvent(event);
        })
      );

      return NextResponse.json({ message: "OK" });
    } catch (error) {
      console.error("Error in LINE webhook:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);
