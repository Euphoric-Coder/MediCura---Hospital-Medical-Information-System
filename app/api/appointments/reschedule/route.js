import { db } from "@/db";
import { Appointments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const { appointmentId, newDate, newTime } = await req.json();
  await db
    .update(Appointments)
    .set({ date: newDate, time: newTime, updatedAt: new Date() })
    .where(eq(Appointments.id, appointmentId));

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
