import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1, "message es requerido"),
});

export const sqlAgentOutputSchema = z.object({
  sql: z.string().min(1),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
