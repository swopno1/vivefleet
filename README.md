# ViveFleet - Live Fleet Tracking MVP

This repository contains the complete Minimum Viable Product (MVP) for ViveFleet, a live fleet-tracking web application.

## Architecture

The project is a monorepo with two main components:

-   **`server/`**: A Node.js backend using Express, Socket.IO, and Supabase for real-time communication, authentication, and data persistence.
-   **`web/`**: A Next.js (App Router) frontend application for the user interface, including a live map, vehicle tracking, and user authentication.

## Features

-   **Live Vehicle Tracking**: Real-time location updates on a MapLibre map.
-   **User Authentication**: JWT-based authentication with driver and admin roles.
-   **Offline Caching**: IndexedDB is used to cache data for offline use.
-   **PWA Support**: The frontend is a Progressive Web App, allowing for installation on mobile devices.
-   **Localization**: The UI supports English, Mandarin, and Persian.

## Setup and Running the Application

To run the application, you will need to have Node.js and pnpm installed.

### 1. Backend Setup

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file by copying the `.env.example` file:
    ```bash
    cp .env.example .env
    ```
4.  Fill in the required Supabase credentials in the `.env` file.
5.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server will be running on port 4000.

### 2. Frontend Setup

1.  Navigate to the `web` directory:
    ```bash
    cd web
    ```
2.  Install the dependencies:
    ```bash
    pnpm install
    ```
3.  Create a `.env.local` file by copying the `.env.example` file:
    ```bash
    cp .env.example .env.local
    ```
4.  Start the frontend development server:
    ```bash
    pnpm run dev
    ```
    The frontend will be running on port 3000.

## Testing

To test the application:

1.  Register a new user with the "driver" role.
2.  Register a new user with the "admin" role.
3.  Log in as the admin user and navigate to the dashboard.
4.  Use a separate browser or device to log in as the driver and simulate sending position updates.
5.  Verify that the vehicle's position is updated in real-time on the admin dashboard.
