// app/api/prescriptions/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import {
  Prescriptions,
  Consultations,
  Medicines,
  Patients,
  Doctors,
} from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        id: Prescriptions.id,
        status: Prescriptions.status,
        medicationId: Prescriptions.medicationId,
        medication: Prescriptions.medication,
        dosage: Prescriptions.dosage,
        frequency: Prescriptions.frequency,
        duration: Prescriptions.duration,
        instructions: Prescriptions.instructions,
        startDate: Prescriptions.startDate,
        endDate: Prescriptions.endDate,
        cost: Prescriptions.cost,
        refillsRemaining: Prescriptions.refillsRemaining,
        nextRefillDate: Prescriptions.nextRefillDate,
        lastDispensedDate: Prescriptions.lastDispensedDate,
        pharmacistNotes: Prescriptions.pharmacistNotes,
        createdAt: Prescriptions.createdAt,

        // Joins
        patientId: Consultations.patientId,
        doctorId: Consultations.doctorId,
        patientName: Patients.name,
        patientPhone: Patients.phone,
        prescribedBy: Doctors.name,
        medicineName: Medicines.name,
        medicineStock: Medicines.quantity,
        medicineExpiry: Medicines.expiryDate,
      })
      .from(Prescriptions)
      .leftJoin(
        Consultations,
        eq(Prescriptions.consultationId, Consultations.id)
      )
      .leftJoin(Patients, eq(Consultations.patientId, Patients.userId))
      .leftJoin(Doctors, eq(Consultations.doctorId, Doctors.userId))
      .leftJoin(Medicines, eq(Prescriptions.medicationId, Medicines.id));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}
