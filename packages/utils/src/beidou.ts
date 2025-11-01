// packages/utils/beidouConverter.ts
// Simulates converting Beidou coordinates to WGS84 (mock approximation)

import { BeidouCoord, WGS84Coord } from "@repo/types";

/**
 * Mock Beidou → WGS84 conversion
 * In real scenario, apply a proper transformation algorithm
 */
export function beidouToWGS84(coord: BeidouCoord): WGS84Coord {
  const offset = 0.00015; // Simulated offset correction
  return {
    lat: coord.lat - offset,
    lon: coord.lon - offset,
  };
}

/**
 * Generate mock Beidou coordinates for testing
 */
export function generateMockBeidouCoord(): BeidouCoord {
  const baseLat = 39.9042; // Beijing
  const baseLon = 116.4074;

  // Simulate small random movement
  const lat = baseLat + (Math.random() - 0.5) * 0.01;
  const lon = baseLon + (Math.random() - 0.5) * 0.01;

  return { lat, lon };
}
