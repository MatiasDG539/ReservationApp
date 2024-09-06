import { NextResponse } from "next/server";
import db from "../../config/db"; // Importa la configuración de la base de datos

export async function GET() {
  try {
    // Realiza la consulta usando async/await
    const [results] = await db.query("SELECT * FROM applicants"); // Cambia 'test' por 'applicants'
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
    const data = await request.json(); // Obtiene los datos del cuerpo de la solicitud

    const { place, dpto, ownerName, dayTime, reservationDate } = data;

    // Inserta los datos en la tabla `applicants`
    const [result] = await db.query(
      "INSERT INTO applicants (place, dpto, ownerName, dayTime, reservationDate, createdAt, reservationStatus) VALUES (?, ?, ?, ?, ?, NOW(), ?)",
      [place, dpto, ownerName, dayTime, reservationDate, "Pending"]
    );

    // Devuelve una respuesta exitosa
    return NextResponse.json({ message: "Reserva guardada con éxito" });
  } catch (error) {
    console.error("Error al guardar la reserva:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
