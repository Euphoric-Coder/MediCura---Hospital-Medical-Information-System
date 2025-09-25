import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/dbConfig";
import { Prescriptions } from "@/lib/schema";

// POST /api/prescriptions/[id]/update
export async function POST(req, { params }) {
  const { id } = params;
  const data = await req.json();

  try {
    const [updated] = await db
      .update(Prescriptions)
      .set(data)
      .where(eq(Prescriptions.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating prescription:", err);
    return NextResponse.json(
      { error: "Failed to update prescription" },
      { status: 500 }
    );
  }
}
