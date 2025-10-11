"use server";

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

export async function profileUpdate(profileData) {
  // const result = await db
  //   .update(Patients)
  //   .set(profileData)
  //   .where(Patients.userId.eq(profileData.userId));

  // return result;
}
