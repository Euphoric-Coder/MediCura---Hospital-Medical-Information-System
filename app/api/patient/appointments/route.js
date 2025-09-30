import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { Appointments } from "@/lib/schema";

export async function GET() {
  try {
    const data = await db.select().from(Appointments);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
