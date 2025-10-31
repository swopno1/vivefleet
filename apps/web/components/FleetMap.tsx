"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

interface Props {
  vehicles: { id: string; lat: number; lng: number; name: string }[];
}

export default function FleetMap({ vehicles }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [116.4074, 39.9042], // Beijing as default
      zoom: 5,
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    vehicles.forEach((v) => {
      new maplibregl.Marker({ color: "red" })
        .setLngLat([v.lng, v.lat])
        .setPopup(new maplibregl.Popup().setText(v.name))
        .addTo(mapRef.current!);
    });
  }, [vehicles]);

  return <div ref={mapContainer} className="w-full h-[80vh]" />;
}
