import { describe, expect, test } from "bun:test";
import { chatRequestSchema } from "./chat";

describe("chatRequestSchema", () => {
  test("valida mensaje correcto", () => {
    const result = chatRequestSchema.safeParse({ message: "cuanto vendi ayer?" });
    expect(result.success).toBe(true);
  });

  test("rechaza mensaje vacio", () => {
    const result = chatRequestSchema.safeParse({ message: "" });
    expect(result.success).toBe(false);
  });
});
