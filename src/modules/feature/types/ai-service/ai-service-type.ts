import { createAnthropic } from "@ai-sdk/anthropic";
import { GoogleGenerativeAIProvider } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
type IdFromChat<F extends (...args: never[]) => unknown> = Extract<Parameters<F>[0], string>;

export type GoogleModelId = IdFromChat<GoogleGenerativeAIProvider["chat"]>;
export type AnthropicModelId = IdFromChat<ReturnType<typeof createAnthropic>["chat"]>;
export type OpenrouterModelId = IdFromChat<ReturnType<typeof createOpenRouter>["chat"]>;
export type ModelsType = {
  id: GoogleModelId | AnthropicModelId;
  name: string;
  type: "gemini" | "anthropic" | "openrouter";
};