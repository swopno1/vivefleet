# ViveFleet — Phase 1 Blueprint & Code Scaffold

**Purpose:** Developer-ready MVP architecture, file scaffolding, DB schema, and core code snippets to get the Fleet Tracker (Beidou) MVP running fast.

---

## Quick checklist (Phase 1)

- [ ] Repo init + monorepo or single-app decision (single Next.js app + `server/` folder)
- [ ] Frontend scaffold (Next.js App Router + shadcn components)
- [ ] Backend scaffold (Express + Socket.IO)
- [ ] Supabase schema + seed data
- [ ] Map component (MapLibre) + Beidou→WGS84 converter
- [ ] Driver PWA (service worker + IndexedDB)
- [ ] Localization (next-intl) with `en`, `zh`, `fa`
- [ ] Deploy plan (Vercel + Railway)

---

## Repo layout (recommended)

```
/vivefleet
├── app/                      # Next.js App Router pages
│   ├── dashboard/
│   ├── driver/
│   ├── (auth)/
│   └── layout.tsx
├── components/
│   ├── map/
│   ├── fleet/
│   └── ui/
├── lib/
│   ├── supabase.ts
│   ├── socket.ts
│   ├── beidou-convert.ts
│   └── i18n/
├── server/                   # Express + Socket.IO backend
│   ├── index.ts
│   └── socketHandlers/
├── public/
│   ├── manifest.json
│   └── sw.js
├── sql/                      # DB schema + seeds
├── package.json
└── README.md
```

---

## 1) Commands to initialize (exact)

```bash
# create project folder
mkdir vivefleet && cd vivefleet
# initialize package
pnpm init -y
# install frontend deps
pnpm add next react react-dom next-intl @radix-ui/react-toast tailwindcss postcss autoprefixer
# install shadcn dependencies (example)
pnpm add @shadcn/ui
# install backend deps
pnpm add -D typescript ts-node-dev
pnpm add express socket.io cors pg supabase-js
# dev utilities
pnpm add -D eslint prettier
```

---

## 2) Supabase / DB schema (SQL)

**File:** `sql/schema.sql`

```sql
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
```

**Seed snippet (sql/seeds.sql)**

```sql
insert into users (name, email, role) values ('Admin','admin@vivecoding.com','admin');
insert into users (name, email, role) values ('Driver One','driver1@vivecoding.com','driver');
insert into vehicles (name, driver_id) values ('Truck-001', (select id from users where email='driver1@vivecoding.com'));
```

---

## 3) Backend: Express + Socket.IO (server/index.ts)

**Purpose:** Receive `position` events from driver clients, persist to Supabase, emit `position_update` to dashboards.

```ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supa = createClient(SUPA_URL, SUPA_KEY);

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("driver:position", async (payload) => {
    /* payload: { vehicleId, lat, lng, speed, ts } */
    try {
      const { vehicleId, lat, lng, speed, ts } = payload;
      await supa
        .from("positions")
        .insert({ vehicle_id: vehicleId, lat, lng, speed, recorded_at: ts });
      await supa
        .from("vehicles")
        .update({ status: "online" })
        .eq("id", vehicleId);
      io.emit("position_update", { vehicleId, lat, lng, speed, ts });
    } catch (err) {
      console.error("save position error", err);
      socket.emit("error", { message: "position_save_failed" });
    }
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
});

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
```

---

## 4) Socket client hook (lib/socket.ts)

**Usage:** both Dashboard and Driver PWA

```ts
import { io, Socket } from "socket.io-client";
let socket: Socket | null = null;
export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");
  }
  return socket;
}
```

---

## 5) Beidou → WGS84 converter (lib/beidou-convert.ts)

**Note:** For MVP we provide a conservative transform placeholder. For production integrate precise algorithm / local CRS handling.

```ts
export function beidouToWGS84(lat: number, lng: number) {
  // This is a small offset placeholder — replace with proper projection lib
  return { lat: lat - 0.00025, lng: lng - 0.00035 };
}
```

---

## 6) Map component (components/map/MapView.tsx)

**Key:** MapLibre + markers, listens for `position_update` events

```tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

const Map = dynamic(() => import("react-map-gl"), { ssr: false });

export default function MapView() {
  useEffect(() => {
    const s = getSocket();
    s.on("position_update", (p) => {
      // update marker state (use React state or global store)
    });
    return () => {
      s.off("position_update");
    };
  }, []);

  return (
    <div style={{ height: "600px" }}>
      <Map /* maplibre/map props */ />
    </div>
  );
}
```

---

## 7) Driver PWA: send mock Beidou positions loop

**Example driver worker:**

```ts
// called when driver clicks Start Trip
function startMockPing(vehicleId: string) {
  const s = getSocket();
  const interval = setInterval(() => {
    const mock = {
      vehicleId,
      lat: 31.2304 + Math.random() * 0.001,
      lng: 121.4737 + Math.random() * 0.001,
      speed: Math.random() * 60,
      ts: new Date().toISOString(),
    };
    s.emit("driver:position", mock);
  }, 5000);
  return () => clearInterval(interval);
}
```

---

## 8) Localization (next-intl) config snippet

```
/messages/en.json
/messages/zh.json
/messages/fa.json
```

Usage in server components: `useTranslations('Namespace')`

---

## 9) Service Worker skeleton (public/sw.js)

```js
self.addEventListener("install", (evt) => {
  self.skipWaiting();
});
self.addEventListener("fetch", (evt) => {
  /* Cache-first strategy for tiles and API */
});
self.addEventListener("sync", (evt) => {
  if (evt.tag === "sync-positions") evt.waitUntil(syncPositions());
});
```

---

## 10) Socket event contract (essential)

```
// driver -> server
'driver:position' => { vehicleId, lat, lng, speed, ts }

// server -> clients
'position_update' => { vehicleId, lat, lng, speed, ts }

// optional control
'driver:start_trip' => { vehicleId, tripId }
'driver:end_trip' => { vehicleId, tripId, distance }
```

---

## 11) Next actions I implemented in this blueprint

- Full repo layout + commands
- Supabase schema + seeds
- Core server implementation (Express + Socket.IO)
- Socket client hook
- Map integration sketch + driver mock pinger
- Localization & PWA skeletons

---

## 12) What I will implement next (pick one) — I can generate code now:

1. Full runnable `server/index.ts` with environment-safe supabase insertion + docker-friendly `Dockerfile`.
2. Ready-to-drop Next.js `app/dashboard/page.tsx` with MapView + socket integration and a small UI.
3. Driver PWA page (`app/driver/page.tsx`) with Start/Stop trip, mock Beidou pings, and IndexedDB sync.
4. CI/CD `.github/workflows` for Vercel + Railway deployment.

Tell me which one to produce now (1–4), or I can start with `1` by default.

---

_End of blueprint — all code snippets are ready to be copied into your project._

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
