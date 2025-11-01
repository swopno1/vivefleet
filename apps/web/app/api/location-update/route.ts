// apps/web/app/api/location-update/route.ts
import { NextResponse } from "next/server";

interface Location {
  vehicleId: string;
  coords: {
    lat: number;
    lng: number;
  };
  timestamp: string;
}

const lastLocations: Location[] = []; // in-memory store (MVP only)

export async function POST(req: Request) {
  const body = await req.json();
  const { vehicleId, coords } = body;

  if (!vehicleId || !coords) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  // Store update (keep only last 20)
  lastLocations.push({
    vehicleId,
    coords,
    timestamp: new Date().toISOString(),
  });
  if (lastLocations.length > 20) lastLocations.shift();

  console.log("📡 Location received:", body);

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(lastLocations);
}
