import { NextResponse } from "next/server";
import db from "../../config/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { place } = data;

    if (!place) {
      return NextResponse.json(
        { message: "El parámetro 'place' es requerido" },
        { status: 400 }
      );
    }

    const [results] = await db.query(
      `SELECT a.reservationDate
       FROM applicants a
       JOIN places p ON a.place = p.name
       WHERE p.name = ? AND a.reservationStatus IN ('Reservado', 'Esperando pago')`,
      [place]
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error al realizar la consulta:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
