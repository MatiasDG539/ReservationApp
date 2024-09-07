import { NextResponse } from "next/server";
import db from "../../config/db";

export async function GET() {
  try {
    const [results] = await db.query("SELECT * FROM applicants");
    console.log(results);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error al realizar la consulta:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { place, dpto, ownerName, dayTime, reservationDate } = data;

    const [result] = await db.query(
      "INSERT INTO applicants (place, dpto, ownerName, dayTime, reservationDate, createdAt, reservationStatus) VALUES (?, ?, ?, ?, ?, NOW(), ?)",
      [place, dpto, ownerName, dayTime, reservationDate, "Pending"]
    );

    return NextResponse.json({ message: "Reserva guardada con éxito" });
  } catch (error) {
    console.error("Error al guardar la reserva:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
