"use client";

import { useEffect, useState, useRef } from "react";
import { beidouToWGS84, generateMockBeidouCoord } from "@repo/utils";
import { Button } from "@/components/ui/button";

export default function TripPage() {
  const [isSharing, setIsSharing] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const vehicleId = "VEH-001"; // mock for now

  useEffect(() => {
    if (isSharing) {
      intervalRef.current = setInterval(async () => {
        const beidou = generateMockBeidouCoord();
        const wgs84 = beidouToWGS84(beidou);

        const payload = {
          vehicleId,
          coords: wgs84,
        };

        try {
          const res = await fetch("/api/location-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            setLog((prev) => [
              `[${new Date().toLocaleTimeString()}] Sent: ${wgs84.lat.toFixed(
                5
              )}, ${wgs84.lon.toFixed(5)}`,
              ...prev,
            ]);
          }
        } catch (err) {
          console.error("❌ Error sending location:", err);
        }
      }, 5000); // every 5 seconds
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSharing]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      <h1 className="text-2xl font-bold">Driver Trip Simulation</h1>
      <Button
        onClick={() => setIsSharing((prev) => !prev)}
        className={
          isSharing
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }
      >
        {isSharing ? "Stop Sharing" : "Start Sharing Location"}
      </Button>

      <div className="w-full max-w-md h-64 overflow-y-auto bg-muted p-3 rounded-lg text-sm font-mono">
        {log.length === 0 ? (
          <p className="text-gray-500">No updates yet...</p>
        ) : (
          log.map((entry, i) => <div key={i}>{entry}</div>)
        )}
      </div>
    </main>
  );
}
