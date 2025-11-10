import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface ViveFleetDBSchema extends DBSchema {
  trips: {
    key: number
    value: {
      id: number
      startTime: Date
      endTime?: Date
    }
  }
  positions: {
    key: number
    value: {
      id: number
      tripId: number
      lat: number
      lng: number
      timestamp: Date
      synced: boolean
    }
    indexes: { tripId: number }
  }
}

let db: IDBPDatabase<ViveFleetDBSchema>

async function getDB() {
  if (!db) {
    db = await openDB<ViveFleetDBSchema>('ViveFleetDB', 1, {
      upgrade(db) {
        const tripsStore = db.createObjectStore('trips', {
          keyPath: 'id',
          autoIncrement: true,
        })
        const positionsStore = db.createObjectStore('positions', {
          keyPath: 'id',
          autoIncrement: true,
        })
        positionsStore.createIndex('tripId', 'tripId')
      },
    })
  }
  return db
}

export async function addTrip(trip: { startTime: Date }) {
  const db = await getDB()
  return db.add('trips', trip)
}

export async function updateTrip(trip: { id: number; endTime: Date }) {
  const db = await getDB()
  const tx = db.transaction('trips', 'readwrite')
  const store = tx.objectStore('trips')
  const existingTrip = await store.get(trip.id)
  if (existingTrip) {
    Object.assign(existingTrip, trip)
    await store.put(existingTrip)
  }
  await tx.done
}

export async function addPosition(position: {
  tripId: number
  lat: number
  lng: number
  timestamp: Date
}) {
  const db = await getDB()
  return db.add('positions', { ...position, synced: false })
}

export async function getUnsyncedPositions() {
  const db = await getDB()
  const tx = db.transaction('positions', 'readonly')
  const store = tx.objectStore('positions')
  const positions = await store.getAll()
  return positions.filter((p) => !p.synced)
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
