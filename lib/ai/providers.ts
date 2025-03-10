import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";

// Provider SDKs - Core providers we have dependencies for
import { openai } from "@ai-sdk/openai";
import { fireworks } from "@ai-sdk/fireworks";

// Import the necessary providers based on the .env configuration
// These imports are marked with try/catch so the app can run even if some
// provider packages aren't installed yet
const providerSDKs: Record<string, any> = {
  openai,
  fireworks,
};

// Dynamically load other providers if their packages are installed
try {
  providerSDKs.anthropic = require("@ai-sdk/anthropic").anthropic;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.mistral = require("@ai-sdk/mistralai").mistralai;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.google =
    require("@ai-sdk/google-generative-ai").googleGenerativeAI;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.cohere = require("@ai-sdk/cohere").cohere;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.groq = require("@ai-sdk/groq").groq;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.together = require("@ai-sdk/together-ai").togetherai;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.perplexity = require("@ai-sdk/perplexity").perplexity;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs["azure-openai"] = require("@ai-sdk/azure-openai").azureOpenAI;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs["amazon-bedrock"] =
    require("@ai-sdk/amazon-bedrock").amazonBedrock;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.replicate = require("@ai-sdk/replicate").replicate;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.deepinfra = require("@ai-sdk/deepinfra").deepinfra;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.deepseek = require("@ai-sdk/deepseek").deepseek;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.cerebras = require("@ai-sdk/cerebras").cerebras;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.xai = require("@ai-sdk/xai").xai;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs["google-vertex"] = require("@ai-sdk/google-vertex").googleVertex;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.luma = require("@ai-sdk/luma").luma;
} catch (e) {
  /* Not installed */
}
try {
  providerSDKs.fal = require("@ai-sdk/fal").fal;
} catch (e) {
  /* Not installed */
}

import { isTestEnvironment } from "../constants";
import { artifactModel, chatModel, titleModel } from "./models.test";
import { chatModels, REASONING_MODELS } from "./models";

// Create a mapping of model IDs to their provider implementations
const createLanguageModelMap = () => {
  const modelMap: Record<string, any> = {};

  chatModels.forEach((model) => {
    try {
      // Get the provider SDK
      const providerSDK = providerSDKs[model.provider];

      if (!providerSDK) {
        console.warn(
          `Provider SDK for ${model.provider} not installed, falling back to OpenAI`
        );
        modelMap[model.id] = openai("gpt-3.5-turbo");
        return;
      }

      // Check if this model needs reasoning middleware
      if (REASONING_MODELS.includes(model.id)) {
        modelMap[model.id] = wrapLanguageModel({
          model: providerSDK(model.modelId),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        });
      } else {
        modelMap[model.id] = providerSDK(model.modelId);
      }
    } catch (error) {
      console.error(`Error configuring model ${model.id}:`, error);
      // Fall back to a basic model
      modelMap[model.id] = openai("gpt-3.5-turbo");
    }
  });

  // Add utility model IDs for specific purposes
  modelMap["title-model"] = openai("gpt-4o-mini");
  modelMap["artifact-model"] = openai("gpt-4o-mini");

  return modelMap;
};

// Note: In the test environment, we're using mock models
export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        ...chatModels.reduce(
          (acc, model) => ({
            ...acc,
            [model.id]: chatModel,
          }),
          {}
        ),
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    })
  : customProvider({
      languageModels: createLanguageModelMap(),
      imageModels: {
        "small-model": openai.image("dall-e-2"),
        "large-model": openai.image("dall-e-3"),
      },
    });
