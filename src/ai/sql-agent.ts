import { generateText, Output } from "ai";
import { openrouter, openrouterModel } from "./openrouter";
import { sqlAgentOutputSchema } from "../validation/chat";
import { schemaContext } from "../sql/schema-context";

export const generateSqlFromQuestion = async (message: string) => {
  const today = new Date().toISOString().slice(0, 10);
  const llmInput = `Pregunta del usuario: ${message}\n\nEsquema:\n${schemaContext}`;

  const result = await generateText({
    model: openrouter(openrouterModel),
    output: Output.object({
      schema: sqlAgentOutputSchema,
      name: "sqlQuery",
      description: "SQL de solo lectura que responde la pregunta del usuario",
    }),
    system: `Eres un asistente que traduce preguntas de negocio a SQL PostgreSQL.
- Responde unicamente con una consulta SELECT valida.
- No uses INSERT, UPDATE, DELETE ni DDL.
- Usa solo las tablas del esquema dado.
- Si no existe LIMIT, agregalo.
- Usa la fecha de hoy (${today}) para interpretar preguntas relativas como "ayer".
- Devuelve unicamente la consulta SQL.
`,
    prompt: llmInput,
  });

  const structured = result.output;
  return structured.sql;
};
