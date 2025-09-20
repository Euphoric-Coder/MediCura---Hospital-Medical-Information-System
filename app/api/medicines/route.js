import { NextResponse } from "next/server";
import { Medicines, InventoryLogs } from "@/lib/schema";
import { db } from "@/lib/dbConfig";

// Get all medicines
export async function GET() {
  const medicines = await db.select().from(Medicines);
  return NextResponse.json(medicines);
}

// Add new medicine
export async function POST(req) {
  const body = await req.json();

  // separates pharmacistId from the medicine data
  const { pharmacistId, ...medicineData } = body;

  const [newMed] = await db.insert(Medicines).values(medicineData).returning();

  // Log Add Medicine
  await db.insert(InventoryLogs).values({
    medicineId: newMed.id,
    pharmacistId,
    action: "add",
    quantityChange: newMed.quantity,
    prevQuantity: 0,
    newQuantity: newMed.quantity,
    unitPrice: newMed.unitPrice,
    notes: `Initial stock of ${newMed.name} added`,
  });

  return NextResponse.json(newMed);
}
