import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { Appointments, Doctors, Patients } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req, { params }) {
  const { id } = params;

  console.log(id);

  try {
    const data = await db
      .select({
        id: Appointments.id,
        date: Appointments.date,
        time: Appointments.time,
        arrivalTime: Appointments.arrivalTime,
        type: Appointments.type,
        status: Appointments.status,
        reason: Appointments.reason,
        notes: Appointments.notes,
        workflow: Appointments.workflow,
        isUrgent: Appointments.isUrgent,
        doctorId: Appointments.doctorId,
        patientId: Appointments.patientId,

        // Doctor object
        doctor: {
          userId: Doctors.userId,
          name: Doctors.name,
          speciality: Doctors.speciality,
          avatar: Doctors.avatar,
          phone: Doctors.phone,
          consultationFee: Doctors.consultationFee,
          availableDays: Doctors.availableDays,
          availableHours: Doctors.availableHours,
          yearsOfExperience: Doctors.yearsOfExperience,
          rating: Doctors.rating,
        },

        // Patient object
        patient: {
          userId: Patients.userId,
          name: Patients.name,
          email: Patients.email,
          phone: Patients.phone,
          gender: Patients.gender,
          dateOfBirth: Patients.dateOfBirth,
          address: Patients.address,
          avatar: Patients.avatar,
        },
      })
      .from(Appointments)
      .innerJoin(Doctors, eq(Appointments.doctorId, Doctors.userId))
      .innerJoin(Patients, eq(Appointments.patientId, Patients.userId))
      .where(eq(Appointments.patientId, id))
      .orderBy(desc(Appointments.date));

    if (!data.length) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}
