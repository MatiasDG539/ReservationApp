import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { place, apartment, name, dayTime, reservationDate } = body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "no.reply.pillitteri@gmail.com",
      to: "gutierrezmatiasdaniel539@gmail.com",
      subject: `RESERVA REALIZADA - ${place.toUpperCase()}`,
      html: `

        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
             <h1>Se ha realizado una nueva reserva!</h1>
             <p style="font-size: 16px; margin-bottom: 10px;">Detalles de la reserva:</p>
             <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 10px;">
               <li style="font-size: 16px;"><strong>Lugar: </strong>${place}</li>
               <li style="font-size: 16px;"><strong>Lote/Depto: </strong>${apartment}</li>
               <li style="font-size: 16px;"><strong>Nombre: </strong>${name}</li>
               <li style="font-size: 16px;"><strong>Horario: </strong>${dayTime}</li>
               <li style="font-size: 16px;"><strong>Fecha: </strong>${reservationDate}</li>
             </ul>
             
             <p style="font-size: 16px;">Este es un mensaje automático, por favor no responder</p>
             
        </div>   
             `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: %s", info.messageId);

    return NextResponse.json(
      { message: "Correo enviado con éxito" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return NextResponse.json(
      { error: "Error al enviar el correo", details: error },
      { status: 500 }
    );
  }
}
