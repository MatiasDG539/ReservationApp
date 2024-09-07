import { NextResponse } from "next/server";
import db from "../../config/db";
import { RowDataPacket } from "mysql2";

interface PlaceRow extends RowDataPacket {
  id: number;
  name: string;
}

export async function GET() {
  try {
    const [rows] = await db.query<PlaceRow[]>("SELECT id, name FROM places");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener lugares:", error);
    return NextResponse.json(
      { message: "Error al obtener lugares" },
      { status: 500 }
    );
  }
}
