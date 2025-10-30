export interface Vehicle {
  id: string;
  name: string;
  plate_no: string;
  user_id: string;
}

export interface Position {
  id: string;
  trip_id: string;
  lat: number;
  lon: number;
  timestamp: string;
}
