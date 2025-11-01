"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Vehicle } from "@repo/types";

interface DashboardMapProps {
  vehicles: Vehicle[];
}

export default function DashboardMap({ vehicles }: DashboardMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [90.4125, 23.8103],
      zoom: 12,
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  // Update markers when vehicle list changes
  useEffect(() => {
    if (!mapRef.current) return;

    vehicles.forEach((v) => {
      const existing = markersRef.current[v.id];
      const el = document.createElement("div");
      el.className = `rounded-full ${
        v.status === "moving"
          ? "bg-green-500"
          : v.status === "idle"
            ? "bg-yellow-500"
            : "bg-gray-400"
      } w-3 h-3 border border-white`;

      if (existing) {
        existing.setLngLat([v.lng, v.lat]);
      } else {
        const marker = new maplibregl.Marker(el)
          .setLngLat([v.lng, v.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(
              `<strong>${v.name}</strong><br>${v.plate_no}<br>${v.speed} km/h`
            )
          )
          .addTo(mapRef.current!);

        markersRef.current[v.id] = marker;
      }
    });
  }, [vehicles]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[500px] rounded-xl border border-border shadow-sm"
    />
  );
}
