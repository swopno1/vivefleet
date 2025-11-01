"use client";

import { useQuery } from "@tanstack/react-query";

interface Vehicle {
  id: string;
  coords: { lat: number; lon: number };
  timestamp: string;
}

export function useVehicles() {
  const { data } = useQuery<Vehicle[]>({
    queryKey: ["vehicleLocations"],
    queryFn: async () => {
      const res = await fetch("/api/location-update");
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      return res.json();
    },
    refetchInterval: 5000, // poll every 5s
  });

  // Normalize result to ensure consistent shape
  return (
    data?.map((v) => ({
      id: v.id,
      name: v.id,
      lat: v.coords.lat,
      lon: v.coords.lon,
      timestamp: v.timestamp,
    })) || []
  );
}
