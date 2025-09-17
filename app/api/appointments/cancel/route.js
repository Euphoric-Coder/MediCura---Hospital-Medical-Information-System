import { db } from "@/db";
import { Appointments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const { appointmentId, reason } = await req.json();
  await db
    .update(Appointments)
    .set({ status: "cancelled", notes: reason, updatedAt: new Date() })
    .where(eq(Appointments.id, appointmentId));

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
