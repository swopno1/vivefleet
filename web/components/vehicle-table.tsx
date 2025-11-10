"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Vehicle } from "@/hooks/use-socket-vehicles";

interface VehicleTableProps {
  vehicles: Vehicle[];
}

export function VehicleTable({ vehicles }: VehicleTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Driver</TableHead>
          <TableHead>Speed</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell>{vehicle.name}</TableCell>
            <TableCell>{vehicle.driver}</TableCell>
            <TableCell>{vehicle.speed}</TableCell>
            <TableCell>{vehicle.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
