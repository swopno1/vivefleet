import { openDB } from "idb";

const DB_NAME = "fleet-db";
const DB_VERSION = 1;
const STORES = ["vehicles", "positions", "trips"];

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    STORES.forEach((store) => {
      if (!db.objectStoreNames.contains(store)) {
        db.createObjectStore(store, { keyPath: "id" });
      }
    });
  },
});

export const idb = {
  async get(storeName: string, key: string) {
    return (await dbPromise).get(storeName, key);
  },
  async getAll(storeName: string) {
    return (await dbPromise).getAll(storeName);
  },
  async set(storeName: string, val: any) {
    return (await dbPromise).put(storeName, val);
  },
  async delete(storeName: string, key: string) {
    return (await dbPromise).delete(storeName, key);
  },
  async clear(storeName: string) {
    return (await dbPromise).clear(storeName);
  },
};
