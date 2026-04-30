import { generateText } from "ai";
import { openrouter, openrouterModel } from "./openrouter";

export const generateNaturalAnswer = async ({
  question,
  sql,
  rows,
}: {
  question: string;
  sql: string;
  rows: unknown;
}) => {
  const llmInput = `Pregunta: ${question}\nSQL ejecutado: ${sql}\nFilas devueltas: ${JSON.stringify(rows)}`;

  const result = await generateText({
    model: openrouter(openrouterModel),
    system:
      "Eres un asistente de analytics. Responde en espanol claro, breve y con datos del resultado. Si no hay filas, dilo explicitamente.",
    prompt: llmInput,
  });

  return result.text;
};
