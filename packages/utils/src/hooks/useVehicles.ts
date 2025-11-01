// /packages/utils/src/hooks/useVehicles.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchVehicles } from "../api/vehicle";
import type { Vehicle } from "@repo/types";

export function useVehicles() {
  const { data, error, isLoading } = useQuery<Vehicle[]>({
    queryKey: ["vehicleLocations"],
    queryFn: fetchVehicles,
    refetchInterval: 5000, // poll every 5s
  });

  const vehicles =
    data?.map((v) => ({
      id: v.id,
      name: v.name || v.id,
      lat: v.lat,
      lon: v.lng,
      speed: v.speed,
      status: v.status,
      timestamp: v.timestamp,
    })) ?? [];

  return { vehicles, isLoading, error };
}
