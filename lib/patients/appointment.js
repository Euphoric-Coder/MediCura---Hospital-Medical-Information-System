"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "../dbConfig";
import { Appointments, Doctors, Patients } from "../schema";

export async function getPatientAppointments(patientId) {
  try {
    const patientAppointments = await db
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
      .where(eq(Appointments.patientId, patientId))
      .orderBy(desc(Appointments.date));

    const allAppointments = await db.select().from(Appointments);

    return { patientAppointments, allAppointments };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { patientAppointments: [], allAppointments: [] };
  }
}

export async function getDoctor() {
  const doctor = await db.select().from(Doctors);

  return doctor;
}
