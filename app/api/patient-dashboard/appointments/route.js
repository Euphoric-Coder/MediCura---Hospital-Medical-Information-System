import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { Appointments, Doctors } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

/**
 * GET /api/patient-dashboard/appointments?patientId=<id>
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
    }

    const appts = await db
      .select({
        id: Appointments.id,
        date: Appointments.date,
        time: Appointments.time,
        type: Appointments.type,
        status: Appointments.status,
        doctorId: Appointments.doctorId,

        doctorName: Doctors.name,
        doctorSpeciality: Doctors.speciality,
        doctorAvatar: Doctors.avatar,
      })
      .from(Appointments)
      .innerJoin(Doctors, eq(Appointments.doctorId, Doctors.userId))
      .where(eq(Appointments.patientId, patientId))
      .orderBy(desc(Appointments.date));

    return NextResponse.json(appts, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
