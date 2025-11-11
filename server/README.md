# Resilient Communication Network - Backend

This directory contains the backend for the Resilient Communication Network project. It is a Node.js application using Express, Socket.IO, and Supabase.

## Setup

1.  **Install dependencies:**
    ```bash
    cd server
    npm install
    ```

2.  **Create a `.env` file:**
    Copy the `.env.example` file to `.env` and fill in the required values.
    ```bash
    cp .env.example .env
    ```

3.  **Run the database schema:**
    Apply the `schema.sql` file to your Supabase project to create the necessary tables and policies.

4.  **Start the server:**
    ```bash
    npm start
    ```
    The server will be running on the port specified in your `.env` file (default is 4000).

## Frontend Connection

To connect from the Next.js frontend, use the following code as an example:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  auth: {
    token: 'YOUR_JWT_TOKEN',
  },
});

socket.on('connect', () => {
  console.log('Connected to the server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

// Example of sending a message
socket.emit('message:send', {
  toUserId: 'RECIPIENT_USER_ID',
  content: 'Hello, world!',
  timestamp: new Date().toISOString(),
});
```
