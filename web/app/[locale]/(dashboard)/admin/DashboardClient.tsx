'use client'

import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import MapView from '@/components/map/MapView'
import { useTranslations } from 'next-intl'
import { useSocket } from '@/lib/socket'
import { useEffect, useState } from 'react'
import { VehiclePos } from '@/lib/types'

export default function DashboardClient() {
  const t = useTranslations('AdminPage')
  const { socket, isConnected } = useSocket()
  const [vehicleData, setVehicleData] = useState<VehiclePos[]>([])

  useEffect(() => {
    if (isConnected) {
      socket.on('position_update', (data: VehiclePos) => {
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
      })
    }

    return () => {
      socket.off('position_update')
    }
  }, [isConnected, socket])

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
