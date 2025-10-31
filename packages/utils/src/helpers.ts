import type { Vehicle } from "@repo/types";

export function formatVehicleName(vehicle: Vehicle): string {
  return `${vehicle.name} (${vehicle.plate_no})`;
}
