export const validateSelectSql = (input: string): { valid: true; sql: string } | { valid: false; reason: string } => {
  const sql = input
    .trim()
    .replace(/^```(?:sql)?/i, "")
    .replace(/```$/i, "")
    .replace(/^[^a-zA-Z]*/, "")
    .replace(/\s+/g, " ");
  const lower = sql.toLowerCase();

  if (!lower.startsWith("select")) {
    return { valid: false, reason: "Solo se permite SELECT" };
  }

  return { valid: true, sql };
};
