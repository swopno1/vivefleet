'use client'

import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import MapView from '@/components/map'
import { useTranslations } from 'next-intl'
import { socket } from '@/lib/socket'
import { useEffect, useState } from 'react'
import { VehiclePos } from '@/lib/types'

export default function DashboardClient() {
  const t = useTranslations('AdminPage')
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [vehicleData, setVehicleData] = useState<VehiclePos[]>([])

  useEffect(() => {
    socket.connect()

    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (isConnected) {
      const handlePositionUpdate = (data: VehiclePos) => {
        setVehicleData((prevData) => {
          const existingVehicleIndex = prevData.findIndex(
            (v) => v.driverId === data.driverId
          )

          if (existingVehicleIndex !== -1) {
            const updatedData = [...prevData]
            updatedData[existingVehicleIndex] = data
            return updatedData
          } else {
            return [...prevData, data]
          }
        })
      }
      socket.on('position_update', handlePositionUpdate)

      return () => {
        socket.off('position_update', handlePositionUpdate)
      }
    }
  }, [isConnected])

  return (
    <>
      <div className="px-4 lg:px-6">
        <h1>{t('title')}</h1>
        <p>Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      </div>

      <div className="px-4 lg:px-6 mt-4">
        <MapView vehicles={vehicleData} />
      </div>

      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={vehicleData} />
    </>
  )
}
