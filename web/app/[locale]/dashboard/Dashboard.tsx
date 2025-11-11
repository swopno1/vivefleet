"use client";

import { useState, useEffect } from "react";
import DemoMap from "@/components/map";
import { VehicleTable } from "@/components/vehicle-table";
import { Vehicle } from "@/lib/types";
import { getSocket } from "@/lib/socket";

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Truck-001",
    driver: "Driver One",
    speed: 60,
    lastPing: new Date().toISOString(),
    status: "online",
    position: { lat: 31.2304, lng: 121.4737 },
  },
  {
    id: "2",
    name: "Van-002",
    driver: "Driver Two",
    speed: 0,
    lastPing: new Date().toISOString(),
    status: "idle",
    position: { lat: 31.2354, lng: 121.4787 },
  },
];

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [focusedVehicle, setFocusedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on("position_update", (data) => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v.id === data.vehicleId
            ? {
                ...v,
                position: { lat: data.lat, lng: data.lng },
                speed: data.speed,
                lastPing: data.ts,
                status: "online",
              }
            : v
        )
      );
    });

    return () => {
      socket.off("position_update");
    };
  }, []);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setFocusedVehicle(vehicle);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      <div className="lg:col-span-2">
        <DemoMap vehicles={vehicles} focusOn={focusedVehicle} />
      </div>
      <div>
        <VehicleTable vehicles={vehicles} onVehicleClick={handleVehicleClick} />
      </div>
    </div>
  );
}
