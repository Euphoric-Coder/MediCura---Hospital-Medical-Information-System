import { db } from "@/lib/dbConfig";
import { Appointments } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const { appointmentId, newDate, newTime } = await req.json();

  console.log("Pringting the reschedule data", appointmentId, newDate, newTime);

  await db
    .update(Appointments)
    .set({ date: newDate, time: newTime, updatedAt: new Date() })
    .where(eq(Appointments.id, appointmentId));

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
