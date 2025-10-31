"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { env } from "@repo/config/env";

export function useVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
    socket.on("position_update", (data) => {
      setVehicles((prev) => {
        const filtered = prev.filter((v) => v.id !== data.id);
        return [...filtered, data];
      });
    });
    return () => socket.disconnect();
  }, []);

  return vehicles;
}
