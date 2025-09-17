// app/api/fetch/doctors/route.js
import { db } from "@/lib/dbConfig";
import { Doctors } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all doctors
    const doctors = await db.select().from(Doctors);

    return NextResponse.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
