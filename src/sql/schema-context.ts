import { getTableName } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import type { PgTable } from "drizzle-orm/pg-core";
import { inventory, products, saleItems, sales } from "../db/schema";

/** Orden estable para el prompt del LLM (mismo orden que en la base). */
const tablesForLlm: PgTable[] = [products, inventory, sales, saleItems];

const describeTable = (table: PgTable) => {
  const { name, columns } = getTableConfig(table);
  const colNames = columns.map((c) => c.name).join(", ");
  return `${name}(${colNames})`;
};

const describeForeignKeys = (table: PgTable) => {
  const { name: localTable, foreignKeys } = getTableConfig(table);
  return foreignKeys.map((fk) => {
    const ref = fk.reference();
    const from = ref.columns.map((c) => `${localTable}.${c.name}`).join(", ");
    const foreignTable = getTableName(ref.foreignTable);
    const to = ref.foreignColumns.map((c) => `${foreignTable}.${c.name}`).join(", ");
    return `- ${from} -> ${to}`;
  });
};

export const schemaContext = [
  "Tablas disponibles en PostgreSQL:",
  "",
  ...tablesForLlm.map((t) => describeTable(t)),
  "",
  "Relaciones (FK):",
  ...tablesForLlm.flatMap((t) => describeForeignKeys(t)),
].join("\n");
