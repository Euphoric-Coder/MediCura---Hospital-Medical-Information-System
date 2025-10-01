import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { Doctors } from "@/lib/schema";

export async function GET() {
  try {
    const data = await db.select().from(Doctors);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
