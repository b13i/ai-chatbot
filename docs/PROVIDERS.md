# AI Provider Integration Guide

Our chatbot supports multiple AI providers through the [Vercel AI SDK](https://sdk.vercel.ai/). This guide explains how to set up and use the various AI providers with our credit-based system.

## Credit System

Our chatbot uses a credit system that allows users to access premium AI models by purchasing credits.

- **Free models**: Available to all users without spending credits
- **Paid models**: Require credits for each message
- **Credit packages**: Users can buy credits in packages (5 credits for $5, with volume discounts)

Credit costs vary based on model capabilities:

- Basic models: 1 credit per message
- Advanced models: 2-3 credits per message
- Most capable models (e.g., Claude 3 Opus): 5 credits per message

## Setting Up AI Providers

### Core Providers (Pre-installed)

These providers are included in the base installation:

#### OpenAI

```
OPENAI_API_KEY=sk-your-openai-api-key
```

#### Fireworks AI

```
FIREWORKS_API_KEY=fw-your-fireworks-api-key
```

### Additional Providers

Install these on demand to expand your model offerings.

#### Anthropic (Claude models)

```bash
pnpm add @ai-sdk/anthropic
```

Add to .env:

```
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
```

#### Mistral AI

```bash
pnpm add @ai-sdk/mistralai
```

Add to .env:

```
MISTRAL_API_KEY=your-mistral-api-key
```

#### Google (Gemini models)

```bash
pnpm add @ai-sdk/google-generative-ai
```

Add to .env:

```
GOOGLE_API_KEY=your-google-api-key
```

#### Cohere

```bash
pnpm add @ai-sdk/cohere
```

Add to .env:

```
COHERE_API_KEY=your-cohere-api-key
```

#### Groq

```bash
pnpm add @ai-sdk/groq
```

Add to .env:

```
GROQ_API_KEY=your-groq-api-key
```

#### Together AI

```bash
pnpm add @ai-sdk/together-ai
```

Add to .env:

```
TOGETHER_API_KEY=your-together-api-key
```

#### Perplexity

```bash
pnpm add @ai-sdk/perplexity
```

Add to .env:

```
PERPLEXITY_API_KEY=your-perplexity-api-key
```

#### Azure OpenAI

```bash
pnpm add @ai-sdk/azure-openai
```

Add to .env:

```
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_API_VERSION=2023-07-01-preview
```

#### Amazon Bedrock

```bash
pnpm add @ai-sdk/amazon-bedrock
```

Add to .env:

```
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
```

## Adding New Models

To add a new model to the chatbot:

1. Update the `ChatModel` interface in `lib/ai/models.ts` if you're adding a new provider
2. Add the model details to the `chatModels` array
3. If appropriate, add the model ID to the `REASONING_MODELS` array
4. Install the required provider package
5. Set up the necessary environment variables

## Fallback Behavior

If a provider SDK is not installed or configured:

- The system will fall back to OpenAI GPT-3.5 Turbo
- A warning will be logged to the console
- The user will still be charged the appropriate credits if it's a paid model

## Reasoning Models

Models listed in `REASONING_MODELS` array are wrapped with a reasoning middleware that extracts structured thinking from the model's response. This is useful for complex tasks that benefit from step-by-step reasoning.

## Image Generation

The chatbot supports image generation through:

- Small model: DALL-E 2 (OpenAI)
- Large model: DALL-E 3 (OpenAI)

Additional image models can be added by extending the `imageModels` configuration in `lib/ai/providers.ts`.
