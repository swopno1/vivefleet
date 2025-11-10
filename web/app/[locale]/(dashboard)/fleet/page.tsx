"use client";

import Map from "@/components/map";
import { VehicleTable } from "@/components/vehicle-table";
import { useSocketVehicles } from "@/hooks/use-socket-vehicles";

export default function FleetDashboardPage() {
  const vehicles = useSocketVehicles();

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h1 className="text-2xl font-bold">Fleet Dashboard</h1>
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">
          <Map vehicles={vehicles} />
        </div>
        <div className="col-span-1">
          <VehicleTable vehicles={vehicles} />
        </div>
      </div>
    </div>
  );
}
