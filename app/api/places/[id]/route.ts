// app/api/places/[id]/route.ts
import { NextResponse } from "next/server";
import db from "../../../config/db";
import { RowDataPacket } from "mysql2";

interface ReservationRow extends RowDataPacket {
  reservationDate: string;
  reservation_status_id: number;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const [rows] = await db.query<ReservationRow[]>(
      `SELECT reservationDate, reservation_status_id 
       FROM applicants 
       WHERE place = ? AND reservation_status_id IN 
       (SELECT id FROM reservation_status WHERE status IN ('Esperando pago', 'Reservado'))`,
      [id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    return NextResponse.json(
      { message: "Error al obtener reservas" },
      { status: 500 }
    );
  }
}
