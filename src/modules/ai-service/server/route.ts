import { getUserServer } from "@/lib/supabase/getUser-server";
import { errorHandler } from "@/modules/feature/func/error-handler";
import { PayloadConversation } from "@/modules/feature/types/ai-service/api-types";
import { StreamTextResult, ToolSet } from "ai";
import Elysia from "elysia";
import { useAIService, type AIServiceTypeOption } from "../ai.service";
import { createConversation } from "./api";

type GenerateChatTypes = "chat" | "think" | "search";

export const maxDuration = 30;

const AIServiceAPI = new Elysia()
  .post("/chat", async (req) => {
    const { typeai, options, messages, generatetype, id } =
      req.body as AIServiceTypeOption;

    const response = useAIService({
      id: id,
      typeai: typeai,
      options: options,
      generatetype: generatetype,
      messages,
    });

    if (!response) throw new Error("AI Service not found");

    switch (generatetype as GenerateChatTypes) {
      case "chat":
        const result = (await response.generateText({
          paramater: {
            id: id,
            message_id: id,
            option: options,
            messages,
          },
        })) as StreamTextResult<ToolSet, never>;
        return result.toUIMessageStreamResponse({
          sendReasoning: true,
          onError: errorHandler,
          messageMetadata: ({ part }) => {
            if (part.type === "finish") {
              return {
                model: part.finishReason,
                totalTokens: part.totalUsage.totalTokens,
                
              };
            }
            if (part.type === "tool-result") {
              return {
                toolName: part.toolName,
                toolCallId: part.toolCallId,
              };
            }
          },
        });
      case "think":
        // Implement think logic here
        throw new Error("Think generation type not implemented yet");
      case "search":
        // Implement search logic here
        throw new Error("Search generation type not implemented yet");
      default:
        throw new Error("Unsupported generation type");
    }
  })
  .post("/create/conversation", async (req) => {
    const { payload, generateId } = req.body as PayloadConversation;
    const user = await getUserServer();

    if (!user) throw new Error("User not authenticated");

    const result = await createConversation({
      payload: {
        id: generateId,
        message_id: payload.message.id,
        messages: JSON.parse(JSON.stringify(payload.messages)),
        title:
          payload.messages[0]?.parts[0]?.type === "text"
            ? payload.messages[0]?.parts[0]?.text.slice(0, 20)
            : "New Conversation",
        user_id: user.id as string,
        vector: null,
      },
    });
    return result;
  });

export default AIServiceAPI;
