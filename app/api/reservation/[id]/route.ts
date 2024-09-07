import { NextResponse } from "next/server";
import db from "../../../config/db";
import { ResultSetHeader } from 'mysql2';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { reservationStatus } = await request.json();

  try {
    const [results] = await db.query<ResultSetHeader>(
      "UPDATE applicants SET reservationStatus = ?, updatedAt = NOW() WHERE id = ?",
      [reservationStatus, id]
    );

    // Verificar si se actualizó alguna fila
    if (results.affectedRows > 0) {
      return NextResponse.json({ message: "Estado actualizado" });
    } else {
      return NextResponse.json(
        { message: "Reserva no encontrada" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
    return NextResponse.error();
  }
}