"use client";

import DashboardMap from "@/components/DashboardMap";
import VehicleList from "@/components/VehicleList";
import VehicleCard from "@/components/VehicleCard";
import { useVehicles } from "@/hooks/useVehicles";
import { vehicles as demoVehicles } from "@repo/utils";

export default function DashboardClient() {
  const liveVehicles = useVehicles();
  const data = liveVehicles.length ? liveVehicles : demoVehicles;

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {data.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
      <DashboardMap vehicles={data} />
      <VehicleList vehicles={data} />
    </div>
  );
}
