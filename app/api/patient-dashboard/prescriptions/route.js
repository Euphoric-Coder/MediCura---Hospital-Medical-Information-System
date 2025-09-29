import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import {
  Prescriptions,
  Consultations,
  Appointments,
  Doctors,
} from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/prescriptions?patientId=<id>
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
    }

    const prescriptions = await db
      .select({
        id: Prescriptions.id,
        medication: Prescriptions.medication,
        dosage: Prescriptions.dosage,
        frequency: Prescriptions.frequency,
        duration: Prescriptions.duration,
        status: Prescriptions.status,
        refills: Prescriptions.refillsRemaining,

        consultationId: Consultations.id,
        consultationDate: Consultations.createdAt,

        doctorId: Doctors.userId,
        doctorName: Doctors.name,
        doctorSpeciality: Doctors.speciality,

        appointmentId: Appointments.id,
        appointmentDate: Appointments.date,
        appointmentTime: Appointments.time,
        appointmentType: Appointments.type,
      })
      .from(Prescriptions)
      .innerJoin(
        Consultations,
        eq(Prescriptions.consultationId, Consultations.id)
      )
      .leftJoin(Appointments, eq(Consultations.appointmentId, Appointments.id))
      .innerJoin(Doctors, eq(Consultations.doctorId, Doctors.userId))
      .where(eq(Consultations.patientId, patientId));

    return NextResponse.json(prescriptions, { status: 200 });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
