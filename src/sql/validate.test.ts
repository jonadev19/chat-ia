import { describe, expect, test } from "bun:test";
import { validateSelectSql } from "./validate";

describe("validateSelectSql", () => {
  test("acepta SELECT valido", () => {
    const result = validateSelectSql("SELECT * FROM products LIMIT 10");
    expect(result.valid).toBe(true);
  });

  test("rechaza UPDATE", () => {
    const result = validateSelectSql("UPDATE products SET name = 'X'");
    expect(result.valid).toBe(false);
  });

  test("acepta SELECT sin LIMIT", () => {
    const result = validateSelectSql("SELECT id, name FROM products");
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.sql).toBe("SELECT id, name FROM products");
    }
  });

  test("acepta SELECT de cualquier tabla", () => {
    const result = validateSelectSql("SELECT * FROM users LIMIT 5");
    expect(result.valid).toBe(true);
  });

  test("acepta SELECT con prefijo accidental del LLM", () => {
    const result = validateSelectSql(
      ": SELECT SUM(total_amount) AS total_sales_yesterday FROM sales WHERE DATE(sold_at) = DATE '2026-04-30' - INTERVAL '1 day' LIMIT 1;",
    );
    expect(result.valid).toBe(true);
  });
});
