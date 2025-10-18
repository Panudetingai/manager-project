import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, UIMessage } from "ai";

interface ClauneAIServiceConfig {
  apiKey?: string;
  apiUrl?: string;
}

interface OptionParamater {
  option: Parameters<typeof streamText>[0];
  messages: UIMessage[];
}

class ClauneAIService {
  private static readonly DEFAULT_API_URL = "https://api.anthropic.com/v1";
  private apiKey = process.env.ANTHROPIC_API_KEY;
  private apiUrl: string | undefined;

  constructor(config?: ClauneAIServiceConfig) {
    this.apiUrl = config?.apiUrl || ClauneAIService.DEFAULT_API_URL;
    this.apiKey = config?.apiKey || this.apiKey;

    if (!this.apiKey) {
      throw new Error("API key and API URL must be provided");
    }
  }
  public createAnthropicProvider() {
    const client = createAnthropic({
      apiKey: this.apiKey!,
      baseURL: this.apiUrl,
    });
    return client;
  }

  public generateText({ paramater }: { paramater: OptionParamater }) {
    const client = this.createAnthropicProvider();
    const result = streamText({
      model: client.chat(paramater.option.model as string),
      messages: [
        {
          role: "user",
          content: paramater.messages
            .filter((msg) => msg.role === "user")
            .map((msg) => msg.parts.find((part) => part.type === "text")?.text)
            .filter((text): text is string => text !== undefined)
            .join("\n"),
        },
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
      ],
    });

    return result.toUIMessageStreamResponse();
  }
}

const useClauneAIservice = (config: ClauneAIServiceConfig) => {
  return new ClauneAIService(config);
};

export { ClauneAIService, useClauneAIservice };

