import { flattenError } from "zod";
import { generateNaturalAnswer } from "../ai/answer-agent";
import { generateSqlFromQuestion } from "../ai/sql-agent";
import { executeUnsafeSelect } from "../db/client";
import { errorJson, json } from "../http/responses";
import { validateSelectSql } from "../sql/validate";
import { chatRequestSchema } from "../validation/chat";

export const handleChatRoute = async (req: Request) => {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return errorJson("JSON invalido", 400);
  }

  const parsed = chatRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return errorJson("Body invalido", 400, flattenError(parsed.error));
  }

  const rawSql = await generateSqlFromQuestion(parsed.data.message);
  const validatedSql = validateSelectSql(rawSql);

  if (!validatedSql.valid) {
    return errorJson("SQL rechazado por seguridad", 400, { reason: validatedSql.reason, sql: rawSql });
  }

  const rows = await executeUnsafeSelect(validatedSql.sql);
  const answer = await generateNaturalAnswer({
    question: parsed.data.message,
    sql: validatedSql.sql,
    rows,
  });

  return json({
    answer,
    sql: validatedSql.sql,
    rows,
  });
};
