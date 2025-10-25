import { FirecrawlModelId } from "@/modules/feature/types/ai-service/ai-service-type";
import { createFireworks } from "@ai-sdk/fireworks";
import { streamText, UIMessage } from "ai";
interface FirecrawlAIConfig {
  apiKey?: string;
  apiUrl?: string;
}

interface OptionParameter {
  option: Parameters<typeof streamText>[0];
  messages: UIMessage[];
}

class FirecrawlAIService {
  private apiurl = "https://api.firecrawl.ai/v1" as string;
  private apikey = process.env.FIRECRAWL_API_KEY as string;

  constructor(config?: FirecrawlAIConfig) {
    if (config?.apiKey && config.apiUrl) {
      this.apikey = config.apiKey;
      this.apiurl = config.apiUrl;
    }
  }

  private createFirecrawlProvider() {
    const client = createFireworks({
      apiKey: this.apikey,
      baseURL: this.apiurl,
    });
    return client;
  }

  public generateText({ paramater }: { paramater: OptionParameter }) {
    const firecrawl = this.createFirecrawlProvider();
    const result = streamText({
      model: firecrawl(paramater.option.model as FirecrawlModelId),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
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
    });
    return result;
  }
}

const useFirecrawlAIService = (config: FirecrawlAIConfig) => {
  return new FirecrawlAIService(config);
}
export { FirecrawlAIService, useFirecrawlAIService };

