"use client";

import FleetMap from "@/components/FleetMap";
import { useVehicles } from "@/hooks/useVehicles";

export default function DriverPage() {
  const vehicles = useVehicles();

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Driver Mode</h2>
      <p>GPS/Beidou streaming coming soon.</p>
      <FleetMap vehicles={vehicles} />
    </div>
  );
}
