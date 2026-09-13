import { useState } from "react";
import {
  Clock3,
  Timer,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Loader2,
  Calendar,
  Video,
  Lock,
} from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { API_BASE } from "../../lib/config";
import useNow from "../../hooks/useNow";
import { getMeetingStatus, getJoinLabel } from "../../lib/meetingTime";

function getCategoryBadge(title = "") {
  const t = title.toLowerCase();
  if (t.includes("dsa") || t.includes("algo") || t.includes("leet")) {
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  }
  if (t.includes("system") || t.includes("backend") || t.includes("arch")) {
    return "bg-violet-500/15 text-violet-300 border-violet-500/30";
  }
  if (t.includes("front") || t.includes("react") || t.includes("web") || t.includes("ui")) {
    return "bg-sky-500/15 text-sky-300 border-sky-500/30";
  }
  if (t.includes("ai") || t.includes("ml") || t.includes("data")) {
    return "bg-amber-500/15 text-amber-300 border-amber-500/30";
  }
  return "bg-purple-500/15 text-purple-300 border-purple-500/30";
}

function getInitials(name = "U") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export default function Roomcard({ room, onApplied }) {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [appliedLocal, setAppliedLocal] = useState(false);
  // Ticking clock so the join button (once accepted) enables/disables
  // itself right at meeting start/end without a page refresh.
  const now = useNow(15000);

  const currentUserId = session?.user?.id;
  const currentUserName = session?.user?.name;

  const isHost =
    room.owner === currentUserId ||
    (room.ownername &&
      currentUserName &&
      room.ownername.toLowerCase() === currentUserName.toLowerCase());

  // The actual request record for this user, if any - this is what tells
  // us whether they're pending, accepted, or rejected. `appliedLocal` is
  // only a stop-gap for the instant right after clicking Apply, before the
  // next poll brings the real record back from the server.
  const myRequest = room.requests?.find(
    (r) =>
      r.authid === currentUserId ||
      (r.requsername && r.requsername === currentUserName)
  );

  const hasApplied = appliedLocal || Boolean(myRequest);
  const status = myRequest?.status || (appliedLocal ? "pending" : null);

  const meetingStatus = getMeetingStatus(room, now);
  const canJoin = meetingStatus === "live";

  const bookedCount = room.booked?.length || 0;
  const isFull = bookedCount >= (room.capacity || 1);

  async function handleApply() {
    if (isHost || hasApplied || isFull || loading) return;
    setLoading(true);

    try {
      const authid = session.user.id;
      const roomid = room._id;

      const res = await fetch(`${API_BASE}/api/room/request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authid, roomid }),
      });

      const data = await res.json();
      if (res.ok) {
        setAppliedLocal(true);
        if (onApplied) onApplied();
      } else {
        if (data.error === "Already applied") {
          setAppliedLocal(true);
        }
      }
    } catch (err) {
      console.error("Failed to apply:", err);
    } finally {
      setLoading(false);
    }
  }

  const categoryStyle = getCategoryBadge(room.title);
  const initials = getInitials(room.ownername || "Host");

  return (
    <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-[#25283c] bg-[#141624] p-6 shadow-xl shadow-black/50 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-[#181a2b] hover:shadow-2xl hover:shadow-violet-950/30">
      <div>
        {/* Top Header Row: Category Badge + Host Pill */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span
            className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${categoryStyle}`}
          >
            {room.title}
          </span>

          <div className="flex items-center gap-2 rounded-full border border-[#2d324d] bg-[#1d2033] px-2.5 py-1 text-xs font-medium text-zinc-300 shadow-sm">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-[10px] font-bold text-white shadow">
              {initials}
            </div>
            <span className="max-w-[120px] truncate font-medium text-zinc-300">
              {room.ownername || "Host"}
            </span>
          </div>
        </div>

        {/* Room Topic & Description */}
        <div className="mb-5">
          <h3 className="font-display text-xl font-bold tracking-tight text-white transition-colors group-hover:text-violet-200">
            {room.topic}
          </h3>
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">
            {room.desc}
          </p>
        </div>

        {/* Distinct Schedule Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#2d324d] bg-[#1d2033] px-3 py-1.5 text-xs font-medium text-zinc-200 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-violet-400" />
            {new Date(room.starttime).toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#2d324d] bg-[#1d2033] px-3 py-1.5 text-xs font-medium text-zinc-200 shadow-sm">
            <Timer className="h-3.5 w-3.5 text-indigo-400" />
            {room.duration} mins
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#2d324d] bg-[#1d2033] px-3 py-1.5 text-xs font-medium text-zinc-200 shadow-sm">
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            {bookedCount} / {room.capacity} booked
          </span>
        </div>

        {/* Join Meet — shown to the host and to accepted attendees.
            Disabled (and non-clickable) until the meeting window opens. */}
        {(isHost || status === "accepted") && (
          <div className="mb-6">
            {canJoin ? (
              <a
                href={room.meetlink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 transition-all hover:opacity-95 active:scale-[0.98]"
              >
                <Video className="h-4 w-4" />
                Join Meet
              </a>
            ) : (
              <div
                title={
                  meetingStatus === "ended"
                    ? "This meeting has already ended"
                    : "Join Meet unlocks once the session starts"
                }
                aria-disabled="true"
                className="flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#2d324d] bg-[#161826] text-sm font-semibold text-zinc-500"
              >
                <Lock className="h-3.5 w-3.5" />
                Join Meet
                <span className="text-zinc-600">&middot; {getJoinLabel(room, now)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Action Button */}
      <div className="border-t border-[#25283c] pt-4 mt-auto">
        {isHost ? (
          <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm font-semibold text-amber-300 shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Hosted by You
          </div>
        ) : status === "accepted" ? (
          canJoin ? (
            <a
              href={room.meetlink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 transition-all hover:opacity-95 active:scale-[0.98]"
            >
              <CheckCircle2 className="h-4 w-4" />
              {getJoinLabel(room, now)}
            </a>
          ) : (
            <div
              title={
                meetingStatus === "ended"
                  ? "This meeting has already ended"
                  : "The join button unlocks once the session starts"
              }
              className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold text-emerald-300 shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              {getJoinLabel(room, now)}
            </div>
          )
        ) : status === "rejected" ? (
          <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 text-sm font-semibold text-red-300 shadow-sm">
            <XCircle className="h-4 w-4 text-red-400" />
            Request Declined
          </div>
        ) : hasApplied ? (
          <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-violet-500/35 bg-violet-500/15 text-sm font-semibold text-violet-300 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-violet-400" />
            Request Sent · Pending
          </div>
        ) : isFull ? (
          <div className="flex h-11 w-full items-center justify-center rounded-xl border border-[#2d324d] bg-[#1d2033] text-sm font-medium text-zinc-500">
            Session Full
          </div>
        ) : (
          <button
            onClick={handleApply}
            disabled={loading}
            className="group/btn flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_auto] text-sm font-semibold text-white shadow-lg shadow-violet-950/50 transition-all duration-300 hover:bg-[position:right_center] hover:shadow-violet-900/50 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Apply to Join
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
