"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import axios from "axios";

export function ReservationFormSolar() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [showReservation, setShowReservation] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState<
    Record<string, boolean>
  >({});

  const selectedPlace = "Solar de Tafi"; // El lugar está definido directamente aquí.

  useEffect(() => {
    // Fetch reserved dates based on the fixed selected place
    const fetchReservedDates = async () => {
      try {
        const response = await axios.post("/api/reserved-dates", {
          place: selectedPlace,
        });
        const dates = response.data.map(
          (item: { reservationDate: string }) => new Date(item.reservationDate)
        );
        setReservedDates(dates);

        const availability: Record<string, boolean> = {};
        dates.forEach((date: Date) => {
          availability[format(date, "yyyy-MM-dd")] = true;
        });
        setAvailabilityStatus(availability);
      } catch (error) {
        console.error("Error al obtener las fechas reservadas:", error);
      }
    };

    fetchReservedDates();
  }, [selectedPlace]);

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post("/api/reservationSolar", {
        place: "Solar de Tafi",
        dpto: data.apartment,
        ownerName: data.name,
        dayTime: "Todo el dia",
        reservationDate: data.selectedDate,
        usageType: data.usageType,
      });

      toast.success("¡Reserva realizada con éxito!");
      setShowReservation(true);
    } catch (error) {
      console.error("Error al enviar la reserva:", error);
      toast.error("Error al realizar la reserva");
    }
  };

  const handleClose = () => {
    reset();
    setSelectedDate(undefined);
    setShowReservation(false);
  };

  const selectedUsageType = watch("selectedUsageType");
  const selectedTime = watch("selectedTime");
  const selectedDateFormatted = selectedDate
    ? format(selectedDate, "dd/MM/yyyy")
    : "Selecciona la fecha";

  return (
    <div className="relative">
      {!showReservation && (
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 md:p-10 bg-white rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Formulario De Reserva
              <p>Barrio Solar de Tafi</p>
            </CardTitle>
            <CardDescription className="text-base">
              Para realizar la reserva del SUM, por favor completa el
              formulario.
              <p>Les recordamos que los precios actuales son:</p>
              <ul className="text-center font-bold">
                <li>Propio: $35.000</li>
                <li>Tercero: $70.000</li>
              </ul>

              <p>En caso de no corresponder a uso propio, se aplicarán monto de uso de tercero por omisión.</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <Label htmlFor="place" className="text-base font-medium">
                  Lugar
                </Label>
                <Input
                  className="bg-white border border-gray-300 rounded-md p-2 text-base"
                  id="place"
                  defaultValue="Solar de Tafi"
                  readOnly
                  {...register("place")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apartment" className="text-base font-medium">
                  Lote/Depto
                </Label>
                <Input
                  className="bg-white border border-gray-300 rounded-md p-2 text-base"
                  id="apartment"
                  placeholder="Ingrese lote o depto"
                  {...register("apartment", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.selectedPlace?.message && (
                  <span className="text-red-500 text-sm">
                    {String(errors.selectedPlace.message)}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Nombre del solicitante
                </Label>
                <Input
                  className="bg-white border border-gray-300 rounded-md p-2 text-base"
                  id="name"
                  placeholder="Ingrese su nombre"
                  {...register("name", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.selectedPlace?.message && (
                  <span className="text-red-500 text-sm">
                    {String(errors.selectedPlace.message)}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className="text-base font-medium">
                  Tipo de uso
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white justify-between w-full"
                    >
                      <span className="text-base">
                        {watch("usageType") || "Selecciona un tipo de uso"}
                      </span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      className="text-base"
                      onSelect={() => setValue("usageType", "Propio")}
                    >
                      Propio
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-base"
                      onSelect={() => setValue("usageType", "Tercero")}
                    >
                      Tercero
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.usageType?.message && (
                  <span className="text-red-500 text-sm">
                    {String(errors.usageType.message)}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date" className="text-base font-medium">
                  Fecha a reservar
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white justify-between w-full"
                    >
                      <span className="text-base">{selectedDateFormatted}</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 max-w-[276px]">
                    <Calendar
                      reservedDates={reservedDates}
                      selected={selectedDate}
                      onDayClick={(date: Date) => {
                        setSelectedDate(date);
                        setValue("selectedDate", format(date, "yyyy-MM-dd"));
                      }}
                      mode="single"
                      modifiers={{
                        reserved: reservedDates,
                        available: (date) =>
                          !availabilityStatus[format(date, "yyyy-MM-dd")],
                      }}
                      modifiersClassNames={{
                        reserved: "bg-red-400 text-white",
                        available: "bg-green-200 text-black",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.selectedPlace?.message && (
                  <span className="text-red-500 text-sm">
                    {String(errors.selectedPlace.message)}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full text-base">
                Reservar
              </Button>
            </form>
          </CardContent>
          <div className="justify-center text-center border-t border-gray-200 pt-4 mt-4">
            <p className="text-base text-gray-600">
              © 2024 Reservation App. Todos los derechos reservados Estudio
              Jurídico Pillitteri & Asoc. - Designed By
              <a
                href="https://www.linkedin.com/in/matias-daniel-gutierrez/"
                className="text-blue-500 hover:underline"
              >
                {" "}
                Gutierrez Matias Daniel
              </a>
              .
            </p>
          </div>
        </Card>
      )}

      {showReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="max-w-md mx-auto p-6 sm:p-8">
            <div className="bg-[#00b894] w-full h-20 py-4 px-10 rounded-t-md">
              <div className="flex items-center justify-evenly">
                <CircleCheckIcon className="text-white text-2xl" />
                <p className="text-xl text-white font-bold">
                  Pre-Reserva Realizada
                </p>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="font-bold">Recibo De Pre-Reserva</CardTitle>
              <CardDescription className="text-base font-medium">
                Por favor enviar una captura de esta pantalla al administrador
                del lugar para confirmar la reserva, caso contrario la misma
                perderá validez pasadas las 24hs de realizada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="place" className="text-xl">
                    Lugar
                  </Label>
                  <p className="font-medium text-lg break-words">
                    Solar de Tafi
                  </p>
                </div>
                <div>
                  <Label htmlFor="apartment" className="text-xl">
                    Lote/Depto
                  </Label>
                  <p className="font-medium text-lg break-words">
                    {watch("apartment")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-xl">
                    Nombre
                  </Label>
                  <p className="font-medium text-lg break-words">
                    {watch("name")}
                  </p>
                </div>
                <div>
                  <Label htmlFor="time" className="text-xl">
                    Tipo de uso
                  </Label>
                  <p className="font-medium text-lg break-words">
                    {selectedUsageType}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-xl">
                    Fecha
                  </Label>
                  <p className="font-medium text-lg break-words">
                    {selectedDate
                      ? format(selectedDate, "dd/MM/yyyy")
                      : "No seleccionada"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="button" onClick={handleClose}>
                Cerrar
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

function CircleCheckIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={{ width: "40px", height: "40px" }}
    >
      <path
        d="M9 16.2L4.8 12 6.6 10.2 9 12.6 17.4 4.2 19.2 6l-10.2 10.2z"
        fill="currentColor"
      />
    </svg>
  );
}
