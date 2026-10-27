

Summary By me-------------------------------
study group is a place where we can find peers to study together, we can create a slot and others can request and we have control to accept or not once accepted, at the time of the slot a link will be shown in which you can hop onto a videocall built by me, currently it doesnt have share screen, it doesnt work properly but you can talk and share video and it is dockerised so you can directly start it through docker and this is written by me and not ai, if you want to know where you can read below the complete overview of the website which isnt obviously written by me

# StudyGroup

StudyGroup is a MERN-stack platform that helps students find and join focused study sessions with peers instead of studying alone. Users create a study room around a topic (title, description, eligibility, start time, duration), other students request to join, the host accepts or denies, and accepted members meet in a built-in live video call. No Zoom, Google Meet, or any third-party tool is needed.

The core idea: studying with the right group, at the right time, on the right topic, beats studying alone. The whole loop (find a room, get accepted, jump on a call) happens inside one app.

## Features

- **Google login** via Better Auth, so there are no passwords to manage
- **Create study rooms** with title, topic, description, eligibility, capacity, start time and duration
- **Join requests**: students request a seat, and the host accepts or denies
- **My Rooms dashboard**: rooms you created and rooms you requested or joined
- **Live video calls**: peer-to-peer WebRTC calls scoped to each room
- **Access control**: only the host or an accepted attendee can join a call, so a meeting link alone is not enough
- **Room management**: leave, cancel a request, or delete a room

## Video calling

Calls are peer-to-peer WebRTC. Audio and video go directly between browsers, not through the server. The server only does signaling, using Socket.IO.

1. A user joins a room's call. Their browser connects to Socket.IO and emits `join-call` with the room ID and username.
2. The server tracks who is in which room (in memory) and broadcasts `user-joined` to everyone already there.
3. Browsers exchange WebRTC offers, answers and ICE candidates through the server using a generic `signal` event.
4. Once connected, media flows directly between peers.
5. On disconnect, the server cleans up and notifies the others with `user-left`.

Access is checked server-side through the `/api/room/:roomid/access` endpoint.

## Tech stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS, MUI, Axios, Socket.IO Client
- **Backend:** Node.js, Express 5, Socket.IO, Mongoose, Better Auth (Google OAuth), MongoDB driver
- **Database:** MongoDB Atlas (or any MongoDB instance)
- **Deployment tooling:** Docker, Docker Compose, nginx

## Project structure

```
studygroup/
├── docker-compose.yml
├── client/                  # React + Vite frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── components/      # Landing sections, room cards, forms, accept/deny UI
│       ├── pages/           # Landing, Dashboard, VideoCall
│       ├── lib/             # auth-client, API base config, meeting time helpers
│       └── services/        # login / logout helpers
└── server/                  # Express + Socket.IO backend
    ├── Dockerfile
    ├── controllers/         # socketManager.js (WebRTC signaling)
    ├── routes/              # room and user routes
    ├── models/              # User, Room, Meeting schemas
    ├── middlewares/         # requireAuth (Better Auth session check)
    ├── auth.js              # Better Auth config (Google + Mongo adapter)
    └── server.js            # Express entry point
```

## Getting started

### Prerequisites

- A MongoDB Atlas cluster (the free tier is fine) or another MongoDB instance
- A Google Cloud project for OAuth login (steps below)
- Either **Docker Desktop** (recommended) or **Node.js 18+**

### 1. Clone the repo

```bash
git clone https://github.com/likith990/studygroup.git
cd studygroup
```

### 2. Set up MongoDB

Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas), create a database user, and copy the connection string. It looks like `mongodb+srv://<user>:<password>@cluster.mongodb.net/studygroup`. This is your `ATLASDB_URL`.

In Atlas, go to **Network Access** and allow your IP address. While testing you can allow `0.0.0.0/0`, but don't leave it open in production.

### 3. Set up Google OAuth

