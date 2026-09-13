// Centralized "is this meeting live?" logic so every component (room grid,
// host view, attendee view) agrees on the same window instead of each
// re-implementing its own date math.

/**
 * @param {{ starttime: string | Date, duration: number }} room
 * @returns {{ start: Date, end: Date }}
 */
export function getMeetingWindow(room) {
  const start = new Date(room.starttime);
  const end = new Date(start.getTime() + (room.duration || 0) * 60000);
  return { start, end };
}

/**
 * @param {{ starttime: string | Date, duration: number }} room
 * @param {Date} [now]
 * @returns {"upcoming" | "live" | "ended"}
 */
export function getMeetingStatus(room, now = new Date()) {
  const { start, end } = getMeetingWindow(room);
  if (now < start) return "upcoming";
  if (now > end) return "ended";
  return "live";
}

/**
 * Human-friendly label for the join button depending on meeting status.
 * @param {{ starttime: string | Date, duration: number }} room
 * @param {Date} [now]
 */
export function getJoinLabel(room, now = new Date()) {
  const status = getMeetingStatus(room, now);
  if (status === "ended") return "Meeting ended";
  if (status === "live") return "Join meeting \u2192";

  const { start } = getMeetingWindow(room);
  const diffMs = start.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins <= 1) return "Starts in <1 min";
  if (diffMins < 60) return `Starts in ${diffMins} min`;

  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `Starts in ${diffHours} hr`;

  return `Starts ${start.toLocaleDateString([], { month: "short", day: "numeric" })}`;
}
