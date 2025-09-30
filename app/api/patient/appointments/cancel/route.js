import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { Appointments } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { appointmentId, reason } = await req.json();

    if (!appointmentId || !reason) {
      return NextResponse.json(
        { error: "Appointment ID and reason are required" },
        { status: 400 }
      );
    }

    // Update the appointment status to cancelled
    const cancel = await db
      .update(Appointments)
      .set({ status: "cancelled", reason, workflow: "cancelled" })
      .where(eq(Appointments.id, appointmentId))
      .returning();

    if (!cancel.length) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment: cancel[0],
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 }
    );
  }
}
