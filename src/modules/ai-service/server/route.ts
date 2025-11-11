import { StreamTextResult, ToolSet } from "ai";
import Elysia from "elysia";
import { useAIService, type AIServiceTypeOption } from "../ai.service";

type GenerateChatTypes = "chat" | "think" | "search";

export const maxDuration = 30;

const AIServiceAPI = new Elysia().post("/chat", async (req) => {
  const { typeai, options, messages, generatetype, generateId, id, userid } =
    req.body as AIServiceTypeOption;

  const response = useAIService({
    id: id,
    generateId: generateId,
    userid: userid,
    typeai: typeai,
    options: options,
    generatetype: generatetype,
    messages,
  });

  if (!response) throw new Error("AI Service not found");

  console.log("route Id", generateId);

  switch (generatetype as GenerateChatTypes) {
    case "chat":
      const result = (await response.generateText({
        paramater: {
          id: id,
          generateId: generateId,
          userid: userid,
          message_id: id,
          option: options,
          messages,
        },
      })) as StreamTextResult<ToolSet, never>;
      return result.toUIMessageStreamResponse({
        sendReasoning: true,
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
});

export default AIServiceAPI;
