import { Server } from "socket.io";

let connections = {};
let timeOnline = {};
let usernames = {};

// clientUrl is passed in from server.js so Socket.IO's CORS matches Express's
// CORS exactly (same env var, same value) instead of the old "*" wildcard.
export function connectToSocket(server, clientUrl) {
  const allowedOrigin = clientUrl || process.env.CLIENT_URL || "http://localhost:5173";

  const io = new Server(server, {
    cors: {
      origin: allowedOrigin,
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("user is connected");

    socket.on("join-call", (path, username) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }

      // A dropped/reconnecting client gets a brand-new socket.id but may
      // still be present under its old id in this room's list for a moment
      // (before the "disconnect" handler below has cleaned it up). Guard
      // against duplicate entries so a flaky connection doesn't pile up
      // ghost ids in the room over time.
      if (!connections[path].includes(socket.id)) {
        connections[path].push(socket.id);
      }

      usernames[socket.id] = username || "Guest";
      timeOnline[socket.id] = new Date();

      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path],
          usernames,
        );
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("disconnect", () => {
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());
      var key;

      for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] === socket.id) {
            key = k;

            for (let a = 0; a < connections[key].length; ++a) {
              io.to(connections[key][a]).emit("user-left", socket.id);
            }

            var index = connections[key].indexOf(socket.id);
            connections[key].splice(index, 1);

            if (connections[key].length === 0) {
              delete connections[key];
            }
          }
        }
      }

      delete usernames[socket.id];
    });
  });

  return io;
}
