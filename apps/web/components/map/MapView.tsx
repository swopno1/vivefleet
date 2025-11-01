"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapViewProps {
  vehicles: {
    id: string;
    name: string;
    lat: number;
    lon: number;
    status?: string;
  }[];
}

export default function MapView({ vehicles }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [105.0, 35.0], // Central Asia approx
      zoom: 4,
    });
  }, []);

  // Update markers whenever vehicle positions change
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Clear old markers
    map.eachLayer((layer) => {
      if (layer.id.startsWith("vehicle-marker")) map.removeLayer(layer.id);
    });

    vehicles.forEach((v) => {
      const el = document.createElement("div");
      el.className = "w-3 h-3 bg-blue-500 rounded-full border-2 border-white";
      new maplibregl.Marker(el)
        .setLngLat([v.lon, v.lat])
        .setPopup(new maplibregl.Popup().setText(`${v.name}: ${v.status}`))
        .addTo(map);
    });
  }, [vehicles]);

  return <div ref={mapContainer} className="w-full h-[80vh] rounded-xl" />;
}
