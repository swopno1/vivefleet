import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    socket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: false, // Important to control connection manually
    });
  }
  return socket;
}

export const useSocket = () => {
  const socket = getSocket();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log('Socket.IO connected:', socket.id);
      setIsConnected(true);
    };

    const onDisconnect = (reason: Socket.DisconnectReason) => {
      console.log('Socket.IO disconnected:', reason);
      setIsConnected(false);
    };

    const onConnectError = (err: Error) => {
      console.error('Socket.IO connection error:', err.message);
    };

    const onReconnect = (attemptNumber: number) => {
      console.log('Socket.IO reconnected after attempt:', attemptNumber);
    };

    const onReconnectAttempt = (attemptNumber: number) => {
      console.log('Socket.IO reconnect attempt:', attemptNumber);
    };

    const onReconnectFailed = () => {
      console.error('Socket.IO reconnection failed');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('reconnect', onReconnect);
    socket.on('reconnect_attempt', onReconnectAttempt);
    socket.on('reconnect_failed', onReconnectFailed);

    return () => {
      // These listeners are local to the hook instance, so they should be cleaned up.
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('reconnect', onReconnect);
      socket.off('reconnect_attempt', onReconnectAttempt);
      socket.off('reconnect_failed', onReconnectFailed);
    };
  }, [socket]);

  return { socket, isConnected };
};
