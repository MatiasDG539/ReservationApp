"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Applicant {
  id: number;
  place: string;
  dpto: string;
  ownerName: string;
  dayTime: string;
  createdAt: string;
  reservationDate: string;
  reservationStatus: string;
  updatedAt: string;
}

const ReservationTable: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicants = async () => {
    try {
      const response = await axios.get('/api/reservation');
      setApplicants(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los datos');
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: number, newStatus: string) => {
    try {
      await axios.patch(`/api/reservation/${id}`, { reservationStatus: newStatus });
      // Refrescar los datos después de la actualización
      fetchApplicants();
    } catch (err) {
      setError('Error al actualizar el estado');
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 sm:p-8 md:p-10 bg-gray-100 rounded-lg shadow-lg">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Detalles de reservas</CardTitle>
          <CardDescription className="text-base">
            Aquí se muestran todas las reservas realizadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-base">Lugar</TableHead>
                <TableHead className="text-base">Lote/Depto</TableHead>
                <TableHead className="text-base">Nombre</TableHead>
                <TableHead className="text-base">Horario</TableHead>
                <TableHead className="text-base">Creada</TableHead>
                <TableHead className="text-base">Fecha a reservar</TableHead>
                <TableHead className="text-base w-[150px]">Estado</TableHead>
                <TableHead className="text-base">Actualizada</TableHead>
                <TableHead className="text-base">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <TableRow key={applicant.id} className="text-base">
                    <TableCell>{applicant.place}</TableCell>
                    <TableCell>{applicant.dpto}</TableCell>
                    <TableCell>{applicant.ownerName}</TableCell>
                    <TableCell>{applicant.dayTime}</TableCell>
                    <TableCell>
                      {format(new Date(applicant.createdAt), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(applicant.reservationDate), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <select
                        value={applicant.reservationStatus}
                        onChange={(e) => updateReservationStatus(applicant.id, e.target.value)}
                      >
                        <option value="Esperando pago">Esperando pago</option>
                        <option value="Reservado">Reservado</option>
                        <option value="Realizado">Realizado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      {format(new Date(applicant.updatedAt), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm">
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>No hay reservas disponibles</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationTable;