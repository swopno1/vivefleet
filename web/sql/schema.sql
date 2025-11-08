-- users
create table users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  role text,
  created_at timestamptz default now()
);

-- vehicles
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  name text,
  driver_id uuid references users(id),
  status text default 'offline',
  created_at timestamptz default now()
);

-- positions
create table positions (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  lat double precision,
  lng double precision,
  speed double precision,
  recorded_at timestamptz default now()
);

-- trips
create table trips (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id),
  start_time timestamptz,
  end_time timestamptz,
  distance_km double precision,
  status text default 'active'
);