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

  const [updated] = await db
    .update(Medicines)
    .set(body)
    .where(eq(Medicines.id, id))
    .returning();

  // If quantity was adjusted directly (not restock flow)
  if (body.quantity !== undefined && body.quantity !== oldMed.quantity) {
    await db.insert(InventoryLogs).values({
      medicineId: id,
      action: "adjustment", // clearer than "update"
      quantityChange: body.quantity - oldMed.quantity,
      prevQuantity: oldMed.quantity,
      newQuantity: body.quantity,
      notes: "Manual stock adjustment via update",
    });
  }

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
