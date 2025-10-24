import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, UIMessage } from "ai";

interface OpenRouterServiceConfig {
    apiKey?: string;
    apiUrl?: string;
}

interface OptionParameter {
  option: Parameters<typeof streamText>[0];
  messages: UIMessage[];
}

class OpenRouterService {
    private apiurl = process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1";
    private apiKey = process.env.OPENROUTER_API_KEY;

    constructor(config?: OpenRouterServiceConfig) {
        this.apiurl = config?.apiUrl || this.apiurl;
        this.apiKey = config?.apiKey || this.apiKey;

        if (!this.apiKey) {
            throw new Error("API key must be provided");
        }
    }

    private createOpenRouterProvider() {
        const client = createOpenRouter({
            apiKey: this.apiKey!,
            baseURL: this.apiurl,
        });
        return client;
    }

    public async generateText({paramater}: {paramater: OptionParameter}) {
        const openrouter = this.createOpenRouterProvider();
        const result = streamText({
            model: openrouter.chat(paramater.option.model as string),
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
                }
            ],
            providerOptions: {
                openrouter: {
                    reasoning: {
                        max_tokens: 500,
                    }
                }
            }
        })
        return result;
    }
}


const useOpenRouterService = (config?: OpenRouterServiceConfig) => {
    return new OpenRouterService(config);
}

export { OpenRouterService, useOpenRouterService };

