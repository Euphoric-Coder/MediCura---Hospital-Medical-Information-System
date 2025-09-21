import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Medicines, InventoryLogs } from "@/lib/schema";
import { db } from "@/lib/dbConfig";

// Update medicine (non-restock)
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  // Separates pharmacistId from the medicine data
  const { pharmacistId, reason, ...medicineData } = body;

  // Fetch old record
  const [oldMed] = await db
    .select()
    .from(Medicines)
    .where(eq(Medicines.id, id));

  if (!oldMed) {
    return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
  }

  // Exclude stock-related fields (handled by restock/dispense APIs)
  const { quantity, createdAt, ...nonStockUpdates } = medicineData;

  if (Object.keys(nonStockUpdates).length === 0) {
    return NextResponse.json(
      { error: "No non-stock fields to update" },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(Medicines)
    .set(nonStockUpdates)
    .where(eq(Medicines.id, id))
    .returning();

  const changes = Object.keys(nonStockUpdates)
    .filter((key) => oldMed[key] !== nonStockUpdates[key])
    .map(
      (key) => `- ${key}: ${oldMed[key] ?? "null"} → ${nonStockUpdates[key]}`
    )
    .join("\n");

  // Log metadata change for audit
  await db.insert(InventoryLogs).values({
    medicineId: id,
    pharmacistId,
    action: "metadata-update",
    quantityChange: 0, // stock unchanged
    prevQuantity: oldMed.quantity,
    newQuantity: oldMed.quantity,
    unitPrice: nonStockUpdates.unitPrice,
    notes:
      changes.length > 0
        ? `Updated Data for medicine ${oldMed.name}:\n${changes}\nReason of Update: ${reason}`
        : `Updated Data for medicine ${oldMed.name}: no changes detected`,
  });

  return NextResponse.json(updated);
}

// Delete medicine
export async function DELETE(req, { params }) {
  const { id } = params;

  // Parse body (pharmacistId, reason, etc.)
  let body = {};
  try {
    body = await req.json();
  } catch (e) {
    // no body provided → ignore
  }

  const { pharmacistId, reason } = body;

  // Fetch before delete
  const [oldMed] = await db
    .select()
    .from(Medicines)
    .where(eq(Medicines.id, id));

  if (!oldMed) {
    return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
  }

  // Log deletion
  await db.insert(InventoryLogs).values({
    medicineId: id,
    pharmacistId,
    action: "delete",
    quantityChange: -oldMed.quantity,
    prevQuantity: oldMed.quantity,
    newQuantity: 0,
    unitPrice: oldMed.unitPrice,
    notes: reason,
  });

  await db.delete(Medicines).where(eq(Medicines.id, id));

  return NextResponse.json({ success: true });
}
