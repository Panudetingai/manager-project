import { createAnthropic } from "@ai-sdk/anthropic";
import { createFireworks } from "@ai-sdk/fireworks";
import { GoogleGenerativeAIProvider } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, UIMessage } from "ai";
type IdFromChat<F extends (...args: never[]) => unknown> = Extract<Parameters<F>[0], string>;

export type GoogleModelId = IdFromChat<GoogleGenerativeAIProvider["chat"]>;
export type AnthropicModelId = IdFromChat<ReturnType<typeof createAnthropic>["chat"]>;
export type GroqModelId = IdFromChat<ReturnType<typeof createGroq>>;
export type FirecrawlModelId = IdFromChat<ReturnType<typeof createFireworks>>;
export type OpenrouterModelId = IdFromChat<ReturnType<typeof createOpenRouter>["chat"]>;
export type ModelsType = {
  id: GoogleModelId | AnthropicModelId | GroqModelId | FirecrawlModelId;
  name: string;
  chef: string;
  chefSlug: string;
  providers: ("openai" | "anthropic" | "gemini" | "groq" | "firecrawl" | "openrouter")[];
  modelIcon?: string
};

export interface OptionParameter {
  id: string;
  message_id: string;
  option: Parameters<typeof streamText>[0];
  messages: UIMessage[];
}

export interface AIToolsPostsOutput {
  images: string[];
  title: string;
  content: string;
  category: string;
  tags: string[];
  provider: string;
}