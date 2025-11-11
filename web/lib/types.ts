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
}
