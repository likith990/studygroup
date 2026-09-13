
import { useState } from "react";
import { authClient } from "../../lib/auth-client";
import useNow from "../../hooks/useNow";
import { getMeetingStatus, getJoinLabel } from "../../lib/meetingTime";
import { API_BASE } from "../../lib/config";

export default function Acceptdeny({ room, onChange = () => {} }) {

     const { data: session } = authClient.useSession();
     // Ticking clock so the join button enables/disables itself right at
     // meeting start/end without needing a page refresh.
     const now = useNow(15000);
     const meetingStatus = getMeetingStatus(room, now);
     const canJoin = meetingStatus === "live";

    // Tracks which single request is mid-flight so we can disable just its
    // buttons (not the whole list) and avoid double-fires on double-clicks.
    const [actioningId, setActioningId] = useState(null);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const reqlength = room.requests.filter((req) => req.status === "pending").length;
    const bookedlength = room.requests.filter((req) => req.status === "accepted").length;
    const isFull = bookedlength >= (room.capacity || 0);

    async function handleaccept(reqid) {
        if (actioningId) return;
        setError("");
        setActioningId(reqid);
        try {
            const authid = session.user.id;
            const roomid = room._id;
            const res = await fetch(`${API_BASE}/api/room/accept`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ authid, roomid, reqid }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Couldn't accept that request.");
                return;
            }
            onChange();
        } catch (err) {
            console.error("Failed to accept request:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setActioningId(null);
        }
    }

    async function handledeny(reqid) {
        if (actioningId) return;
        setError("");
        setActioningId(reqid);
        try {
            const authid = session.user.id;
            const roomid = room._id;
            const res = await fetch(`${API_BASE}/api/room/deny`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ authid, roomid, reqid }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Couldn't deny that request.");
                return;
            }
            onChange();
        } catch (err) {
            console.error("Failed to deny request:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setActioningId(null);
        }
    }

    async function handleCancelRoom() {
        if (deleting) return;
        const confirmed = window.confirm(
            "Cancel this session? This can't be undone, and anyone already booked will lose access."
        );
        if (!confirmed) return;

        setDeleting(true);
        setError("");
        try {
            const roomid = room._id;
            const res = await fetch(`${API_BASE}/api/room/delete`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roomid }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Couldn't cancel this session.");
                return;
            }
            onChange();
        } catch (err) {
            console.error("Failed to delete room:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setDeleting(false);
        }
    }

  return (

    <>

    {error && (
      <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
        {error}
      </div>
    )}

    {room.meetlink && (
      <div className="mt-2">
        {canJoin ? (
          <a
            href={room.meetlink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-500/10 border border-violet-500/30 px-3 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/20 transition-colors"
          >
            {getJoinLabel(room, now)}
          </a>
        ) : (
          <span
            title={
              meetingStatus === "ended"
                ? "This meeting has already ended"
                : "The join button unlocks once your session starts"
            }
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-500"
          >
            {getJoinLabel(room, now)}
          </span>
        )}
      </div>
    )}

    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Booked
        </span>
        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-400">
          {bookedlength}/{room.capacity} booked
        </span>
      </div>

      {bookedlength > 0 ? (
        <div className="space-y-1.5">
          {room.booked.map((r) => (
            <div
              key={r.bookedname}
              className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-400">
                {r.bookedname?.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm text-zinc-200 truncate">{r.bookedname}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 italic">No one booked yet</p>
      )}
    </div>

    
    <div className="mt-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Requested
        </span>
        <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-300">
          {reqlength} pending
        </span>
      </div>

      {isFull && reqlength > 0 && (
        <p className="mb-2 text-xs text-amber-400">
          Room is full - deny or wait for a seat to open before accepting more.
        </p>
      )}

      {room.requests?.length > 0 ? (
        room.requests
          .filter((r) => r.status === "pending")
          .map((r) => (
            <div
              key={r.user}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 mb-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-zinc-300">
                  {r.requsername?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-sm font-medium text-white truncate">
                  {r.requsername}
                </h3>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  className="rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-medium text-white transition-all duration-150 hover:bg-emerald-600 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => handleaccept(r.user)}
                  disabled={actioningId === r.user || isFull}
                  title={isFull ? "Room is full" : undefined}
                >
                  {actioningId === r.user ? "Accepting..." : "accept"}
                </button>
                <button
                  className="rounded-lg bg-white/5 border border-red-500/30 px-4 py-1.5 text-sm font-medium text-red-400 transition-all duration-150 hover:bg-red-500/10 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => handledeny(r.user)}
                  disabled={actioningId === r.user}
                >
                  {actioningId === r.user ? "Denying..." : "deny"}
                </button>
              </div>
            </div>
          ))
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-zinc-500">
          you have no requests
        </div>
      )}
    </div>

    <div className="mt-5 border-t border-white/10 pt-4">
      <button
        onClick={handleCancelRoom}
        disabled={deleting}
        className="w-full rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Cancelling..." : "Cancel Session"}
      </button>
    </div>
    </>
  );
}
