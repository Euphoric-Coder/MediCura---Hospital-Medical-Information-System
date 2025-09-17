import { db } from "@/lib/dbConfig";
import { Doctors } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    // completely clear all doctors
    await db.delete(Doctors);

    return NextResponse.json({
      message: "All doctors deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting doctors:", error);
    return NextResponse.json(
      { error: "Failed to delete doctors" },
      { status: 500 }
    );
  }
}
