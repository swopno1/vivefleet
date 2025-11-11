"use client";

import { useEffect } from "react";
import { openDB } from "idb";
import { getSocket } from "@/lib/socket";
import { Vehicle } from "@/lib/types";

const DB_NAME = "vivefleet-db";
const POSITIONS_STORE = "positions";
const VEHICLES_STORE = "vehicles";

async function getDb() {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(POSITIONS_STORE)) {
        db.createObjectStore(POSITIONS_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(VEHICLES_STORE)) {
        db.createObjectStore(VEHICLES_STORE, { keyPath: "id" });
      }
    },
  });
}

export async function cachePosition(position: any) {
  const db = await getDb();
  await db.add(POSITIONS_STORE, position);
}

export async function cacheVehicles(vehicles: Vehicle[]) {
  const db = await getDb();
  const tx = db.transaction(VEHICLES_STORE, "readwrite");
  await Promise.all(
    vehicles.map((v) => tx.store.put(v))
  );
  await tx.done;
}

export async function getCachedVehicles(): Promise<Vehicle[]> {
  const db = await getDb();
  return await db.getAll(VEHICLES_STORE);
}

export const useOfflineSync = () => {
  useEffect(() => {
    const handleSync = async () => {
      if (navigator.onLine) {
        const db = await getDb();
        const positions = await db.getAll(POSITIONS_STORE);
        if (positions.length > 0) {
          const socket = getSocket();
          socket.emit("sync:positions", positions);
          await db.clear(POSITIONS_STORE);
        }
      }
    };

    window.addEventListener("online", handleSync);
    handleSync();

    return () => {
      window.removeEventListener("online", handleSync);
    };
  }, []);
};
