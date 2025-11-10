"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Marker {
  id: string;
  lng: number;
  lat: number;
}

interface MapProps {
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  markers?: Marker[];
}

const Map = ({ initialViewState, markers: markerData }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<{ [key: string]: maplibregl.Marker }>({});

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: "https://openfreemap.org/styles/positron.json",
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
    });
  }, [initialViewState]);

  useEffect(() => {
    if (!map.current || !markerData) return;

    markerData.forEach((markerInfo) => {
      if (markers.current[markerInfo.id]) {
        markers.current[markerInfo.id].setLngLat([markerInfo.lng, markerInfo.lat]);
      } else {
        markers.current[markerInfo.id] = new maplibregl.Marker()
          .setLngLat([markerInfo.lng, markerInfo.lat])
          .addTo(map.current!);
      }
    });
  }, [markerData]);

  return (
    <div
      ref={mapContainer}
      className="h-full w-full"
    />
  );
};

export default Map;
