"use client";

import { useState, useEffect } from "react";

export interface Vehicle {
  id: string;
  name: string;
  driver: string;
  speed: string;
  status: "Moving" | "Idle";
  lat: number;
  lng: number;
}

const initialVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Truck A",
    driver: "John Doe",
    speed: "60 mph",
    status: "Moving",
    lat: 23.81,
    lng: 90.41,
  },
  {
    id: "2",
    name: "Truck B",
    driver: "Jane Smith",
    speed: "0 mph",
    status: "Idle",
    lat: 23.77,
    lng: 90.38,
  },
  {
    id: "3",
    name: "Truck C",
    driver: "Mike Johnson",
    speed: "45 mph",
    status: "Moving",
    lat: 23.75,
    lng: 90.39,
  },
];

export const useSocketVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => ({
          ...vehicle,
          lat: vehicle.lat + (Math.random() - 0.5) * 0.01,
          lng: vehicle.lng + (Math.random() - 0.5) * 0.01,
          speed:
            vehicle.status === "Moving"
              ? `${Math.floor(Math.random() * 60) + 20} mph`
              : "0 mph",
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return vehicles;
};
