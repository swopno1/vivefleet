"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import { Vehicle } from "./use-fleet-data";

export const useFleetSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    socket.on("vehicle:update", (vehicle: Vehicle) => {
      queryClient.setQueryData(["vehicles"], (oldData: Vehicle[] | undefined) => {
        if (!oldData) return [vehicle];
        const index = oldData.findIndex((v) => v.id === vehicle.id);
        if (index > -1) {
          const newData = [...oldData];
          newData[index] = vehicle;
          return newData;
        }
        return [...oldData, vehicle];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
};
