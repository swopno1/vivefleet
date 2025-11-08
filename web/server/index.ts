import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPA_URL || !SUPA_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const supa = createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: false },
});

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  pingInterval: 20000,
  pingTimeout: 5000,
});

// In-memory mapping: socketId -> vehicleId
const socketVehicle = new Map<string, string>();
// vehicleId -> socketId (latest)
const vehicleSocket = new Map<string, string>();

// Helper: persist position
async function persistPosition({
  vehicleId,
  lat,
  lng,
  speed,
  ts,
}: {
  vehicleId: string;
  lat: number;
  lng: number;
  speed: number;
  ts?: string;
}) {
  try {
    const recorded_at = ts
      ? new Date(ts).toISOString()
      : new Date().toISOString();
    await supa
      .from("positions")
      .insert([{ vehicle_id: vehicleId, lat, lng, speed, recorded_at }]);
    // update vehicle last seen & status
    await supa
      .from("vehicles")
      .update({ status: "online", updated_at: new Date().toISOString() })
      .eq("id", vehicleId);
  } catch (err) {
    console.error("persistPosition error", err);
    throw err;
  }
}

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  socket.on("identify", (payload: { vehicleId?: string; role?: string }) => {
    // optional identification handshake from client
    if (payload?.vehicleId) {
      socketVehicle.set(socket.id, payload.vehicleId);
      vehicleSocket.set(payload.vehicleId, socket.id);
      console.log(`Socket ${socket.id} bound to vehicle ${payload.vehicleId}`);
    }
  });

  socket.on("driver:position", async (payload) => {
    // payload: { vehicleId, lat, lng, speed, ts }
    const { vehicleId, lat, lng, speed, ts } = payload || {};
    if (!vehicleId || typeof lat !== "number" || typeof lng !== "number") {
      socket.emit("error", { message: "invalid_payload" });
      return;
    }

    // keep mapping
    socketVehicle.set(socket.id, vehicleId);
    vehicleSocket.set(vehicleId, socket.id);

    try {
      await persistPosition({ vehicleId, lat, lng, speed, ts });
      const event = {
        vehicleId,
        lat,
        lng,
        speed,
        ts: ts || new Date().toISOString(),
      };
      // Broadcast to all admin/dashboard clients
      io.emit("position_update", event);
      // Acknowledge driver
      socket.emit("driver:position:ack", { ok: true, ts: event.ts });
    } catch (err) {
      socket.emit("error", { message: "position_save_failed" });
    }
  });

  socket.on("driver:start_trip", async (payload) => {
    // payload: { vehicleId }
    const { vehicleId } = payload || {};
    if (!vehicleId)
      return socket.emit("error", { message: "vehicleId_required" });
    try {
      const start_time = new Date().toISOString();
      const { data, error } = await supa
        .from("trips")
        .insert([{ vehicle_id: vehicleId, start_time, status: "active" }])
        .select()
        .single();
      if (error) throw error;
      socket.emit("driver:start_trip:ack", { ok: true, tripId: data.id });
      io.emit("trip_update", { vehicleId, trip: data });
    } catch (err) {
      console.error("start_trip error", err);
      socket.emit("error", { message: "start_trip_failed" });
    }
  });

  socket.on("driver:end_trip", async (payload) => {
    // payload: { vehicleId, tripId, endTime?, distanceKm? }
    const { vehicleId, tripId, endTime, distanceKm } = payload || {};
    if (!tripId) return socket.emit("error", { message: "tripId_required" });
    try {
      const updates: any = {
        status: "completed",
        end_time: endTime || new Date().toISOString(),
      };
      if (typeof distanceKm === "number") updates.distance_km = distanceKm;
      await supa.from("trips").update(updates).eq("id", tripId);
      socket.emit("driver:end_trip:ack", { ok: true, tripId });
      io.emit("trip_update", { vehicleId, tripId, status: "completed" });
    } catch (err) {
      console.error("end_trip error", err);
      socket.emit("error", { message: "end_trip_failed" });
    }
  });

  socket.on("disconnect", async () => {
    const vehicleId = socketVehicle.get(socket.id);
    console.log("Socket disconnected", socket.id, "vehicle", vehicleId);
    socketVehicle.delete(socket.id);
    if (vehicleId) {
      // mark vehicle offline if this socket was the registered one
      const currentSocket = vehicleSocket.get(vehicleId);
      if (currentSocket === socket.id) {
        vehicleSocket.delete(vehicleId);
        try {
          await supa
            .from("vehicles")
            .update({ status: "offline", updated_at: new Date().toISOString() })
            .eq("id", vehicleId);
          io.emit("vehicle_status", { vehicleId, status: "offline" });
        } catch (err) {
          console.error("error setting vehicle offline", err);
        }
      }
    }
  });
});

// Basic REST endpoints for admin UI
app.get("/health", (req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);

app.get("/vehicles", async (req, res) => {
  try {
    const { data, error } = await supa
      .from("vehicles")
      .select("*, driver:users(id, name, email)");
    if (error) throw error;
    res.json({ ok: true, vehicles: data });
  } catch (err) {
    console.error("vehicles list error", err);
    res.status(500).json({ ok: false, error: "vehicles_fetch_failed" });
  }
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("SIGINT received — shutting down");
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down");
  server.close(() => process.exit(0));
});

server.listen(PORT, () =>
  console.log(`ViveFleet server listening on port ${PORT}`)
);
