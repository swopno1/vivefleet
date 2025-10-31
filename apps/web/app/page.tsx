"use client";

import FleetMap from "../components/FleetMap";
import { useVehicles } from "../hooks/useVehicles";

export default function Dashboard() {
  const vehicles = useVehicles();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">ViveFleet Dashboard</h1>
      <FleetMap vehicles={vehicles} />
    </main>
  );
}
