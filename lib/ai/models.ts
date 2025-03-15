interface ChatModel {
  id: string;
  name: string;
  description: string;
  provider:
    | "openai"
    | "anthropic"
    | "google"
    | "mistral"
    | "fireworks"
    | "azure-openai"
    | "amazon-bedrock"
    | "google-vertex"
    | "xai"
    | "together"
    | "cohere"
    | "deepinfra"
    | "deepseek"
    | "cerebras"
    | "groq"
    | "replicate"
    | "perplexity"
    | "luma"
    | "fal";
  creditsPerMessage: number;
  isPaid: boolean;
  modelId: string;
}

// This should eventually move to a database
export const chatModels: Array<ChatModel> = [
  // Free models
  {
    id: "openai-gpt-35-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and cost-effective for everyday tasks",
    provider: "openai",
    modelId: "gpt-3.5-turbo",
    creditsPerMessage: 0,
    isPaid: false,
  },
  {
    id: "openai-gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Balanced performance at a lower cost than GPT-4o",
    provider: "openai",
    modelId: "gpt-4o-mini",
    creditsPerMessage: 0,
    isPaid: false,
  },
  {
    id: "google-gemini-15-flash-8b",
    name: "Gemini 1.5 Flash 8B",
    description: "Fast, efficient Google model for high-volume tasks",
    provider: "google",
    modelId: "gemini-1.5-flash-8b",
    creditsPerMessage: 0,
    isPaid: false,
  },

  // OpenAI - Paid models
  {
    id: "openai-gpt-4o",
    name: "GPT-4o",
    description: "OpenAI's versatile multimodal model",
    provider: "openai",
    modelId: "gpt-4o",
    creditsPerMessage: 1,
    isPaid: true,
  },
  {
    id: "openai-gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "Advanced capabilities with faster response time",
    provider: "openai",
    modelId: "gpt-4-turbo",
    creditsPerMessage: 2,
    isPaid: true,
  },

  // Anthropic models
  {
    id: "anthropic-claude-3-opus",
    name: "Claude 3 Opus",
    description: "Anthropic's most capable model for complex tasks",
    provider: "anthropic",
    modelId: "claude-3-opus-20240229",
    creditsPerMessage: 5,
    isPaid: true,
  },
  {
    id: "anthropic-claude-3-sonnet",
    name: "Claude 3 Sonnet",
    description: "Good balance of intelligence and speed",
    provider: "anthropic",
    modelId: "claude-3-sonnet-20240229",
    creditsPerMessage: 2,
    isPaid: true,
  },
  {
    id: "anthropic-claude-3-haiku",
    name: "Claude 3 Haiku",
    description: "Fast responses for everyday tasks",
    provider: "anthropic",
    modelId: "claude-3-haiku-20240307",
    creditsPerMessage: 1,
    isPaid: true,
  },

  // Google models
  {
    id: "google-gemini-20-flash",
    name: "Gemini 2.0 Flash",
    description: "Google's newest multimodal model with next-gen features",
    provider: "google",
    modelId: "gemini-2.0-flash",
    creditsPerMessage: 3,
    isPaid: true,
  },
  {
    id: "google-gemini-20-flash-lite",
    name: "Gemini 2.0 Flash-Lite",
    description: "Cost-efficient version optimized for low latency",
    provider: "google",
    modelId: "gemini-2.0-flash-lite",
    creditsPerMessage: 2,
    isPaid: true,
  },
  {
    id: "google-gemini-15-flash",
    name: "Gemini 1.5 Flash",
    description: "Balanced multimodal model for most tasks",
    provider: "google",
    modelId: "gemini-1.5-flash",
    creditsPerMessage: 1,
    isPaid: true,
  },
  {
    id: "google-gemini-15-pro",
    name: "Gemini 1.5 Pro",
    description: "Complex reasoning with 1M context window",
    provider: "google",
    modelId: "gemini-1.5-pro",
    creditsPerMessage: 2,
    isPaid: true,
  },
];

export const REASONING_MODELS: Array<(typeof chatModels)[number]["id"]> = [
  "anthropic-claude-3-opus",
  "openai-gpt-4o",
  "openai-gpt-4-turbo",
  "google-gemini-20-flash",
  "google-gemini-15-pro",
];

export const DEFAULT_CHAT_MODEL: string = chatModels[0].id;

// Helper functions for the credit system
export const getFreeModels = () => chatModels.filter((model) => !model.isPaid);
export const getPaidModels = () => chatModels.filter((model) => model.isPaid);
export const getModelById = (id: string) =>
  chatModels.find((model) => model.id === id);
export const getCreditsRequired = (modelId: string) => {
  const model = getModelById(modelId);
  return model ? model.creditsPerMessage : 0;
};
