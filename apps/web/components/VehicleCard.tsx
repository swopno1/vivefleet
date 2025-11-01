"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Vehicle } from "@repo/types";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="w-full md:w-64 border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {vehicle.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <strong>Plate:</strong> {vehicle.plate_no}
        </p>
        <p>
          <strong>Speed:</strong> {vehicle.speed} km/h
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`capitalize ${
              vehicle.status === "moving"
                ? "text-green-600"
                : vehicle.status === "idle"
                  ? "text-yellow-600"
                  : "text-gray-500"
            }`}
          >
            {vehicle.status}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
