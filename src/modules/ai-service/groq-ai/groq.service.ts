import { GroqModelId, OptionParameter } from "@/modules/feature/types/ai-service/ai-service-type";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { createConversation } from "../server/api";

interface GroqConfig {
  apiurl?: string;
  apikey: string;
}
class GroqService {
  private apiurl = "https://api.groq.com/openai/v1" as string;
  private apikey = process.env.GROQ_API_KEY as string;

  constructor(config?: GroqConfig) {
    if (config?.apikey && config.apiurl) {
      this.apikey = config.apikey;
      this.apiurl = config.apiurl;
    }

    if (!this.apikey) {
      throw new Error("not fount API GROQ !!!!");
    }
  }

  private createGrop() {
    const client = createGroq({
      apiKey: this.apikey,
      baseURL: this.apiurl,
    });

    return client;
  }

  public async generateText({ paramater }: { paramater: OptionParameter }) {
    const client = this.createGrop();
    const result = streamText({
      model: client(paramater.option.model as GroqModelId),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",

          content: [
            {
              type: "text",
              text: paramater.messages
                .filter((msg) => msg.role === "user")
                .map(
                  (msg) => msg.parts.find((part) => part.type === "text")?.text
                )
                .filter((text): text is string => text !== undefined)
                .join("\n"),
            },
            ...paramater.messages
              .filter((msg) => msg.role === "user")
              .flatMap((msg) =>
                msg.parts
                  .filter((part) => part.type === "file")
                  .map((part) => ({
                    type: "image" as const,
                    image: part.url,
                  }))
              ),
          ],
        },
      ],
    });

    console.log(JSON.stringify(paramater, null, 2))

    await createConversation({
      payload: {
        id: paramater.generateId,
        message_id: paramater.message_id,
        messages: JSON.parse(
          JSON.stringify([
            ...paramater.messages,
            (await result.response).messages,
          ])
        ),
        title:
          paramater.messages[0]?.parts[0]?.type === "text"
            ? paramater.messages[0]?.parts[0]?.text.slice(0, 20)
            : "New Conversation",
        user_id: paramater.userid,
        vector: null,
      },
    });

    return result;
  }
}

const useGroqService = (config: GroqConfig) => {
  return new GroqService(config);
};

export { GroqService, useGroqService };

