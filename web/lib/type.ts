export type PageProps = {
  params: Promise<{ locale: string }>
}

export type PagePropsWithChildren = PageProps & { children: React.ReactNode }

export type VehiclePos = {
  driverId: string;
  position: {
    lat: number;
    lng: number;
  };
  tripId: number | null;
};
