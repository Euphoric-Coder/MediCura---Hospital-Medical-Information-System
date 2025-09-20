import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Medicines } from "@/lib/schema";
import { db } from "@/lib/dbConfig";

export async function GET() {
  const medicines = await db.select().from(Medicines);
  return NextResponse.json(medicines);
}

export async function POST(req) {
  const body = await req.json();
  const newMed = await db.insert(Medicines).values(body).returning();
  return NextResponse.json(newMed[0]);
}

export async function PUT(req) {
  const body = await req.json();
  const { id, ...updates } = body;
  const updated = await db
    .update(Medicines)
    .set(updates)
    .where(eq(Medicines.id, id))
    .returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(req) {
  const { id } = await req.json();
  await db.delete(Medicines).where(eq(Medicines.id, id));
  return NextResponse.json({ success: true });
}
