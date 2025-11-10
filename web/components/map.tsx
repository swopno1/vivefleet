"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Vehicle } from "@/hooks/use-socket-vehicles";

interface MapProps {
  vehicles: Vehicle[];
}

const Map = ({ vehicles }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<{ [key: string]: maplibregl.Marker }>({});

  useEffect(() => {
    if (map.current) return; // initialize map only once

    // TODO: Replace with your own MapTiler API key
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY || "get_your_own_OpIi92x7T7FmOr5C_D_p";

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: [90.389, 23.811],
      zoom: 12,
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;

    vehicles.forEach((vehicle) => {
      if (markers.current[vehicle.id]) {
        markers.current[vehicle.id].setLngLat([vehicle.lng, vehicle.lat]);
      } else {
        markers.current[vehicle.id] = new maplibregl.Marker()
          .setLngLat([vehicle.lng, vehicle.lat])
          .addTo(map.current!);
      }
    });
  }, [vehicles]);

  return (
    <div
      ref={mapContainer}
      className="h-full w-full"
    />
  );
};

export default Map;
