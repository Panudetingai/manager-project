import { createAnthropic } from "@ai-sdk/anthropic";
import { GoogleGenerativeAIProvider } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
type IdFromChat<F extends (...args: never[]) => unknown> = Extract<Parameters<F>[0], string>;

export type GoogleModelId = IdFromChat<GoogleGenerativeAIProvider["chat"]>;
export type AnthropicModelId = IdFromChat<ReturnType<typeof createAnthropic>["chat"]>;
export type GroqModelId = IdFromChat<ReturnType<typeof createGroq>>;
export type OpenrouterModelId = IdFromChat<ReturnType<typeof createOpenRouter>["chat"]>;
export type ModelsType = {
  id: GoogleModelId | AnthropicModelId | GroqModelId;
  name: string;
  type: "gemini" | "anthropic" | "openrouter" | "groq";
  modelIcon?: string
};