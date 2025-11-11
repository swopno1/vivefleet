'use client'

import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useTranslations } from 'next-intl'
import { VehiclePos } from '@/lib/types'

type DemoMapProps = {
  /** Center for initial view [lng, lat] */
  initialCenter?: [number, number]
  initialZoom?: number
  vehicles: VehiclePos[]
  focusOn?: VehiclePos
}

// Placeholder: convert Beidou coords (BD09/other) to WGS84 for Map display.
// Replace with proper algorithm when you have accurate Beidou input format.
function beidouToWGS84(lat: number, lng: number) {
  // This is a no-op placeholder — adjust with proper conversion if needed.
  return { lat, lng }
}

export default function DemoMap({
  initialCenter = [121.4737, 31.2304], // Shanghai as fallback [lng, lat]
  initialZoom = 8,
  vehicles = [],
}: DemoMapProps) {
  const t = useTranslations ? useTranslations('DemoMap') : (k: string) => k
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Record<string, maplibregl.Marker>>({})

  // Initialize MapLibre map
  useEffect(() => {
    if (!mapContainer.current) return
    if (mapRef.current) return // already initialized

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
          },
        ],
      },
      center: initialCenter as [number, number],
      zoom: initialZoom,
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [initialCenter, initialZoom])

  // Add/update marker for a vehicle
  function upsertMarker(v: VehiclePos) {
    const map = mapRef.current
    if (!map) return

    const {
      position: { lat, lng },
      driverId,
    } = v
    const coord = beidouToWGS84(lat, lng)
    const key = driverId

    // If marker exists, update position
    if (markersRef.current[key]) {
      const marker = markersRef.current[key]
      const from = marker.getLngLat()
      const to: [number, number] = [coord.lng, coord.lat]

      const start = performance.now()
      const duration = 1000

      function animate() {
        const now = performance.now()
        const time = Math.min(1, (now - start) / duration)
        const easedTime = 0.5 - 0.5 * Math.cos(time * Math.PI)

        const lng = from.lng + (to[0] - from.lng) * easedTime
        const lat = from.lat + (to[1] - from.lat) * easedTime

        marker.setLngLat([lng, lat])

        if (time < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)

      // update popup if exists
      const el = markersRef.current[key].getElement()
      el.setAttribute('title', `${driverId}`)
    } else {
      // create DOM element for marker
      const el = document.createElement('div')
      el.className =
        'w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center'
      el.style.background = 'linear-gradient(180deg, #06b6d4, #0ea5a0)'
      el.style.width = '28px'
      el.style.height = '28px'
      el.style.boxSizing = 'border-box'
      el.style.cursor = 'pointer'
      el.style.transition = 'transform 0.2s'
      el.title = `${driverId}`

      const marker = new maplibregl.Marker(el)
        .setLngLat([coord.lng, coord.lat])
        .addTo(map)

      // attach popup on click
      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(
        `
        <div style="min-width:150px">
          <strong>${driverId}</strong><br/>
          ${t('lastSeen')}: ${new Date().toISOString()}
        </div>
      `
      )

      marker.setPopup(popup)
      markersRef.current[key] = marker
    }
  }

  useEffect(() => {
    vehicles.forEach((v) => upsertMarker(v))
  }, [vehicles])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !focusOn) return

    const {
      position: { lat, lng },
    } = focusOn
    const coord = beidouToWGS84(lat, lng)

    map.flyTo({
      center: [coord.lng, coord.lat],
      zoom: 14,
    })
  }, [focusOn])

  // Fit map to all markers when vehicles change (initial focus)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (vehicles.length === 0) return

    const bounds = new maplibregl.LngLatBounds()
    vehicles.forEach((v) => {
      const {
        position: { lat, lng },
      } = v
      const coord = beidouToWGS84(lat, lng)
      bounds.extend([coord.lng, coord.lat])
    })

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 80, maxZoom: 14 })
    }
  }, [vehicles])

  return (
    <div className="w-full h-[520px] rounded-xl overflow-hidden border">
      <div ref={mapContainer} className="w-full h-full" />
      {/* Simple legend */}
      <div className="absolute left-4 top-4 z-30 bg-white/90 p-2 rounded-md text-sm shadow">
        <div className="font-semibold">{t('liveVehicles')}</div>
        <div className="text-xs">
          {vehicles.length} {t('vehicles')}
        </div>
      </div>
    </div>
  )
}
