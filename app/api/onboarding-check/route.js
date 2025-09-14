import { db } from "@/lib/dbConfig";
import {
  Users,
  Patients,
  Doctors,
  Pharmacists,
  Receptionists,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    // 1. Get user from Users
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUser = user[0];

    // 2. Check corresponding role table
    let onboarded = false;

    if (currentUser.role === "patient") {
      const patient = await db
        .select()
        .from(Patients)
        .where(eq(Patients.userId, currentUser.id))
        .limit(1);
      onboarded = patient[0]?.hasOnboarded ?? false;
    }

    if (currentUser.role === "doctor") {
      const doctor = await db
        .select()
        .from(Doctors)
        .where(eq(Doctors.userId, currentUser.id))
        .limit(1);
      onboarded = doctor[0]?.hasOnboarded ?? false;
    }

    if (currentUser.role === "pharmacist") {
      const pharmacist = await db
        .select()
        .from(Pharmacists)
        .where(eq(Pharmacists.userId, currentUser.id))
        .limit(1);
      onboarded = pharmacist[0]?.hasOnboarded ?? false;
    }

    if (currentUser.role === "receptionist") {
      const receptionist = await db
        .select()
        .from(Receptionists)
        .where(eq(Receptionists.userId, currentUser.id))
        .limit(1);
      onboarded = receptionist[0]?.hasOnboarded ?? false;
    }

    return NextResponse.json({
      role: currentUser.role,
      hasOnboarded: onboarded,
    });
  } catch (error) {
    console.error("Error checking onboarding:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
