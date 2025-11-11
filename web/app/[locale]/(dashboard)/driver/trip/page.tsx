'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  addTrip,
  updateTrip,
  addPosition,
  getUnsyncedPositions,
  markPositionsAsSynced,
} from '@/lib/db'
import { useSocket } from '@/lib/socket'

const TripPage = () => {
  const [isTripStarted, setIsTripStarted] = useState(false)
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 })
  const tripIdRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { socket, isConnected } = useSocket()
  const driverId = 'driver-1' // Mock driver ID for now

  const handleStartTrip = async () => {
    setIsTripStarted(true)
    const newTripId = await addTrip({ startTime: new Date() })
    tripIdRef.current = newTripId

    intervalRef.current = setInterval(() => {
      const newPosition = {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
      }
      setCurrentPosition(newPosition)
      if (tripIdRef.current) {
        addPosition({
          tripId: tripIdRef.current,
          ...newPosition,
          timestamp: new Date(),
        })
      }

      // Emit position update if connected
      if (isConnected) {
        socket.emit('position_update', {
          driverId,
          position: newPosition,
          tripId: tripIdRef.current,
        })
        console.log('Emitted position update:', newPosition)
      }
    }, 5000)
  }

  const handleStopTrip = () => {
    setIsTripStarted(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (tripIdRef.current) {
      updateTrip({ id: tripIdRef.current, endTime: new Date() })
    }
  }

  useEffect(() => {
    const syncData = async () => {
      console.log('Syncing data...')
      const unsynced = await getUnsyncedPositions()
      if (unsynced.length > 0) {
        try {
          const response = await fetch('/api/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(unsynced),
          })
          if (response.ok) {
            // const positionIds = unsynced.map((p) => p.id)
            const positionIds = unsynced
              .map((p) => p.id)
              .filter((id): id is number => id !== undefined)

            await markPositionsAsSynced(positionIds)
          } else {
            console.error('Failed to sync positions:', response.statusText)
          }
        } catch (error) {
          console.error('Error syncing positions:', error)
        }
      }
    }

    const handleOnline = () => {
      syncData()
    }

    window.addEventListener('online', handleOnline)

    // Initial sync on component mount
    syncData()

    return () => {
      window.removeEventListener('online', handleOnline)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div>
      <h1>Trip Page</h1>
      <p>Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleStartTrip}
          disabled={isTripStarted}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Start Trip
        </button>
        <button
          onClick={handleStopTrip}
          disabled={!isTripStarted}
          className="bg-red-500 text-white p-2 rounded"
        >
          Stop Trip
        </button>
      </div>
      <div>
        <h2>Live Coordinates</h2>
        <p>Latitude: {currentPosition.lat.toFixed(6)}</p>
        <p>Longitude: {currentPosition.lng.toFixed(6)}</p>
      </div>
    </div>
  )
}

export default TripPage
