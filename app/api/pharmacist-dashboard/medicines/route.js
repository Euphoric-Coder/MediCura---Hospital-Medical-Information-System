// app/api/medicines/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { Medicines } from "@/lib/schema";

export async function GET() {
  try {
    const medicines = await db.select().from(Medicines);

    // Transform into alert format
    const alerts = medicines
      .map((med) => {
        let alertType = null;
        if (parseInt(med.quantity) <= parseInt(med.minStockLevel))
          alertType = "low-stock";
        if (
          new Date(med.expiryDate) <=
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        )
          alertType = "expiring-soon";
        if (new Date(med.expiryDate) < new Date()) alertType = "expired";

        return alertType
          ? {
              id: med.id,
              medication: med.name,
              currentStock: med.quantity,
              minLevel: med.minStockLevel,
              expiryDate: med.expiryDate,
              alertType,
            }
          : null;
      })
      .filter(Boolean);

    return NextResponse.json(alerts);
  } catch (err) {
    console.error("Error fetching medicines:", err);
    return NextResponse.json(
      { error: "Failed to fetch inventory alerts" },
      { status: 500 }
    );
  }
}
