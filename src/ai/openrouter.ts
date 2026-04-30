import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY no esta configurada");
}

export const openrouter = createOpenRouter({
  apiKey,
});

export const openrouterModel = process.env.OPENROUTER_MODEL ?? "openrouter/free";
