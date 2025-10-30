"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [90.4125, 23.8103],
      zoom: 12,
    });
    return () => map.remove();
  }, []);

  return <div ref={mapRef} className="h-screen w-full" />;
}
