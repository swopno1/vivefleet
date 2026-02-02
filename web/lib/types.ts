export interface Vehicle {
  id: string;
  name: string;
  driver: string;
  speed: number;
  lastPing: string;
  status: "online" | "idle" | "offline";
  position: {
    lat: number;
    lng: number;
  };
}

export interface VehiclePos {
  driverId: string;
  position: {
    lat: number;
    lng: number;
  };
}
