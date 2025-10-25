import { GroqModelId } from "@/modules/feature/types/ai-service/ai-service-type";
import { createGroq } from "@ai-sdk/groq";
import { streamText, UIMessage } from "ai";

interface GroqConfig {
  apiurl?: string;
  apikey: string;
}

interface OptionParameter {
  option: Parameters<typeof streamText>[0];
  messages: UIMessage[];
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

  public generateText({paramater}: {paramater: OptionParameter}) {
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

const useGroqService = (config: GroqConfig) => {
    return new GroqService(config)
}

export { GroqService, useGroqService };

