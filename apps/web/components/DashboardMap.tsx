"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Vehicle } from "@repo/types";

export default function DashboardMap({ vehicles }: { vehicles: Vehicle[] }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [116.4074, 39.9042], // Beijing
      zoom: 10,
    });

    mapRef.current = map;
  }, []);

  // Update vehicle markers
  useEffect(() => {
    if (!mapRef.current) return;

    vehicles.forEach((v) => {
      const existing = markersRef.current.get(v.id);

      if (existing) {
        existing.setLngLat([v.lng, v.lat]);
      } else {
        const marker = new maplibregl.Marker({ color: "#00BFFF" })
          .setLngLat([v.lng, v.lat])
          .setPopup(new maplibregl.Popup().setText(`Vehicle ${v.id}`))
          .addTo(mapRef.current!);
        markersRef.current.set(v.id, marker);
      }
    });
  }, [vehicles]);

  return (
    <div ref={mapContainer} className="w-full h-[70vh] rounded-lg shadow-md" />
  );
}
