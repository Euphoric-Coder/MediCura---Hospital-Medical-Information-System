"use server";

import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { db } from "./dbConfig";
import { sendEmail } from "./sendEmail";
import { Users } from "./schema";
import PatientSignup from "@/emails/PatientSignup";

export const signUp = async ({ fullName, email, password, role }) => {
  const existingUser = await db
    .select()
    .from(Users)
    .where(eq(Users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  await db.insert(Users).values({
    fullName,
    email,
    password: hashedPassword,
    role,
  });

  if (role === "patient") {
    await sendEmail({
      from: "MediCura Team <no-reply@budgetease.in>",
      to: email,
      subject: `Welcome to MediCura 🎉 - ${fullName}`,
      react: <PatientSignup fullName={fullName} />,
    });
  }

  return { success: true };
};
