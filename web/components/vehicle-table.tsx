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
  onVehicleClick: (vehicle: Vehicle) => void;
}

export function VehicleTable({
  vehicles,
  onVehicleClick,
}: VehicleTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Driver</TableHead>
          <TableHead>Speed</TableHead>
          <TableHead>Last Ping</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow
            key={vehicle.id}
            onClick={() => onVehicleClick(vehicle)}
            className="cursor-pointer"
          >
            <TableCell>{vehicle.name}</TableCell>
            <TableCell>{vehicle.driver}</TableCell>
            <TableCell>{vehicle.speed}</TableCell>
            <TableCell>
              {new Date(vehicle.lastPing).toLocaleTimeString()}
            </TableCell>
            <TableCell>{vehicle.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
