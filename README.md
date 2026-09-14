# StudyGroup

StudyGroup is a MERN-stack platform that helps students find and join focused study sessions with peers instead of studying alone. Users can create a study room around a topic (with a title, description, eligibility criteria, and a start time/duration), other students can request to join, the host can accept or deny requests, and once accepted, everyone meets in a **built-in live video call** — no need for Zoom, Google Meet, or any third-party tool.

The core idea: studying with the right group, at the right time, on the right topic, is more effective than studying alone — and the whole loop (find a room → get accepted → jump on a call) happens inside one app.

## 🎥 Video Calling (core feature)

The video call is a **peer-to-peer WebRTC** call — audio/video streams go directly between participants' browsers, not through the server. The server's only job is *signaling*: helping browsers discover each other and exchange connection details, using **Socket.IO**.

How it works under the hood:
- When a user joins a room's call, their browser connects to the Socket.IO server and emits a `join-call` event with the room ID and their username.
- The server tracks who's in which room (in-memory) and broadcasts a `user-joined` event to everyone already in that room, so browsers know who else to connect to.
- Browsers then exchange WebRTC offers/answers/ICE candidates through the server via a generic `signal` event — this is the "signaling" handshake needed to open a direct peer-to-peer connection.
- Once connected, video/audio flows directly between peers, not through the server (lower latency, less server load).
- On disconnect, the server cleans up the room's connection list and notifies remaining participants with `user-left`.

Access to a room's call is gated server-side: only the room's host or an accepted attendee can join (checked via the `/api/room/:roomid/access` endpoint), so a meeting link alone isn't enough to get in.

## ✨ Features

- **Google OAuth login** (via [Better Auth](https://www.better-auth.com/)) — no separate passwords to manage
- **Create study rooms** — title, topic, description, eligibility, capacity, start time, duration
- **Join requests** — students request to join a room; the host accepts/denies
- **My Rooms dashboard** — see rooms you've created and rooms you've requested/joined
- **Live video calls** — peer-to-peer WebRTC calls scoped to each room, gated to authorized participants
- **Leave / cancel-request / delete room** flows to manage bookings and seats

## 🛠️ Tech Stack

**Frontend:** React 19, Vite, React Router, Tailwind CSS, MUI, Axios, Socket.IO Client
**Backend:** Node.js, Express 5, Socket.IO, Mongoose (MongoDB), Better Auth (Google OAuth), MongoDB Atlas driver

## 📁 Project Structure

```
studygroup/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Landing sections, room cards, forms, accept/deny UI
│       ├── pages/         # Landing, Dashboard, VideoCall
│       ├── lib/           # auth-client, API base config, meeting time helpers
│       └── services/      # auth service (login/logout)
└── server/          # Express + Socket.IO backend
    ├── controllers/       # socketManager.js — WebRTC signaling logic
    ├── routes/            # room routes, user routes
    ├── models/            # User, Room (Mongoose schemas)
    ├── middlewares/        # requireAuth — Better Auth session check
    ├── auth.js            # Better Auth config (Google provider, Mongo adapter)
    └── server.js          # Express app entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier is fine) or a local MongoDB instance
- A Google Cloud project (for Google OAuth login — steps below)

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd studygroup

cd server && npm install
cd ../client && npm install
```

### 2. Set up MongoDB

Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), create a database user, and grab your connection string (looks like `mongodb+srv://<user>:<password>@cluster.mongodb.net/studygroup`). You'll use this as `ATLASDB_URL` below.

### 3. Set up Google OAuth (for login)

This app uses [Better Auth](https://www.better-auth.com/docs/authentication/google) with Google as the social login provider. To get your own `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one) from the project dropdown at the top.
3. In the left sidebar, go to **APIs & Services → OAuth consent screen**.
   - Choose **External** as the user type (unless you have a Google Workspace).
   - Fill in the required fields (app name, support email, developer contact email) and save.
   - Under **Test users**, add your own Google account while the app is in "Testing" mode, so you can log in during development.
4. Go to **APIs & Services → Credentials**.
5. Click **Create Credentials → OAuth client ID**.
   - Application type: **Web application**.
   - Under **Authorized JavaScript origins**, add:
     ```
     http://localhost:5173
     ```
   - Under **Authorized redirect URIs**, add:
     ```
     http://localhost:8080/api/auth/callback/google
     ```
     (This must exactly match `BETTER_AUTH_URL` + `/api/auth/callback/google` — update it if you change the server port or deploy to a real domain.)
6. Click **Create**. Google will show you a **Client ID** and **Client Secret** — copy both.

### 4. Configure environment variables

Create a `server/.env` file:

```env
PORT=8080
ATLASDB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
BETTER_AUTH_URL=http://localhost:8080
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Create a `client/.env` file:

```env
VITE_SERVER_URL=http://localhost:8080
```

> ⚠️ Never commit your `.env` files — they contain secrets. This repo's `.gitignore` already excludes them.

### 5. Run the app

In one terminal:
```bash
cd server
npm start
```

In another terminal:
```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173` and the server on `http://localhost:8080`. Open the client URL in your browser, log in with Google, and you're in.

## 📌 Notes

- The video call signaling server keeps connection state in memory, so restarting the server will drop active calls (fine for development; consider a shared store like Redis if scaling across multiple server instances in production).
- Room `capacity` defaults to 2 if not specified when creating a room.
