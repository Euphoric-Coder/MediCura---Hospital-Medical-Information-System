"use server";

import { db } from "../dbConfig";
import { Doctors } from "../schema";

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
