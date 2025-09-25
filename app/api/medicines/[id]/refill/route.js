import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Medicines, InventoryLogs } from "@/lib/schema";
import { db } from "@/lib/dbConfig";

// POST /api/medicines/[id]/refill
export async function POST(req, { params }) {
  const { id } = params;
  const { quantity, unitPrice, pharmacistId, medication } = await req.json();

  if (!quantity || quantity <= 0) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  // Fetch medicine
  const [med] = await db.select().from(Medicines).where(eq(Medicines.id, id));

  if (!med) {
    return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
  }

  if (med.quantity < quantity) {
    return NextResponse.json(
      { error: "Not enough stock to dispense" },
      { status: 400 }
    );
  }

  // Update stock
  const newQty = med.quantity - quantity;
  const [updated] = await db
    .update(Medicines)
    .set({ quantity: newQty })
    .where(eq(Medicines.id, id))
    .returning();

  // Log dispense action
  await db.insert(InventoryLogs).values({
    medicineId: id,
    pharmacistId,
    action: "refill",
    quantityChange: -quantity,
    prevQuantity: med.quantity,
    newQuantity: newQty,
    unitPrice,
    notes: `Refilled ${quantity} units of ${medication || "N/A"}`,
  });

  return NextResponse.json(updated);
}
