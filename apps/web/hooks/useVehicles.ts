"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { env } from "@repo/config/env";
import { vehicles as demoVehicles } from "@repo/utils";

export function useVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
    setVehicles(demoVehicles); // set once

    socket.on("position_update", (data) => {
      setVehicles((prev) => {
        const filtered = prev.filter((v) => v.id !== data.id);
        return [...filtered, data]; // replace existing one
      });
    });

    return () => socket.disconnect();
  }, []);

  return vehicles;
}
