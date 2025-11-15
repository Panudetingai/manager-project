import {
  GroqModelId,
  OptionParameter,
} from "@/modules/feature/types/ai-service/ai-service-type";
import { createGroq, groq } from "@ai-sdk/groq";
import { streamText, Tool } from "ai";
import { SystemPrompts } from "../prompts";
import { CreatePostAgent } from "../tools/create-post-agent";

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
          content: SystemPrompts.PromptDefault,
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
      tools: paramater.id.includes("openai/gpt-oss-120b")
        ? {
            browser_search: groq.tools.browserSearch({}) as Tool<unknown, unknown>,
            CreatePostAgent,
          }
        : {
            CreatePostAgent,
          },
      toolChoice: "auto",
      providerOptions: {
        groq: {
          structuredOutputs: false,
        },
      },
    });
    return result;
  }
}

const useGroqService = (config: GroqConfig) => {
  return new GroqService(config);
};

export { GroqService, useGroqService };

