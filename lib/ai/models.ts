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
    id: "mistral-small",
    name: "Mistral Small",
    description: "Efficient for straightforward tasks",
    provider: "mistral",
    modelId: "mistral-small-latest",
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

  // Fireworks models
  {
    id: "fireworks-deepseek-r1",
    name: "DeepSeek Reasoning",
    description: "Specialized for advanced reasoning capabilities",
    provider: "fireworks",
    modelId: "accounts/fireworks/models/deepseek-r1",
    creditsPerMessage: 3,
    isPaid: true,
  },
  {
    id: "fireworks-mixtral-8x7b",
    name: "Mixtral 8x7B",
    description: "Powerful open-source mixture-of-experts model",
    provider: "fireworks",
    modelId: "accounts/fireworks/models/mixtral-8x7b-instruct",
    creditsPerMessage: 1,
    isPaid: true,
  },

  // Mistral paid models
  {
    id: "mistral-large",
    name: "Mistral Large",
    description: "Mistral's most capable model",
    provider: "mistral",
    modelId: "mistral-large-latest",
    creditsPerMessage: 3,
    isPaid: true,
  },
  {
    id: "mistral-medium",
    name: "Mistral Medium",
    description: "Balanced performance model from Mistral",
    provider: "mistral",
    modelId: "mistral-medium-latest",
    creditsPerMessage: 1,
    isPaid: true,
  },

  // Cohere models
  {
    id: "cohere-command-r",
    name: "Command R",
    description: "Cohere's most capable instruction-following model",
    provider: "cohere",
    modelId: "command-r",
    creditsPerMessage: 2,
    isPaid: true,
  },
  {
    id: "cohere-command-r-plus",
    name: "Command R+",
    description: "Enhanced version with higher performance",
    provider: "cohere",
    modelId: "command-r-plus",
    creditsPerMessage: 3,
    isPaid: true,
  },

  // Groq models
  {
    id: "groq-llama3-70b",
    name: "LLaMA-3 70B (Groq)",
    description: "Super fast inference of Meta's LLaMA-3",
    provider: "groq",
    modelId: "llama3-70b-8192",
    creditsPerMessage: 2,
    isPaid: true,
  },
  {
    id: "groq-mixtral-8x7b",
    name: "Mixtral 8x7B (Groq)",
    description: "Fast inference of Mixtral's MoE model",
    provider: "groq",
    modelId: "mixtral-8x7b-32768",
    creditsPerMessage: 1,
    isPaid: true,
  },

  // Together AI models
  {
    id: "together-llama3-70b",
    name: "LLaMA-3 70B (Together)",
    description: "Meta's LLaMA-3 hosted on Together.ai",
    provider: "together",
    modelId: "meta-llama/Llama-3-70b-chat-hf",
    creditsPerMessage: 2,
    isPaid: true,
  },

  // Perplexity models
  {
    id: "perplexity-llama-3-sonar-small",
    name: "Sonar Small",
    description: "Perplexity's Small Online Real-time Generation model",
    provider: "perplexity",
    modelId: "sonar-small-online",
    creditsPerMessage: 1,
    isPaid: true,
  },

  // Azure OpenAI (same models as OpenAI but on Azure)
  {
    id: "azure-openai-gpt-4",
    name: "GPT-4 (Azure)",
    description: "OpenAI's GPT-4 hosted on Azure",
    provider: "azure-openai",
    modelId: "gpt-4",
    creditsPerMessage: 2,
    isPaid: true,
  },

  // Amazon Bedrock models
  {
    id: "amazon-claude-3-sonnet",
    name: "Claude 3 Sonnet (Bedrock)",
    description: "Claude 3 Sonnet on Amazon Bedrock",
    provider: "amazon-bedrock",
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    creditsPerMessage: 2,
    isPaid: true,
  },
  {
    id: "amazon-titan-text",
    name: "Amazon Titan",
    description: "Amazon's own large language model",
    provider: "amazon-bedrock",
    modelId: "amazon.titan-text-express-v1",
    creditsPerMessage: 1,
    isPaid: true,
  },
];

export const REASONING_MODELS: Array<(typeof chatModels)[number]["id"]> = [
  "fireworks-deepseek-r1",
  "anthropic-claude-3-opus",
  "openai-gpt-4o",
  "openai-gpt-4-turbo",
  "mistral-large",
  "groq-llama3-70b",
  "cohere-command-r-plus",
  "amazon-claude-3-sonnet",
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
