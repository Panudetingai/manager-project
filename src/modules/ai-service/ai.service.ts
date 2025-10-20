import { streamText, UIMessage } from "ai";
import { ClauneAIService } from "./claune-ai/claune.service";
import { GeminiService } from "./gemini-ai/gemini.service";

type AIServiceTypeParameters = Parameters<typeof streamText>[0];

export type AIServiceTypeOption = {
  typeai: "openai" | "anthropic" | "gemini";
  generatetype: "chat" | "think" | "search";
  options: AIServiceTypeParameters;
  messages: UIMessage[];
};

type AIServiceReturen = ClauneAIService | GeminiService | undefined;

class AIService {
  private typeai: "openai" | "anthropic" | "gemini";
  private options: AIServiceTypeParameters;

  constructor(options: AIServiceTypeOption) {
    this.typeai = options.typeai;
    this.options = options.options;
  }

  public SwitchAIService() {
    switch (this.typeai) {
      case "anthropic":
        const anthropic = new ClauneAIService();
        return anthropic;
      case "openai":
        // Implement OpenAI service logic here
        return;
      case "gemini":
        const gemini = new GeminiService();
        return gemini;
      default:
        throw new Error("Unsupported AI service type");
    }
  }
}

const useAIService = (options: AIServiceTypeOption): AIServiceReturen => {
  const aiService = new AIService(options);
  return aiService.SwitchAIService();
};
export { AIService, useAIService };

