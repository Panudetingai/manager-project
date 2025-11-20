import { GoogleModelId } from "@/modules/feature/types/ai-service/ai-service-type";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, UIMessage } from "ai";
import { SystemPrompts } from "../prompts";
import { CreatePostAgent } from "../tools/create-post-agent";

interface GeminiConfig {
  apiKey?: string;
  apiUrl?: string;
}

interface OptionParameter {
  option: Parameters<typeof streamText>[0];
  messages: UIMessage[];
}

class GeminiService {
  private static readonly DEFAULT_API_URL =
    "https://generativelanguage.googleapis.com/v1beta";
  private apiKey = process.env.GOOGLE_API_KEY;
  private apiUrl = GeminiService.DEFAULT_API_URL || undefined;

  constructor(config?: GeminiConfig) {
    this.apiUrl = config?.apiUrl || GeminiService.DEFAULT_API_URL;
    this.apiKey = config?.apiKey || this.apiKey;

    if (!this.apiKey) {
      throw new Error("API key must be provided");
    }
  }

  private createGeminiProvider() {
    const client = createGoogleGenerativeAI({
      apiKey: this.apiKey!,
      baseURL: this.apiUrl,
    });
    return client;
  }

  public generateText({ paramater }: { paramater: OptionParameter }) {
    const client = this.createGeminiProvider();
    const result = streamText({
      model: client.chat(paramater.option.model as GoogleModelId),
      messages: [
        {
          role: "system",
          content: SystemPrompts.PromptDefault,
        },
        {
          role: "user",
          content: paramater.messages
            .filter((msg) => msg.role === "user")
            .map((msg) => msg.parts.find((part) => part.type === "text")?.text)
            .filter((text): text is string => text !== undefined)
            .join("\n"),
        },
      ],
      toolChoice: "auto",
      tools: { CreatePostAgent },
    });
    return result;
  }
}

const useGeminiService = (config: GeminiConfig) => {
  return new GeminiService(config);
};

export { GeminiService, useGeminiService };

