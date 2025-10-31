import { NextRequest, NextResponse } from "next/server";
import { vehicles } from "@repo/utils";
import type { Vehicle } from "@repo/types";

// GET: return all vehicles
export async function GET() {
  return NextResponse.json(vehicles);
}

// POST: simulate updating a vehicle's location or status
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Vehicle> & { id: string };
    const index = vehicles.findIndex((v) => v.id === body.id);

    if (index !== -1) {
      // Filter out undefined properties
      const filteredBody = Object.fromEntries(
        Object.entries(body).filter(([_, value]) => value !== undefined)
      ) as Partial<Vehicle>;

      // Merge safely
      vehicles[index] = { ...vehicles[index], ...filteredBody };

      return NextResponse.json({ success: true, vehicle: vehicles[index] });
    }

    return NextResponse.json(
      { success: false, message: "Vehicle not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error in /api/vehicles POST:", error);
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
