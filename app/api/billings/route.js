import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { Billings } from "@/lib/schema";

export async function POST(req) {
  try {
    const body = await req.json();

    // Insert data into Billings table
    const result = await db.insert(Billings).values(body);

    return NextResponse.json(
      { message: "Billing record created successfully", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Billing API Error:", error);
    return NextResponse.json(
      { error: "Failed to create billing record" },
      { status: 500 }
    );
  }
}
