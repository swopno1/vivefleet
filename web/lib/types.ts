export interface User {
  id: string
  email: string
  username: string
  role: 'admin' | 'driver' | 'fleet'
  publicKey: string
  createdAt: Date
}

export type VehiclePos = {
  driverId: string
  position: {
    lat: number
    lng: number
  }
  tripId?: number
}

export interface Trip {
  id?: number
  startTime: Date
  endTime?: Date
}

export interface Position {
  id?: number
  tripId: number
  lat: number
  lng: number
  timestamp: Date
  synced: boolean
}
