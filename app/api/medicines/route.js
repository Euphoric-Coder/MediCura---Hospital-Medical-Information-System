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
  const [newMed] = await db.insert(Medicines).values(body).returning();

  // Log restock
  await db.insert(InventoryLogs).values({
    medicineId: newMed.id,
    action: "add",
    quantityChange: newMed.quantity,
    prevQuantity: 0,
    newQuantity: newMed.quantity,
    notes: "Initial stock added",
  });

  return NextResponse.json(newMed);
}
