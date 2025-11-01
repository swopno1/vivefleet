export interface PositionUpdate {
  vehicleId: string;
  lat: number;
  lng: number;
  speed?: number;
  timestamp: number;
}

export interface BeidouCoord {
  lat: number;
  lon: number;
}

export interface WGS84Coord {
  lat: number;
  lon: number;
}
