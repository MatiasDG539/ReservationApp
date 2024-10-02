import { NextRequest, NextResponse } from "next/server";
import db from "../../config/db";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") || "";

  const query = `SELECT id, personName FROM person_solar WHERE id LIKE ?`;
  const values = [`%${search}%`]; // Utilizo LIKE para la búsqueda parcial

  try {
    const [rows] = await db.query(query, values);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al buscar en la base de datos:", error);
    return NextResponse.json(
      { error: "Error al buscar en la base de datos" },
      { status: 500 }
    );
  }
}
