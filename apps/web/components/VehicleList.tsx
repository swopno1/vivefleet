"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Vehicle } from "@repo/types";

interface VehicleListProps {
  vehicles: Vehicle[];
}

export default function VehicleList({ vehicles }: VehicleListProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "moving":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="rounded-xl border border-border shadow-sm p-4 mt-4 bg-card">
      <h2 className="text-lg font-semibold mb-3">Fleet Overview</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Plate No</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Speed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((v) => (
            <TableRow key={v.id}>
              <TableCell>{v.name}</TableCell>
              <TableCell>{v.plate_no}</TableCell>
              <TableCell>
                <Badge
                  className={`${getStatusColor(v.status)} text-white capitalize`}
                >
                  {v.status}
                </Badge>
              </TableCell>
              <TableCell>{v.speed} km/h</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
