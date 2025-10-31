export interface PositionUpdate {
  vehicleId: string;
  lat: number;
  lng: number;
  speed?: number;
  timestamp: number;
}
