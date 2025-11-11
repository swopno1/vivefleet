import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
let token: string | null = null;
if (typeof window !== "undefined") {
  token = localStorage.getItem("token");
}

export const socket = io(URL, {
  auth: { token },
  transports: ["websocket"],
  autoConnect: false,
});
