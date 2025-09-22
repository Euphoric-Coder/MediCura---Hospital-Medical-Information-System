import { db } from "@/lib/dbConfig";
import { Appointments } from "@/lib/schema";


export async function POST(req) {
  try {
    const body = await req.json();
    const { patientId, doctorId, date, time, reason, notes } = body;

    const [newAppointment] = await db
      .insert(Appointments)
      .values({
        patientId,
        doctorId,
        date,
        time,
        reason,
        notes,
        status: "upcoming",
      })
      .returning();

    return new Response(JSON.stringify(newAppointment), { status: 201 });
  } catch (err) {
    console.error("Error booking appointment:", err);
    return new Response("Error booking appointment", { status: 500 });
  }
}
