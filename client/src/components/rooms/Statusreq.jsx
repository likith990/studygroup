import { useEffect, useState } from "react";
import { authClient } from "../../lib/auth-client";
import useNow from "../../hooks/useNow";
import { getMeetingStatus, getJoinLabel } from "../../lib/meetingTime";
import { API_BASE } from "../../lib/config";

export default function Statusreq({ room, onChange = () => {} }) {
  const { data: session } = authClient.useSession();
  const [status, setstatus] = useState("pending");
  const now = useNow(15000);
  const meetingStatus = getMeetingStatus(room, now);
  const canJoin = meetingStatus === "live";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function getstatus() {
      let request = room.requests.filter((r) => r.authid === session.user.id);
      if (request.length > 0) {
        setstatus(request[0].status);
      }
    }
    getstatus();
  }, [room, session]);

  async function handleWithdraw() {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/room/cancel-request`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomid: room._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't withdraw your request.");
        return;
      }
      onChange();
    } catch (err) {
      console.error("Failed to withdraw request:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLeave() {
    if (submitting) return;
    const confirmed = window.confirm("Leave this session? You'll lose your seat.");
    if (!confirmed) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/room/leave`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomid: room._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't leave this session.");
        return;
      }
      onChange();
    } catch (err) {
      console.error("Failed to leave room:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">Request status</span>
        <span
          className={`tag capitalize ${
            status === "accepted" ? "tag-ok" : status === "rejected" ? "tag-bad" : ""
          }`}
        >
          {status}
        </span>
      </div>

      {status === "accepted" &&
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
                : "Joining unlocks once the session starts"
            }
            aria-disabled="true"
            className="btn btn-static btn-block"
          >
            {getJoinLabel(room, now)}
          </span>
        ))}

      {status === "pending" && (
        <button
          onClick={handleWithdraw}
          disabled={submitting}
          className="btn btn-secondary btn-sm btn-block"
        >
          {submitting ? "Withdrawing..." : "Withdraw request"}
        </button>
      )}

      {status === "accepted" && (
        <button
          onClick={handleLeave}
          disabled={submitting}
          className="btn btn-danger btn-sm btn-block"
        >
          {submitting ? "Leaving..." : "Leave session"}
        </button>
      )}
    </div>
  );
}
