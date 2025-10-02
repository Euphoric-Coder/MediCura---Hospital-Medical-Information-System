import { eq } from "drizzle-orm";
import { Appointments, Consultations, Doctors, Prescriptions } from "../schema";

export async function getDashboardPrescriptions(patientId) {
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

  return prescriptions;
}
