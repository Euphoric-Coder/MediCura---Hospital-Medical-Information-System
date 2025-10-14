import { db } from "@/lib/dbConfig";
import { Users, Doctors } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getUserRole(email) {
  return await db.select().from(Users).where(eq(Users.email, email));
}

export async function getDoctorData(userId) {
  return await db.select().from(Doctors).where(eq(Doctors.userId, userId));
}
