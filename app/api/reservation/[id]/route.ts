import { NextResponse } from "next/server";
import db from "../../../config/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { reservationStatus } = await request.json();

  if (!reservationStatus) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  try {
    // Obtener la reserva actual
    const [rows]: [any[], any] = await db.query(
      "SELECT place, reservationDate, reservationStatus FROM applicants WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    const {
      place,
      reservationDate,
      reservationStatus: currentStatus,
    } = rows[0];

    // Verificar si la fecha de la reserva ya pasó
    if (new Date(reservationDate) < new Date()) {
      return NextResponse.json(
        { error: "Cannot modify reservation: the date has passed" },
        { status: 400 }
      );
    }

    // Actualizar el estado y disponibilidad
    if (reservationStatus === "Cancelado") {
      await db.query(
        "UPDATE applicants SET reservationStatus = ?, isAvailable = TRUE WHERE id = ?",
        [reservationStatus, id]
      );
    } else {
      await db.query(
        "UPDATE applicants SET reservationStatus = ? WHERE id = ?",
        [reservationStatus, id]
      );
    }

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating status" },
      { status: 500 }
    );
  }
}
