"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Vehicle {
  id: string;
  name: string;
  driver: string;
  speed: string;
  status: "Moving" | "Idle";
  lat: number;
  lng: number;
  lastPing: string;
}

const fetchVehicles = async (): Promise<Vehicle[]> => {
  const { data } = await api.get("/vehicles");
  return data;
};

export const useFleetData = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
    refetchInterval: 60000,
  });
};
