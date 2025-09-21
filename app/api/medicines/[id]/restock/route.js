import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Medicines, InventoryLogs } from "@/lib/schema";
import { db } from "@/lib/dbConfig";

export async function POST(
  req,
  { params }
) {
  const { id } = params;
  const { restockQuantity, notes } = await req.json();

  if (!restockQuantity || restockQuantity <= 0) {
    return NextResponse.json(
      { error: "Restock quantity must be greater than 0" },
      { status: 400 }
    );
  }

  // Fetch medicine
  const [medicine] = await db
    .select()
    .from(Medicines)
    .where(eq(Medicines.id, id));

  if (!medicine) {
    return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
  }

  const currentQty = parseInt(medicine.quantity, 10) || 0;
  const newQuantity = currentQty + restockQuantity;

  // Update medicine stock
  const [updatedMed] = await db
    .update(Medicines)
    .set({ quantity: newQuantity })
    .where(eq(Medicines.id, id))
    .returning();

  // Log restock
  await db.insert(InventoryLogs).values({
    medicineId: id,
    action: "restock",
    quantityChange: restockQuantity,
    prevQuantity: medicine.quantity,
    newQuantity,
    notes: notes || "Stock replenished",
  });

  return NextResponse.json(updatedMed);
}
