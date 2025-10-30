import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Socket events
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("position:update", (data) => {
    io.emit("position:broadcast", data);
  });
});

app.get("/health", (_, res) => res.send("OK"));

server.listen(process.env.PORT || 3001, () => {
  console.log("API running on port 3001");
});
