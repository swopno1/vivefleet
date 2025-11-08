export function beidouToWGS84(lat: number, lng: number) {
  // This is a small offset placeholder — replace with proper projection lib
  return { lat: lat - 0.00025, lng: lng - 0.00035 };
}
