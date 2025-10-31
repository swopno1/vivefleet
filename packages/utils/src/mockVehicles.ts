import type { Vehicle } from "@repo/types";

export const vehicles: Vehicle[] = [
  {
    id: "v1",
    name: "Truck 1",
    plate_no: "BD-001",
    lat: 23.8103,
    lng: 90.4125,
    speed: 50,
    status: "moving",
    assignedDriverId: "d1",
  },
  {
    id: "v2",
    name: "Van 2",
    plate_no: "BD-002",
    lat: 23.815,
    lng: 90.42,
    speed: 40,
    status: "idle",
    assignedDriverId: "d2",
  },
];
