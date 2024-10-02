"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

interface Lote {
  id: number;
  personName: string;
}

export function ReservationFormSolar() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [search, setSearch] = useState("");
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [pdfLink, setPdfLink] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState<
    Record<string, boolean>
  >({});

  const selectedPlace = "Solar de Tafi";

  useEffect(() => {
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

    const fetchLotes = async () => {
      if (search.length > 0) {
        try {
          const { data } = await axios.get(`/api/searchLote?search=${search}`);
          setLotes(data); // Asignar el resultado de la búsqueda al estado tipado
          setShowResults(data.length > 0); // Mostrar resultados solo si hay lotes encontrados
        } catch (error) {
          console.error("Error fetching lotes:", error);
        }
      } else {
        setLotes([]);
        setShowResults(false); // Ocultar resultados si no hay búsqueda
      }
    };
    fetchLotes();
    fetchReservedDates();
  }, [selectedPlace, search]);

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

  const generatePDF = async () => {
    const input = document.getElementById("pdf-content");
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = 120;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const positionX = (pageWidth - imgWidth) / 2;
    const contentYPosition = 20;

    pdf.setFillColor(240, 240, 240);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    pdf.addImage(
      imgData,
      "PNG",
      positionX,
      contentYPosition,
      imgWidth,
      imgHeight
    );

    const whiteSpaceY = contentYPosition + imgHeight;

    const whiteSpaceHeight = 100;
    pdf.setFillColor(255, 255, 255);
    pdf.rect(positionX, whiteSpaceY, imgWidth, whiteSpaceHeight, "F");

    const logoWidth = 100;
    const logoHeight = 100;
    const logoX = positionX + (imgWidth - logoWidth) / 2;
    const logoY = whiteSpaceY + 2;

    const logoUrl = "/client-logo.png";
    const logoImg = new Image();
    logoImg.src = logoUrl;
    await new Promise((resolve) => {
      logoImg.onload = resolve;
    });

    pdf.addImage(logoImg, "PNG", logoX, logoY, logoWidth, logoHeight);

    pdf.save("recibo_de_reserva.pdf");
  };

  const handleLoteSelection = (lote: Lote) => {
    setSelectedLote(lote); // Asignar el lote seleccionado
    setSearch(lote.id.toString()); // Establecer el campo de búsqueda con el id del lote seleccionado
    setValue("apartment", lote.id.toString()); // Actualizar el valor del campo 'apartment'
    setValue("name", lote.personName); // Actualizar el valor del campo 'name'
    setShowResults(false); // Ocultar resultados de búsqueda
  };

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
            </CardDescription>
            <CardDescription className="text-base">
              Les recordamos que los precios actuales son:
            </CardDescription>
            <ul className="text-center font-bold">
              <li>Propio: $35.000</li>
              <li>Tercero: $70.000</li>
            </ul>
            <CardDescription className="text-base">
              En caso de no corresponder a uso propio, se aplicarán monto de uso
              de tercero por omisión.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <Label htmlFor="apartment" className="text-base font-medium">
                  Lote
                </Label>
                <Input
                  className="bg-white border border-gray-300 rounded-md p-2 text-base"
                  id="apartment"
                  placeholder="Ingrese lote o depto"
                  {...register("apartment", {
                    required: "Este campo es obligatorio",
                  })}
                  onChange={(e) => setSearch(e.target.value)} // Actualiza el valor de búsqueda
                  value={search} // Mantener el valor del input sincronizado
                />
                {showResults && lotes.length > 0 && (
                  <ul className="mt-2 border border-gray-300 rounded-md">
                    {lotes.map((lote) => (
                      <li
                        key={lote.id}
                        className="text-gray-700 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                        onClick={() => handleLoteSelection(lote)} // Al seleccionar un lote
                      >
                        {lote.id} - {lote.personName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Nombre del solicitante
                </Label>
                <Input
                  className="bg-gray-100 border border-gray-300 rounded-md p-2 text-base"
                  id="name"
                  value={selectedLote ? selectedLote.personName : ""}
                  readOnly
                  {...register("name")}
                />
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
            <div id="pdf-content">
              <div className="bg-[#00b894] w-full h-20 py-4 px-10 rounded-t-md">
                <div className="flex items-center justify-evenly">
                  <CircleCheckIcon className="text-white text-2xl" />
                  <p className="text-xl text-white font-bold">
                    Reserva Realizada
                  </p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="font-bold">Recibo De Reserva</CardTitle>
                <CardDescription className="text-base font-medium">
                  Reserva realizada con éxito!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-10">
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
                <div className="grid grid-cols-2 gap-10">
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
                      {watch("usageType")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-10">
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
            </div>
            <CardFooter className="flex flex-col items-center">
              <div className="mb-2 text-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    generatePDF();
                  }}
                  className="text-blue-500 underline mb-2 hover:text-blue-700"
                >
                  Descargar recibo
                </a>
              </div>
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
      viewBox="0 0 20 20"
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
