import { GroqService } from "@/modules/ai-service/groq-ai/groq.service";
import { SystemPromptsLine } from "@/modules/ai-service/prompts";
import { GroqModelId } from "@/modules/feature/types/ai-service/ai-service-type";
import { LineService } from "@/modules/line-service/line.service";
import { createfollowWebhook } from "@/modules/line-service/service/action/line";

import { FollowEvent, webhookEvent } from "@/modules/line-service/types/type";
import { generateText } from "ai";
import crypto from "crypto";

export class LineWebhook {
  private static channelSecret = process.env.LINE_BASIC_SETTINGS!;

  public static verifySignature(body: string, signature: string): boolean {
    const hash = crypto
      .createHmac("sha256", this.channelSecret)
      .update(body)
      .digest("base64");
    return hash === signature;
  }

  public static async handleEvent(event: webhookEvent["events"][0]) {
    console.log("Received event:", event);
    try {
      switch (event.type) {
        case "message":
          if (event.message?.type === "text") {
            await this.handleTextMessage(event);
          } else if (event.message?.type === "sticker") {
            await this.handleTextMessage(event);
          } else if (event.message?.type === "follow") {
            await this.handleFollow(event);
          }
          break;
      }
    } catch (error) {
      console.error("Error handling event:", error);
    }
  }

  private static async handleTextMessage(event: webhookEvent["events"][0]) {
    const userId = event.source.userId;
    const text = event.message?.text;
    const replyToken = event.replyToken;

    const groqService = new GroqService();
    const groq = groqService.createGrop();

    console.log(`User ${userId} sent: ${text}`);

    if (!replyToken || !text) {
      console.error("Missing replyToken or text in the event");
      return;
    }

    // AI integration can be added here
    const aiResponse = await generateText({
      model: groq("qwen/qwen3-32b" as GroqModelId),
      system: SystemPromptsLine.PromptDefault,
      prompt: text,
      providerOptions: {
        groq: {
          reasoningFormat: "hidden",
          reasoningEffort: "none",
        },
      },
      maxOutputTokens: 500,
    });

    // Example: Echo back
    await LineService.replyMessage(replyToken, [
      {
        type: "text",
        text: `${aiResponse.text}`,
      },
    ]);
  }

  private static async handleFollow(event: webhookEvent["events"][0]) {
    await createfollowWebhook(event as FollowEvent);
  }
}
