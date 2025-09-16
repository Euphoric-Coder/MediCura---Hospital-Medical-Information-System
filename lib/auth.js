"use server";

import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { db } from "./dbConfig";
import { Users } from "./schema";

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

  return { success: true };
};
