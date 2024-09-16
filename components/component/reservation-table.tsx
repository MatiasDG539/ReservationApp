"use client";

import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Componente ReservationStatus con lógica de confirmación para cancelación
const ReservationStatus: React.FC<{
  id: number;
  currentStatus: string;
  reservationDate: string;
  updateReservationStatus: (id: number, status: string) => void;
}> = ({ id, currentStatus, reservationDate, updateReservationStatus }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  // Determina si la fecha ya ha pasado o si el estado actual es "Cancelado"
  const isDatePassed = new Date(reservationDate) < new Date();
  const isStatusCanceled = currentStatus === "Cancelado";

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      if (newStatus === "Cancelado") {
        setIsAlertOpen(true);
        setPendingStatus(newStatus);
      } else if (!isDatePassed && !isStatusCanceled) {
        updateReservationStatus(id, newStatus);
        toast.success("¡Estado actualizado con éxito!");
      }
    },
    [id, updateReservationStatus, isDatePassed, isStatusCanceled]
  );

  return (
    <>
      <Select
        value={currentStatus}
        onValueChange={handleStatusChange}
        disabled={isDatePassed || isStatusCanceled}
      >
        <SelectTrigger className="w-[180px] bg-transparent border-none text-gray-700 focus:outline-none">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Esperando pago">Esperando pago</SelectItem>
          <SelectItem value="Reservado">Reservado</SelectItem>
          <SelectItem value="Realizado">Realizado</SelectItem>
          <SelectItem value="Cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cambiará el estado de la reserva a "Cancelado". Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingStatus) {
                  updateReservationStatus(id, pendingStatus);
                  toast.success("¡Estado actualizado con éxito!");
                }
                setIsAlertOpen(false);
              }}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Componente principal de la tabla de reservas
