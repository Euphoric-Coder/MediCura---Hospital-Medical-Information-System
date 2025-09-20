import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Medicines, InventoryLogs } from "@/lib/schema";
import { db } from "@/lib/dbConfig";

// Update medicine (non-restock)
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  // Fetch old record
  const [oldMed] = await db
    .select()
    .from(Medicines)
    .where(eq(Medicines.id, id));

  if (!oldMed) {
    return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
  }

  // Exclude stock-related fields (handled by restock/dispense APIs)
  const { quantity, ...nonStockUpdates } = body;

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

  // Log metadata change for audit
  await db.insert(InventoryLogs).values({
    medicineId: id,
    action: "metadata-update",
    quantityChange: 0, // stock unchanged
    prevQuantity: oldMed.quantity,
    newQuantity: oldMed.quantity,
    notes: `Metadata updated: ${Object.keys(nonStockUpdates).join(", ")}`,
  });

  return NextResponse.json(updated);
}

// Delete medicine
export async function DELETE(req, { params }) {
  const { id } = params;

  // Fetch before delete
  const [oldMed] = await db
    .select()
    .from(Medicines)
    .where(eq(Medicines.id, id));

  if (!oldMed) {
    return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
  }

  await db.delete(Medicines).where(eq(Medicines.id, id));

  // Log deletion
  await db.insert(InventoryLogs).values({
    medicineId: id,
    action: "delete",
    quantityChange: -oldMed.quantity,
    prevQuantity: oldMed.quantity,
    newQuantity: 0,
    notes: "Medicine deleted",
  });

  return NextResponse.json({ success: true });
}
