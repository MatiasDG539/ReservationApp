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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Detalles de reservas</CardTitle>
          <CardDescription>Aquí se muestran todas las reservas realizadas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Lugar</TableHead>
                <TableHead>Lote/Depto</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="w-[150px]">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Pinar II</TableCell>
                <TableCell>101</TableCell>
                <TableCell>Martin Pillitteri</TableCell>
                <TableCell>Noche</TableCell>
                <TableCell>25/10/2024</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                      Esperando pago
                        <ChevronDownIcon className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Esperando pago</DropdownMenuItem>
                      <DropdownMenuItem>Reservado</DropdownMenuItem>
                      <DropdownMenuItem>Realizado</DropdownMenuItem>
                      <DropdownMenuItem>Cancelado</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Salta 565</TableCell>
                <TableCell>2B</TableCell>
                <TableCell>Noelia Cisneros</TableCell>
                <TableCell>Mañana</TableCell>
                <TableCell>18/09/2024</TableCell>
                <TableCell>
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                      Reservado
                        <ChevronDownIcon className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Esperando pago</DropdownMenuItem>
                      <DropdownMenuItem>Reservado</DropdownMenuItem>
                      <DropdownMenuItem>Realizado</DropdownMenuItem>
                      <DropdownMenuItem>Cancelado</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Laprida 735</TableCell>
                <TableCell>3A</TableCell>
                <TableCell>Ruth Vera</TableCell>
                <TableCell>Noche</TableCell>
                <TableCell>02/09/2024</TableCell>
                <TableCell>
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                      Realizado
                        <ChevronDownIcon className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Esperando pago</DropdownMenuItem>
                      <DropdownMenuItem>Reservado</DropdownMenuItem>
                      <DropdownMenuItem>Realizado</DropdownMenuItem>
                      <DropdownMenuItem>Cancelado</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Labradores</TableCell>
                <TableCell>109</TableCell>
                <TableCell>Solana Ruiz</TableCell>
                <TableCell>Noche</TableCell>
                <TableCell>12/09/2024</TableCell>
                <TableCell>
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                      Cancelado
                        <ChevronDownIcon className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Esperando pago</DropdownMenuItem>
                      <DropdownMenuItem>Reservado</DropdownMenuItem>
                      <DropdownMenuItem>Realizado</DropdownMenuItem>
                      <DropdownMenuItem>Cancelado</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
