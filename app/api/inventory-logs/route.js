import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { InventoryLogs, Medicines } from "@/lib/schema";
import { db } from "@/lib/dbConfig";

// ✅ Get all inventory logs (with medicine info)
export async function GET() {
  const logs = await db
    .select({
      id: InventoryLogs.id,
      action: InventoryLogs.action,
      quantityChange: InventoryLogs.quantityChange,
      prevQuantity: InventoryLogs.prevQuantity,
      newQuantity: InventoryLogs.newQuantity,
      notes: InventoryLogs.notes,
      createdAt: InventoryLogs.createdAt,
      medicineName: Medicines.name,
      batchNumber: Medicines.batchNumber,
    })
    .from(InventoryLogs)
    .leftJoin(Medicines, eq(InventoryLogs.medicineId, Medicines.id))
    .orderBy(desc(InventoryLogs.createdAt));

  return NextResponse.json(logs);
}