const ReservationTable: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [places, setPlaces] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>("place");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [selectedPlace, setSelectedPlace] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    applyFilters(applicants);
  }, [selectedPlace, selectedStatus, applicants]);

  const fetchApplicants = async () => {
    try {
      const response = await axios.get("/api/reservation");
      const data: Applicant[] = response.data;
      setApplicants(data);
      setFilteredApplicants(data);

      const uniquePlaces = [
        ...new Set(data.map((applicant) => applicant.place)),
      ];
      setPlaces(uniquePlaces);

      const uniqueStatus = [
        ...new Set(data.map((applicant) => applicant.reservationStatus)),
      ];
      setStatus(uniqueStatus);

      setLoading(false);
    } catch (err) {
      setError("Error al cargar los datos");
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: number, newStatus: string) => {
    try {
      await axios.patch(`/api/reservation/${id}`, {
        reservationStatus: newStatus,
      });
      const updatedApplicants = applicants.map((applicant) =>
        applicant.id === id
          ? {
              ...applicant,
              reservationStatus: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : applicant
      );
      setApplicants(updatedApplicants);
      applyFilters(updatedApplicants);
    } catch (err) {
      setError("Error al actualizar el estado");
    }
  };

  const applyFilters = (data: Applicant[]) => {
    let filteredData = data;

    if (selectedPlace) {
      filteredData = filteredData.filter(
        (applicant) => applicant.place === selectedPlace
      );
    }

    if (selectedStatus) {
      filteredData = filteredData.filter(
        (applicant) => applicant.reservationStatus === selectedStatus
      );
    }

    setFilteredApplicants(filteredData);
  };

  const handlePlaceSelect = (place: string) => {
    setSelectedPlace(place);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
  };

  const sortData = (column: keyof Applicant) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedData = [...filteredApplicants].sort((a, b) => {
      if (a[column] < b[column]) return newSortOrder === "asc" ? -1 : 1;
      if (a[column] > b[column]) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setSortColumn(column);
    setSortOrder(newSortOrder);
    setFilteredApplicants(sortedData);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getSortIndicator = (column: string) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "";
  };

  return (
    <div className="max-w-full mx-auto p-6 sm:p-8 md:p-10 bg-gray-100 rounded-lg shadow-lg">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <div>
              <CardTitle className="text-3xl">Detalles de reservas</CardTitle>
              <CardDescription className="text-base">
                Aquí se muestran todas las reservas realizadas.
              </CardDescription>
              <div className="mt-2 text-gray-700">
                Filtros activos:{" "}
                {selectedPlace ? <span>Lugar: {selectedPlace}</span> : null}
                {selectedStatus ? (
                  <span className={`ml-4 ${!selectedPlace ? "font-bold" : ""}`}>
                    Estado: {selectedStatus}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto">Filtrar por lugar</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-10">
                  <DropdownMenuItem onClick={() => handlePlaceSelect("")}>
                    Todos los lugares
                  </DropdownMenuItem>
                  {places.map((place) => (
                    <DropdownMenuItem
                      key={place}
                      onClick={() => handlePlaceSelect(place)}
                    >
                      {place}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-5">Filtrar por estado</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-10">
                  <DropdownMenuItem onClick={() => handleStatusSelect("")}>
                    Todos los estados
                  </DropdownMenuItem>
                  {status.map((reservationStatus) => (
                    <DropdownMenuItem
                      key={reservationStatus}
                      onClick={() => handleStatusSelect(reservationStatus)}
                    >
                      {reservationStatus}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <div className="max-h-[620px] overflow-y-auto custom-scrollbar">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="sticky-header">
                    <TableHead className="text-base bg-gray-100">
                      Lugar
                    </TableHead>
                    <TableHead className="text-base bg-gray-100">
                      Lote/Depto
                    </TableHead>
                    <TableHead className="text-base bg-gray-100">
                      Nombre
                    </TableHead>
                    <TableHead className="text-base bg-gray-100">
                      Horario
                    </TableHead>
                    <TableHead className="text-base bg-gray-100">
                      Creada
                    </TableHead>
                    <TableHead
                      className="text-base bg-yellow-100/[0.6]"
                      onClick={() => sortData("reservationDate")}
                    >
                      Fecha a reservar {getSortIndicator("reservationDate")}
                    </TableHead>
                    <TableHead className="text-base w-[150px] bg-gray-100">
                      Estado
                    </TableHead>
                    <TableHead className="text-base bg-gray-100">
                      Actualizada
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplicants.length > 0 ? (
                    filteredApplicants.map((applicant) => (
                      <TableRow
                        key={applicant.id}
                        className={`${
                          applicant.reservationStatus === "Cancelado"
                            ? "bg-red-100"
                            : applicant.reservationStatus === "Reservado"
                            ? "bg-green-100"
                            : applicant.reservationStatus === "Realizado"
                            ? "bg-blue-100"
                            : ""
                        } text-base`}
                      >
                        <TableCell>{applicant.place}</TableCell>
                        <TableCell>{applicant.dpto}</TableCell>
                        <TableCell>{applicant.ownerName}</TableCell>
                        <TableCell>{applicant.dayTime}</TableCell>
                        <TableCell>
                          {format(
                            new Date(applicant.createdAt),
                            "dd/MM/yyyy HH:mm:ss"
                          )}
                        </TableCell>
                        <TableCell className="bg-yellow-100/[0.6]">
                          {format(
                            new Date(applicant.reservationDate),
                            "dd/MM/yyyy"
                          )}
                        </TableCell>
                        <TableCell>
                          <ReservationStatus
                            id={applicant.id}
                            currentStatus={applicant.reservationStatus}
                            reservationDate={applicant.reservationDate}
                            updateReservationStatus={updateReservationStatus}
                          />
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(applicant.updatedAt),
                            "dd/MM/yyyy HH:mm:ss"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8}>
                        No hay reservas disponibles.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <div className="justify-center text-center pt-4 pb-4 mt-4">
          <p className="text-base text-gray-600">
            © 2024 Reservation App. Todos los derechos reservados Estudio
            Jurídico Pillitteri & Asoc. - Designed By
            <a
              href="https://www.linkedin.com/in/matias-daniel-gutierrez-2a6a171a7/"
              className="text-blue-500 hover:underline"
            >
              {" "}
              Gutierrez Matias Daniel
            </a>
            .
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ReservationTable;
