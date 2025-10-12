"use server";

import { eq } from "drizzle-orm";
import { db } from "../dbConfig";
import { Doctors, Patients } from "../schema";

export async function fetchPhysicians() {
  const doctor = await db
    .select({
      id: Doctors.userId,
      name: Doctors.name,
      avatar: Doctors.avatar,
      speciality: Doctors.speciality,
    })
    .from(Doctors);

  return doctor;
}

export async function profileUpdate({ profileData }) {
  console.log("Profile Data to be updated: ", profileData);
  const result = await db
    .update(Patients)
    .set(profileData)
    .where(eq(Patients.userId, profileData.userId));

  console.log(result);

  // return result.json();
}
