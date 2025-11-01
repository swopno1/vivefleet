"use client";

import { useVehicles } from "@repo/utils";
import { Loader2 } from "lucide-react";

export default function VehiclesPage() {
  const { vehicles, isLoading, error } = useVehicles();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-muted-foreground" size={28} />
      </div>
    );

  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Fleet Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="font-medium text-lg">{v.name}</div>
            <div className="text-sm text-muted-foreground">
              Lat: {v.lat.toFixed(4)} | Lon: {v.lon.toFixed(4)}
            </div>
            <div className="mt-2 text-sm">
              Status:{" "}
              <span
                className={
                  v.status === "moving"
                    ? "text-green-600"
                    : v.status === "idle"
                      ? "text-yellow-600"
                      : "text-gray-400"
                }
              >
                {v.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
