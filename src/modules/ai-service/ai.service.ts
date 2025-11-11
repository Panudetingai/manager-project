import { streamText, UIMessage } from "ai";
import { ModelsType } from "../feature/types/ai-service/ai-service-type";
import { ClauneAIService } from "./claune-ai/claune.service";
import { GeminiService } from "./gemini-ai/gemini.service";
import { GroqService } from "./groq-ai/groq.service";
import { OpenRouterService } from "./openroute-ai/openrouter.service";

type AIServiceTypeParameters = Parameters<typeof streamText>[0];

export type AIServiceTypeOption = {
  id: string;
  typeai: ModelsType["type"];
  generatetype: "chat" | "think" | "search";
  options: AIServiceTypeParameters;
  messages: UIMessage[];
};

type AIServiceReturen = ClauneAIService | GeminiService | OpenRouterService | GroqService;

class AIService {
  private typeai: ModelsType["type"];
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
      case "gemini":
        const gemini = new GeminiService();
        return gemini;
      case "openrouter":
        const openrouter = new OpenRouterService();
        return openrouter;
      case "groq":
        const groq = new GroqService();
        return groq;
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