1. Open the [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. Go to **APIs & Services, then OAuth consent screen**. Choose **External**, fill in the app name and emails, and save.
3. Under **Test users**, add your own Google account.
4. Go to **APIs & Services, then Credentials, then Create Credentials, then OAuth client ID**, and choose **Web application**.
5. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5173
   ```
6. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:8080/api/auth/callback/google
   ```
   This must exactly match `BETTER_AUTH_URL` plus `/api/auth/callback/google`.
7. Click **Create** and copy the Client ID and Client Secret.

### 4. Configure environment variables

Create `server/.env`:

```env
PORT=8080
ATLASDB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
BETTER_AUTH_URL=http://localhost:8080
BETTER_AUTH_SECRET=your_random_secret_at_least_32_characters
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Generate a proper secret with:

```bash
openssl rand -base64 32
```

If you run without Docker, also create `client/.env`:

```env
VITE_SERVER_URL=http://localhost:8080
```

> Never commit `.env` files. They contain secrets, and the repo's `.gitignore` already excludes them.

## Running the app

### Option A: Docker (recommended)

From the project root:

```bash
docker compose up --build
```

Then open **http://localhost:5173**.

Useful commands:

```bash
docker compose up -d              # run in the background
docker compose logs -f server     # follow server logs
docker compose down               # stop and remove containers
docker compose up --build         # rebuild after code changes
```

How it works:

| Service  | Image                | Port (host) | Notes                                      |
| -------- | -------------------- | ----------- | ------------------------------------------ |
| `server` | Node 22 (Alpine)     | 8080        | Reads `server/.env` at runtime             |
| `client` | nginx serving a Vite build | 5173  | Falls back to `index.html` for React Router |

Things to know:

- The database is MongoDB Atlas, so there is no Mongo container.
- `VITE_SERVER_URL` is baked into the client at **build time**. It is set under `build.args` in `docker-compose.yml`, not in a runtime `.env`. If you change it, rebuild with `docker compose up --build`.
- The server runs with `NODE_ENV=production`, so `BETTER_AUTH_SECRET` is **required**. Without it the server exits on startup.

### Option B: Run without Docker

In one terminal:

```bash
cd server
npm install
node server.js
```

In another terminal:

```bash
cd client
npm install
npm run dev
```

The client runs on http://localhost:5173 and the server on http://localhost:8080.

## Environment variables

| Variable               | Where  | Description                                           |
| ---------------------- | ------ | ----------------------------------------------------- |
| `PORT`                 | server | Server port (default 8080)                            |
| `ATLASDB_URL`          | server | MongoDB connection string                             |
| `CLIENT_URL`           | server | Frontend origin, used for CORS and meeting links      |
| `BETTER_AUTH_URL`      | server | Public URL of the server                              |
| `BETTER_AUTH_SECRET`   | server | Secret for signing sessions (32+ random characters)   |
| `GOOGLE_CLIENT_ID`     | server | Google OAuth client ID                                |
| `GOOGLE_CLIENT_SECRET` | server | Google OAuth client secret                            |
| `VITE_SERVER_URL`      | client | Backend URL, baked in at build time                   |

## Troubleshooting

- **Server restarts in a loop with "default secret":** set `BETTER_AUTH_SECRET` in `server/.env`.
- **`connection failed` or a Mongo timeout:** add your IP in Atlas under Network Access.
- **`redirect_uri_mismatch` on Google login:** the origin and redirect URI in Google Cloud must match the values in step 3 exactly.
- **Blank page on refresh at a deep link:** make sure you are using the provided `nginx.conf`.
- **Changed `VITE_SERVER_URL` but nothing happened:** rebuild the client with `docker compose up --build`.

## Deploying to a real domain

Update these together:

- `VITE_SERVER_URL` in `docker-compose.yml` (client build arg)
- `CLIENT_URL` and `BETTER_AUTH_URL` in `server/.env`
- `trustedOrigins` in `server/auth.js` and `callbackURL` in `client/src/services/authServices.jsx`, which are currently hardcoded to `http://localhost:5173`
- The authorized origins and redirect URIs in Google Cloud Console
- Serve the app over HTTPS

## Notes

- Signaling state lives in server memory, so restarting the server drops active calls. For multiple server instances, use a shared store such as Redis.
- Room `capacity` defaults to 2 if not specified.
- WebRTC here uses direct peer connections with no TURN server, so calls may fail on some strict networks or NATs.
