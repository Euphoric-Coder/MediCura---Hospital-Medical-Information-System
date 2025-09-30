// app/api/patient/appointments/reschedule/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { Appointments } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { appointmentId, newDate, newTime } = await req.json();

    if (!appointmentId || !newDate || !newTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const reschedule = await db
      .update(Appointments)
      .set({
        date: newDate,
        time: newTime,
        updatedAt: new Date(),
      })
      .where(eq(Appointments.id, appointmentId));

    return NextResponse.json(
      { message: "Appointment rescheduled successfully", reschedule },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    return NextResponse.json(
      { error: "Failed to reschedule appointment" },
      { status: 500 }
    );
  }
}
