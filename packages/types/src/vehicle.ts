export interface Vehicle {
  id: string;
  name: string;
  plate_no: string;
  lat: number;
  lng: number;
  speed: number;
  status?: "idle" | "moving" | "offline";
  assignedDriverId?: string;
  timestamp?: string;
}
