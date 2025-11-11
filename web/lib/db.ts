import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { Trip, Position } from './types'

export type TripInput = Omit<Trip, 'id'>
export type PositionInput = Omit<Position, 'id' | 'synced'>

export interface ViveFleetDBSchema extends DBSchema {
  trips: {
    key: number
    value: Trip
  }
  positions: {
    key: number
    value: Position
    indexes: { tripId: number }
  }
}

let db: IDBPDatabase<ViveFleetDBSchema> | null = null

export async function getDB() {
  if (!db) {
    db = await openDB<ViveFleetDBSchema>('ViveFleetDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('trips')) {
          const tripsStore = db.createObjectStore('trips', {
            keyPath: 'id',
            autoIncrement: true,
          })
        }
        if (!db.objectStoreNames.contains('positions')) {
          const positionsStore = db.createObjectStore('positions', {
            keyPath: 'id',
            autoIncrement: true,
          })
          positionsStore.createIndex('tripId', 'tripId')
        }
      },
    })
  }
  return db
}

export async function addTrip(trip: TripInput): Promise<number> {
  const db = await getDB()
  return db.add('trips', trip)
}

export async function updateTrip(trip: Pick<Trip, 'id'> & Partial<Trip>) {
  const db = await getDB()
  const tx = db.transaction('trips', 'readwrite')
  const store = tx.objectStore('trips')

  const existing = await store.get(trip.id!)
  if (existing) {
    Object.assign(existing, trip)
    await store.put(existing)
  }

  await tx.done
}

export async function addPosition(position: PositionInput): Promise<number> {
  const db = await getDB()
  return db.add('positions', { ...position, synced: false })
}

export async function getUnsyncedPositions(): Promise<Position[]> {
  const db = await getDB()
  const tx = db.transaction('positions', 'readonly')
  const store = tx.objectStore('positions')
  const all = await store.getAll()
  return all.filter((p) => !p.synced)
}

export async function markPositionsAsSynced(positionIds: number[]) {
  const db = await getDB()
  const tx = db.transaction('positions', 'readwrite')
  const store = tx.objectStore('positions')

  for (const id of positionIds) {
    const position = await store.get(id)
    if (position) {
      position.synced = true
      await store.put(position)
    }
  }

  await tx.done
}
