// lib/types.ts

export interface Trip {
  id?: number // optional when adding, required when retrieved
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

export interface PageProps {
  params: Promise<{ locale: string }>
}

export interface PagePropsWithChildren extends PageProps {
  children: React.ReactNode
}

export interface VehiclePos {
  driverId: string
  position: {
    lat: number
    lng: number
  }
  tripId: number | null
}

export interface PushSubData {
  endpoint: string
  expirationTime: number | null
  keys: {
    p256dh: string
    auth: string
  }
}
