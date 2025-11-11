"use client";

import Map from "@/components/map";
import { VehicleTable } from "@/components/vehicle-table";
import { useFleetData, Vehicle } from "@/hooks/use-fleet-data";
import { useFleetSocket } from "@/hooks/use-fleet-socket";
import { useState } from "react";

export default function FleetDashboardPage() {
  useFleetSocket();
  const { data: vehicles, isLoading, error } = useFleetData();
  const [focusedVehicle, setFocusedVehicle] = useState<Vehicle | null>(null);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setFocusedVehicle(vehicle);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading vehicles</div>;

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h1 className="text-2xl font-bold">Fleet Dashboard</h1>
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">
          <Map
            initialCenter={[90.389, 23.811]}
            initialZoom={12}
            vehicles={vehicles?.map((v) => ({
              driverId: v.id,
              position: { lat: v.lat, lng: v.lng },
            }))}
            focusOn={
              focusedVehicle
                ? {
                    driverId: focusedVehicle.id,
                    position: {
                      lat: focusedVehicle.lat,
                      lng: focusedVehicle.lng,
                    },
                  }
                : undefined
            }
          />
        </div>
        <div className="col-span-1">
          <VehicleTable
            vehicles={vehicles || []}
            onVehicleClick={handleVehicleClick}
          />
        </div>
      </div>
    </div>
  );
}
