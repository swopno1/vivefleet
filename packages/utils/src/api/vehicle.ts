// /packages/utils/src/api/vehicle.ts
import { apiClient } from "./client";
import type { Vehicle } from "@repo/types";

export async function fetchVehicles(): Promise<Vehicle[]> {
  return apiClient<Vehicle[]>("/api/location-update");
}

export async function fetchVehicleById(id: string): Promise<Vehicle> {
  return apiClient<Vehicle>(`/api/vehicle/${id}`);
}
