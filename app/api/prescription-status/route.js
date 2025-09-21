// app/api/prescription-status/route.js
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/dbConfig";
import { Prescriptions } from "@/lib/schema";

export async function POST(req) {
  try {
    const { prescriptionId, status, notes } = await req.json();

    if (!prescriptionId || !status) {
      return NextResponse.json(
        { error: "PrescriptionId and status are required" },
        { status: 400 }
      );
    }

    // Fetch prescription
    const [prescription] = await db
      .select()
      .from(Prescriptions)
      .where(eq(Prescriptions.id, prescriptionId));

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    // Update prescription status + pharmacist notes
    const [updatedPrescription] = await db
      .update(Prescriptions)
      .set({
        status,
        pharmacistNotes: notes || null,
      })
      .where(eq(Prescriptions.id, prescriptionId))
      .returning();

    return NextResponse.json({
      success: true,
      prescription: updatedPrescription,
    });
  } catch (error) {
    console.error("Error updating prescription status:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
