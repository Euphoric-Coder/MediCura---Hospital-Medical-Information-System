"use server";

import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { db } from "./dbConfig";
import { Users, Patients } from "./schema";

export const registerPatient = async (formData) => {
  try {
    // Step 1: Create password from DOB (ddmmyyyy)
    const dob = new Date(formData.dateOfBirth);
    const passwordPlain = `${String(dob.getDate()).padStart(2, "0")}${String(
      dob.getMonth() + 1
    ).padStart(2, "0")}${dob.getFullYear()}`;

    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.email, formData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "User already exists" };
    }

    // Step 2: Insert into Users
    const hashedPassword = await hash(passwordPlain, 10);

    console.log("Plain password:", passwordPlain);

    console.log("Hashed password:", hashedPassword);

    // const [newUser] = await db
    //   .insert(Users)
    //   .values({
    //     fullName: formData.name,
    //     email: formData.email,
    //     password: hashedPassword,
    //     role: "patient",
    //   })
    //   .returning({ id: Users.id });

    // Step 3: Insert into Patients
    console.log({
    //   userId: newUser.id,
      name: formData.name,
      avatar: null, // can add avatar upload later
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      address: formData.address,
      occupation: formData.occupation,
      emergencyContactName: formData.emergencyContactName,
      emergencyPhone: formData.emergencyPhone,
      primaryPhysician: formData.primaryPhysician,
      insuranceProvider: formData.insuranceProvider,
      insurancePolicyNumber: formData.insurancePolicyNumber,
      insurancePolicyDocument: formData.insuranceCard || null,
      identificationDocument: formData.idDocument || null,
      allergies: formData.allergies,
      currentMedications: formData.currentMedications,
      familyMedicalHistory: formData.familyMedicalHistory,
      pastMedicalHistory: formData.pastMedicalHistory,
    });
    // await db.insert(Patients).values({
    //   userId: newUser.id,
    //   name: formData.name,
    //   avatar: null,
    //   email: formData.email,
    //   phone: formData.phone,
    //   dateOfBirth: formData.dateOfBirth,
    //   gender: formData.gender,
    //   address: formData.address,
    //   occupation: formData.occupation,
    //   emergencyContactName: formData.emergencyContactName,
    //   emergencyPhone: formData.emergencyPhone,
    //   primaryPhysician: formData.primaryPhysician,
    //   insuranceProvider: formData.insuranceProvider,
    //   insurancePolicyNumber: formData.insurancePolicyNumber,
    //   insurancePolicyDocument: formData.insuranceCard || null,
    //   identificationDocument: formData.idDocument || null,
    //   allergies: formData.allergies,
    //   currentMedications: formData.currentMedications,
    //   familyMedicalHistory: formData.familyMedicalHistory,
    //   pastMedicalHistory: formData.pastMedicalHistory,
    // });

    return { success: true };
  } catch (error) {
    console.error("Error registering patient:", error);
    return { success: false, error: "Internal server error" };
  }
};
