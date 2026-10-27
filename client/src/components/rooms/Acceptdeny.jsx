import { useState } from "react";
import { authClient } from "../../lib/auth-client";
import useNow from "../../hooks/useNow";
import { getMeetingStatus, getJoinLabel } from "../../lib/meetingTime";
import { API_BASE } from "../../lib/config";

export default function Acceptdeny({ room, onChange = () => {} }) {
  const { data: session } = authClient.useSession();
  const now = useNow(15000);
  const meetingStatus = getMeetingStatus(room, now);
  const canJoin = meetingStatus === "live";

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

  const pending = room.requests?.filter((r) => r.status === "pending") || [];

  return (
    <div className="space-y-5">
      {error && <div className="alert alert-error">{error}</div>}

      {room.meetlink &&
        (canJoin ? (
          <a
            href={room.meetlink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-block"
          >
            Join meeting
          </a>
        ) : (
          <span
            title={
              meetingStatus === "ended"
                ? "This meeting has already ended"
                : "Joining unlocks once your session starts"
            }
            aria-disabled="true"
            className="btn btn-static btn-block"
          >
            {getJoinLabel(room, now)}
          </span>
        ))}

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium">Booked</h4>
          <span className="text-xs text-muted">
            {bookedlength}/{room.capacity}
          </span>
        </div>

        {bookedlength > 0 ? (
          <ul className="divide-y divide-line rounded-md border border-line">
            {room.booked.map((r) => (
              <li key={r.bookedname} className="flex items-center gap-2.5 px-3 py-2">
                <span className="avatar avatar-sm" aria-hidden="true">
                  {r.bookedname?.charAt(0).toUpperCase()}
                </span>
                <span className="truncate text-sm">{r.bookedname}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No one booked yet</p>
        )}
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium">Requests</h4>
          <span className="text-xs text-muted">{reqlength} pending</span>
        </div>

        {isFull && reqlength > 0 && (
          <p className="mb-2 text-xs text-warn">
            The room is full. Deny a request or wait for a seat to open before accepting more.
          </p>
        )}

        {pending.length > 0 ? (
          <ul className="divide-y divide-line rounded-md border border-line">
            {pending.map((r) => (
              <li key={r.user} className="flex items-center justify-between gap-3 px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="avatar avatar-sm" aria-hidden="true">
                    {r.requsername?.charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate text-sm">{r.requsername}</span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleaccept(r.user)}
                    disabled={actioningId === r.user || isFull}
                    title={isFull ? "Room is full" : undefined}
                  >
                    {actioningId === r.user ? "Accepting..." : "Accept"}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handledeny(r.user)}
                    disabled={actioningId === r.user}
                  >
                    {actioningId === r.user ? "Denying..." : "Deny"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No pending requests</p>
        )}
      </section>

      <div className="border-t border-line pt-4">
        <button
          onClick={handleCancelRoom}
          disabled={deleting}
          className="btn btn-danger btn-sm btn-block"
        >
          {deleting ? "Cancelling..." : "Cancel session"}
        </button>
      </div>
    </div>
  );
}
