import { db } from "./client";
import { inventory, products, saleItems, sales } from "./schema";

/** Fecha YYYY-MM-DD a partir de hoy - `daysAgo` días atrás */
const dateDaysAgo = (daysAgo: number) => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

type ProductSeed = { name: string; sku: string; stock: number };

const PRODUCT_SEED: ProductSeed[] = [
  { name: "Coca Cola 600ml", sku: "COCA-600", stock: 180 },
  { name: "Sabritas Original 45g", sku: "SAB-ORI", stock: 120 },
  { name: "Agua Natural 1L", sku: "AGUA-1L", stock: 200 },
  { name: "Galletas Emperador", sku: "EMP-CHOC", stock: 90 },
  { name: "Leche Alpura 1L", sku: "LEC-ALP-1L", stock: 65 },
  { name: "Pan Bimbo Blanco", sku: "PAN-BIM-W", stock: 40 },
  { name: "Cerveza Corona 355ml six", sku: "COR-355-6", stock: 55 },
  { name: "Jugo del Valle Naranja 1L", sku: "JVO-NAR-1L", stock: 70 },
  { name: "Chocolate Carlos V", sku: "CH-CV-18G", stock: 150 },
  { name: "Aceite 123 1L", sku: "ACE-123-1L", stock: 48 },
  { name: "Arroz Verde Valle 1kg", sku: "ARZ-VV-1K", stock: 85 },
  { name: "Frijol Bayo 1kg", sku: "FRJ-BAY-1K", stock: 60 },
];

type SaleLineSeed = { sku: string; quantity: number; unitPrice: string };

type SaleSeed = { daysAgo: number; lines: SaleLineSeed[] };

const SALE_SEED: SaleSeed[] = [
  {
    daysAgo: 1,
    lines: [
      { sku: "COCA-600", quantity: 24, unitPrice: "18.00" },
      { sku: "SAB-ORI", quantity: 18, unitPrice: "16.00" },
      { sku: "AGUA-1L", quantity: 36, unitPrice: "12.00" },
    ],
  },
  {
    daysAgo: 2,
    lines: [
      { sku: "COCA-600", quantity: 12, unitPrice: "18.00" },
      { sku: "EMP-CHOC", quantity: 20, unitPrice: "14.50" },
    ],
  },
  {
    daysAgo: 3,
    lines: [
      { sku: "LEC-ALP-1L", quantity: 10, unitPrice: "28.00" },
      { sku: "PAN-BIM-W", quantity: 8, unitPrice: "42.00" },
      { sku: "JVO-NAR-1L", quantity: 6, unitPrice: "22.00" },
    ],
  },
  {
    daysAgo: 4,
    lines: [{ sku: "COR-355-6", quantity: 4, unitPrice: "115.00" }],
  },
  {
    daysAgo: 5,
    lines: [
      { sku: "CH-CV-18G", quantity: 40, unitPrice: "8.00" },
      { sku: "SAB-ORI", quantity: 25, unitPrice: "16.00" },
    ],
  },
  {
    daysAgo: 7,
    lines: [
      { sku: "ACE-123-1L", quantity: 6, unitPrice: "38.00" },
      { sku: "ARZ-VV-1K", quantity: 10, unitPrice: "32.00" },
      { sku: "FRJ-BAY-1K", quantity: 8, unitPrice: "36.00" },
    ],
  },
  {
    daysAgo: 10,
    lines: [
      { sku: "AGUA-1L", quantity: 48, unitPrice: "12.00" },
      { sku: "COCA-600", quantity: 30, unitPrice: "18.00" },
    ],
  },
  {
    daysAgo: 14,
    lines: [
      { sku: "EMP-CHOC", quantity: 15, unitPrice: "14.50" },
      { sku: "CH-CV-18G", quantity: 30, unitPrice: "8.00" },
      { sku: "JVO-NAR-1L", quantity: 12, unitPrice: "22.00" },
    ],
  },
];

const sumSaleTotal = (lines: SaleLineSeed[]) => {
  let cents = 0;
  for (const line of lines) {
    const parts = line.unitPrice.split(".");
    const intPart = parts[0] ?? "0";
    const frac = parts[1] ?? "00";
    const unitCents = BigInt(intPart) * 100n + BigInt(frac.padEnd(2, "0").slice(0, 2));
    cents += Number(unitCents * BigInt(line.quantity));
  }
  return (cents / 100).toFixed(2);
};

const run = async () => {
  await db.delete(saleItems);
  await db.delete(sales);
  await db.delete(inventory);
  await db.delete(products);

  const insertedProducts = await db
    .insert(products)
    .values(PRODUCT_SEED.map(({ name, sku }) => ({ name, sku })))
    .returning();

  const bySku = new Map(insertedProducts.map((p) => [p.sku, p.id]));

  await db.insert(inventory).values(
    PRODUCT_SEED.map((row) => ({
      productId: bySku.get(row.sku)!,
      quantity: row.stock,
    })),
  );

  for (const sale of SALE_SEED) {
    const totalAmount = sumSaleTotal(sale.lines);
    const saleRows = await db
      .insert(sales)
      .values({
        soldAt: dateDaysAgo(sale.daysAgo),
        totalAmount,
      })
      .returning();

    const insertedSale = saleRows[0];
    if (!insertedSale) {
      throw new Error("No se pudo insertar la venta");
    }

    await db.insert(saleItems).values(
      sale.lines.map((line) => ({
        saleId: insertedSale.id,
        productId: bySku.get(line.sku)!,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      })),
    );
  }
};

await run();
