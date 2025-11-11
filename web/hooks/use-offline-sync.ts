"use client";

import { useEffect } from "react";
import { idb } from "@/lib/storage";
import { socket } from "@/lib/socket";

export const useOfflineSync = () => {
  useEffect(() => {
    const handleSync = async () => {
      if (navigator.onLine) {
        const positions = await idb.getAll("positions");
        if (positions.length > 0) {
          // Send positions to the backend
          socket.emit("sync:positions", positions);
          // Clear the positions from IndexedDB
          await idb.clear("positions");
        }
      }
    };

    // Listen for the online event
    window.addEventListener("online", handleSync);

    // Initial sync check
    handleSync();

    return () => {
      window.removeEventListener("online", handleSync);
    };
  }, []);
};
