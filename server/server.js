import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import User from "./models/user.js";
import Room from "./models/room.js";
import { ObjectId } from "mongodb";
import { auth } from "./auth.js";
import { toNodeHandler } from "better-auth/node";
import roomRoutes from "./routes/roomRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { createServer } from "node:http";
import { Server } from "socket.io";
import { connectToSocket } from "./controllers/socketManager.js";

dotenv.config();

// CLIENT_URL is the single source of truth for "who's allowed to talk to us" -
// it's already used to build meetlink in roomRoutes.js, and now Express CORS
// and Socket.IO CORS (in socketManager.js) both read the same value, so they
// can never drift out of sync again.
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const PORT = process.env.PORT || 8080;

const app = express();
const server = createServer(app);
const io = connectToSocket(server, CLIENT_URL);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

async function mongoconnect() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("connection successful");
  } catch (err) {
    console.log("connection failed");
    console.log(err);
  }
}

app.all("/api/auth/*path", toNodeHandler(auth));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/room", roomRoutes);
app.use("/api/user", userRoutes);

const start = async () => {
  await mongoconnect();
  server.listen(PORT, () => {
    console.log(`listening from port ${PORT}`);
  });
};

start();
