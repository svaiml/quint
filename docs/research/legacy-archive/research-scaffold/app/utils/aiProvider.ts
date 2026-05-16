import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";

export type AIProvider = "openai" | "openrouter";

interface GetAIModelOptions {
  useOptionsModel?: boolean;
  model?: string | null; // Selected model (for OpenRouter)
}

export function getAIModel(provider: AIProvider, options: GetAIModelOptions = {}): LanguageModel {
  const { useOptionsModel = false, model = null } = options;
  console.log(`[getAIModel] Provider: ${provider}, model: ${model}, useOptionsModel: ${useOptionsModel}`);
  
  if (provider === "openrouter") {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log(`[getAIModel] OpenRouter API key present: ${!!apiKey}`);
    
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }
    
    const openrouter = createOpenRouter({
      apiKey: apiKey,
    });
    
    // Use selected model, env var, or default
    const modelName = model || process.env.OPENROUTER_MODEL || "x-ai/grok-code-fast-1";
    console.log(`[getAIModel] Using OpenRouter model: ${modelName}`);
    return openrouter(modelName) as unknown as LanguageModel;
  }

  // Default: OpenAI
  const apiKey = process.env.OPENAI_API_KEY;
  console.log(`[getAIModel] OpenAI API key present: ${!!apiKey}`);
  
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  const openai = createOpenAI({
    apiKey: apiKey,
  });
  // For options generation, prefer OPENAI_OPTIONS_MODEL if set
  const modelName = useOptionsModel
    ? (process.env.OPENAI_OPTIONS_MODEL || process.env.OPENAI_MODEL || "gpt-4o")
    : (process.env.OPENAI_MODEL || "gpt-4o");
  console.log(`[getAIModel] Using OpenAI model: ${modelName}`);
  return openai(modelName);
}
