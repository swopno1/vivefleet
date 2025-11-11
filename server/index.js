import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_KEY;

let supa;
if (SUPA_URL && SUPA_KEY && !SUPA_URL.includes('<your-project-ref>')) {
  supa = createClient(SUPA_URL, SUPA_KEY);
  console.log("Connected to Supabase");
} else {
  console.log("Supabase credentials not provided. Using mock client.");
  supa = {
    from: () => ({
      insert: async (data) => {
        console.log("Mock Supabase insert:", data);
        return { error: null };
      },
      update: (data) => ({
        eq: async (id) => {
          console.log("Mock Supabase update:", data, "where id =", id);
          return { error: null };
        }
      })
    })
  };
}


io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("driver:position", async (payload) => {
    /* payload: { vehicleId, lat, lng, speed, ts } */
    try {
      const { vehicleId, lat, lng, speed, ts } = payload;
      await supa
        .from("positions")
        .insert({ vehicle_id: vehicleId, lat, lng, speed, recorded_at: ts });
      await supa
        .from("vehicles")
        .update({ status: "online" })
        .eq("id", vehicleId);
      io.emit("position_update", { vehicleId, lat, lng, speed, ts });
    } catch (err) {
      console.error("save position error", err);
      socket.emit("error", { message: "position_save_failed" });
    }
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
});

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
