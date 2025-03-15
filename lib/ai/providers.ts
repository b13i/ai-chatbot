import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";

// Provider SDKs - Core providers we have dependencies for
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { fireworks } from "@ai-sdk/fireworks";
import { google } from "@ai-sdk/google";

// Import the necessary providers based on the .env configuration
// These imports are marked with try/catch so the app can run even if some
// provider packages aren't installed yet
const providerSDKs: Record<string, any> = {
  openai,
  anthropic,
  fireworks,
  google,
};

// Dynamically load other providers if their packages are installed

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
