import { NextResponse } from "next/server";
import db from "../../config/db";

export async function GET() {
  try {
    // Obtener todas las reservas
    const [rows]: [any[], any] = await db.query("SELECT * FROM applicants");
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching reservations" },
      { status: 500 }
    );
  }
}

// Manejar solicitudes POST
export async function POST(request: Request) {
  const { place, dpto, ownerName, dayTime, reservationDate } = await request.json();

  if (!place || !reservationDate) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    // Verificar si ya existe una reserva activa para el mismo lugar y fecha
    const [existingReservations]: [any[], any] = await db.query(
      "SELECT * FROM applicants WHERE place = ? AND reservationDate = ? AND reservationStatus IN (?, ?)",
      [place, reservationDate, "Esperando pago", "Reservado"]
    );

    if (existingReservations.length > 0) {
      return NextResponse.json(
        { error: "A reservation already exists for this place and date" },
        { status: 400 }
      );
    }

    // Insertar nueva reserva
    await db.query(
      "INSERT INTO applicants (place, dpto, ownerName, dayTime, reservationDate, reservationStatus) VALUES (?, ?, ?, ?, ?, ?)",
      [place, dpto, ownerName, dayTime, reservationDate, "Esperando pago"]
    );

    return NextResponse.json({ message: "Reservation created successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating reservation" },
      { status: 500 }
    );
  }
}
