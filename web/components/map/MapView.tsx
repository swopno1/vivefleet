"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { io, Socket } from "socket.io-client";
import { useTranslations } from "next-intl";

type VehiclePos = {
  vehicleId: string;
  lat: number;
  lng: number;
  speed?: number;
  updatedAt?: string;
};

type DemoMapProps = {
  /** Center for initial view [lng, lat] */
  initialCenter?: [number, number];
  initialZoom?: number;
  /** Optional socket.io url for live demo; if omitted, component will use mocked vehicles */
  socketUrl?: string;
};

// Placeholder: convert Beidou coords (BD09/other) to WGS84 for Map display.
// Replace with proper algorithm when you have accurate Beidou input format.
function beidouToWGS84(lat: number, lng: number) {
  // This is a no-op placeholder — adjust with proper conversion if needed.
  return { lat, lng };
}

export default function DemoMap({
  initialCenter = [121.4737, 31.2304], // Shanghai as fallback [lng, lat]
  initialZoom = 8,
  socketUrl,
}: DemoMapProps) {
  const t = useTranslations ? useTranslations("DemoMap") : (k: string) => k;
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Vehicles keyed by id
  const [vehicles, setVehicles] = useState<Record<string, VehiclePos>>({});

  // Keep marker references so we can update positions without recreating DOM nodes
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});

  // Initialize MapLibre map
  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) return; // already initialized

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm-tiles",
          },
        ],
      },
      center: initialCenter as [number, number],
      zoom: initialZoom,
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [initialCenter, initialZoom]);

  // Add/update marker for a vehicle
  function upsertMarker(v: VehiclePos) {
    const map = mapRef.current;
    if (!map) return;

    const { lat, lng, vehicleId, speed } = v;
    const coord = beidouToWGS84(lat, lng);
    const key = vehicleId;

    // If marker exists, update position
    if (markersRef.current[key]) {
      markersRef.current[key].setLngLat([coord.lng, coord.lat]);
      // update popup if exists
      const el = markersRef.current[key].getElement();
      el.setAttribute("title", `${vehicleId} — ${speed ?? 0} km/h`);
    } else {
      // create DOM element for marker
      const el = document.createElement("div");
      el.className =
        "w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center";
      el.style.background = "linear-gradient(180deg, #06b6d4, #0ea5a0)";
      el.style.width = "28px";
      el.style.height = "28px";
      el.style.boxSizing = "border-box";
      el.style.cursor = "pointer";
      el.title = `${vehicleId} — ${speed ?? 0} km/h`;

      const marker = new maplibregl.Marker(el)
        .setLngLat([coord.lng, coord.lat])
        .addTo(map);

      // attach popup on click
      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(
        `
        <div style="min-width:150px">
          <strong>${vehicleId}</strong><br/>
          ${t("speed")}: ${speed ?? 0} km/h<br/>
          ${t("lastSeen")}: ${v.updatedAt ?? new Date().toISOString()}
        </div>
      `
      );

      marker.setPopup(popup);
      markersRef.current[key] = marker;
    }
  }

  // Apply incoming vehicle positions to state and markers
  function applyVehicleUpdate(payload: VehiclePos) {
    setVehicles((prev) => {
      const next = { ...prev, [payload.vehicleId]: payload };
      return next;
    });
    upsertMarker(payload);
  }

  // Connect to socket.io if url provided; otherwise start mock generator
  useEffect(() => {
    let mockInterval: number | undefined;

    if (socketUrl) {
      const socket = io(socketUrl, { transports: ["websocket"] });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("socket connected", socket.id);
      });

      socket.on("position_update", (data: VehiclePos) => {
        applyVehicleUpdate(data);
      });

      socket.on("disconnect", () => {
        console.log("socket disconnected");
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    } else {
      // Mock: create 4 vehicles that move slowly
      const vehiclesMock: Record<string, VehiclePos> = {
        V001: {
          vehicleId: "V001",
          lat: 31.2304,
          lng: 121.4737,
          speed: 40,
          updatedAt: new Date().toISOString(),
        },
        V002: {
          vehicleId: "V002",
          lat: 31.5,
          lng: 121.7,
          speed: 25,
          updatedAt: new Date().toISOString(),
        },
        V003: {
          vehicleId: "V003",
          lat: 30.9,
          lng: 121.3,
          speed: 60,
          updatedAt: new Date().toISOString(),
        },
        V004: {
          vehicleId: "V004",
          lat: 31.1,
          lng: 121.9,
          speed: 10,
          updatedAt: new Date().toISOString(),
        },
      };

      // Seed initial markers
      Object.values(vehiclesMock).forEach((v) => applyVehicleUpdate(v));

      mockInterval = window.setInterval(() => {
        Object.keys(vehiclesMock).forEach((id, idx) => {
          // move them a little bit
          const v = vehiclesMock[id];
          const deltaLng = (Math.random() - 0.5) * 0.02;
          const deltaLat = (Math.random() - 0.5) * 0.01;
          v.lat += deltaLat;
          v.lng += deltaLng;
          v.speed = Math.max(0, (v.speed ?? 20) + (Math.random() - 0.5) * 10);
          v.updatedAt = new Date().toISOString();
          applyVehicleUpdate({ ...v });
        });
      }, 2000);

      return () => {
        if (mockInterval) window.clearInterval(mockInterval);
      };
    }
  }, [socketUrl]);

  // Fit map to all markers when vehicles change (initial focus)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const ids = Object.keys(vehicles);
    if (ids.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    ids.forEach((id) => {
      const v = vehicles[id];
      const { lat, lng } = beidouToWGS84(v.lat, v.lng);
      bounds.extend([lng, lat]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 80, maxZoom: 14 });
    }
  }, [vehicles]);

  return (
    <div className="w-full h-[520px] rounded-xl overflow-hidden border">
      <div ref={mapContainer} className="w-full h-full" />
      {/* Simple legend */}
      <div className="absolute left-4 top-4 z-30 bg-white/90 p-2 rounded-md text-sm shadow">
        <div className="font-semibold">{t("liveVehicles")}</div>
        <div className="text-xs">
          {Object.keys(vehicles).length} {t("vehicles")}
        </div>
      </div>
    </div>
  );
}
