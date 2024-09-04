"use client"

import { useForm } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

export function ReservationForm() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [showReservation, setShowReservation] = useState(false);

  const onSubmit = data => {
    console.log(data);
    setShowReservation(true);
  };

  const selectedPlace = watch('selectedPlace');
  const selectedTime = watch('selectedTime');
  const selectedDate = watch('selectedDate');

  return (
    <div className="relative">
      {!showReservation && (
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 md:p-10">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Formulario De Reserva</CardTitle>
            <CardDescription>Para realizar la reserva del SUM, por favor completa el formulario.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <Label htmlFor="place" className="text-sm font-medium">Selecciona el lugar</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between w-full">
                      <span>{selectedPlace || 'Selecciona un lugar'}</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onSelect={() => setValue('selectedPlace', 'Pinar II')}>Pinar II</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setValue('selectedPlace', 'Solar De Tafi')}>Solar De Tafi</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setValue('selectedPlace', 'Salta 565')}>Salta 565</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setValue('selectedPlace', 'Laprida 735')}>Laprida 735</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setValue('selectedPlace', 'Junin 861')}>Junin 861</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apartment" className="text-sm font-medium">Lote/Depto</Label>
                <Input id="apartment" placeholder="Ingrese lote o depto" {...register('apartment')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">Nombre del solicitante</Label>
                <Input id="name" placeholder="Ingrese su nombre" {...register('name')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className="text-sm font-medium">Horario de realización</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between w-full">
                      <span>{selectedTime || 'Selecciona el horario'}</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onSelect={() => setValue('selectedTime', 'Mañana')}>Mañana</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setValue('selectedTime', 'Tarde')}>Tarde</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setValue('selectedTime', 'Noche')}>Noche</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date" className="text-sm font-medium">Fecha a reservar</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between w-full">
                      <span>{selectedDate || 'Selecciona la fecha'}</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 max-w-[276px]">
                    <Calendar selectedDate={selectedDate} onDateChange={date => setValue('selectedDate', date)} />
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" className="w-full">Reservar</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {showReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="max-w-md mx-auto p-6 sm:p-8">
            <div className="bg-[#00b894] py-4 px-6 rounded-t-md">
              <div className="flex items-center gap-2">
                <CircleCheckIcon className="text-white text-2xl" />
                <p className="text-white font-medium">Pre-Reserva Realizada</p>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Recibo De Reserva</CardTitle>
              <CardDescription>Por favor enviar una captura de esta pantalla al administrador del lugar para confirmar la reserva, caso contrario la misma perderá validez pasadas las 24hs de realizada.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="place">Lugar</Label>
                  <div className="font-medium">{selectedPlace}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apartment">Lote/Depto</Label>
                  <div className="font-medium">{watch('apartment')}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <div className="font-medium">{watch('name')}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <div className="font-medium">{selectedTime}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <div className="font-medium">{selectedDate}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setShowReservation(false)}>
                Confirmar
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
