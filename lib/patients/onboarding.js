import { eq } from "drizzle-orm";
import { db } from "../dbConfig";
import { Patients, Users } from "../schema";

export async function getOnboardingStatus(id) {
  const data = await db.select().from(Patients).where(eq(Patients.userId, id));
  return data;
}

export async function getPatientData(id) {
  const patient = await db
    .select()
    .from(Patients)
    .where(eq(Patients.userId, id));
  return patient;
}

export async function getUserRole(userEmail) {
  const data = await db.select().from(Users).where(eq(Users.email, userEmail));
  return data;
}

export async function onboardPatient(patientData) {
  const data = await db.insert(Patients).values(patientData);
  return data;
}
