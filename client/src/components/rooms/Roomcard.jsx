import { useState } from "react";
import { Timer, Users, Calendar, Loader2, Lock, User } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { API_BASE } from "../../lib/config";
import useNow from "../../hooks/useNow";
import { getMeetingStatus, getJoinLabel } from "../../lib/meetingTime";
import Meta from "./Meta";

export default function Roomcard({ room, onApplied }) {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [appliedLocal, setAppliedLocal] = useState(false);
  const now = useNow(15000);

  const currentUserId = session?.user?.id;
  const currentUserName = session?.user?.name;

  const isHost =
    room.owner === currentUserId ||
    (room.ownername &&
      currentUserName &&
      room.ownername.toLowerCase() === currentUserName.toLowerCase());

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

  let action;
  if (isHost || status === "accepted") {
    action = canJoin ? (
      <a
        href={room.meetlink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary btn-block"
      >
        Join meeting
      </a>
    ) : (
      <div
        title={
          meetingStatus === "ended"
            ? "This meeting has already ended"
            : "Joining unlocks once the session starts"
        }
        aria-disabled="true"
        className="btn btn-static btn-block"
      >
        <Lock className="h-3.5 w-3.5" strokeWidth={1.75} />
        {getJoinLabel(room, now)}
      </div>
    );
  } else if (status === "rejected") {
    action = <div className="btn btn-static btn-block text-bad">Request declined</div>;
  } else if (hasApplied) {
    action = <div className="btn btn-static btn-block">Request pending</div>;
  } else if (isFull) {
    action = <div className="btn btn-static btn-block">Session full</div>;
  } else {
    action = (
      <button onClick={handleApply} disabled={loading} className="btn btn-primary btn-block">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending
          </>
        ) : (
          "Apply to join"
        )}
      </button>
    );
  }

  return (
    <article className="card card-hover flex h-full flex-col p-5">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug">{room.topic}</h3>
          <span className="tag max-w-[40%] shrink-0">{room.title}</span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{room.desc}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted">
          <Meta icon={Calendar}>
            {new Date(room.starttime).toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Meta>
          <Meta icon={Timer}>{room.duration} min</Meta>
          <Meta icon={Users}>
            {bookedCount}/{room.capacity} booked
          </Meta>
          <Meta icon={User}>{isHost ? "You" : room.ownername || "Host"}</Meta>
        </div>
      </div>

      <div className="mt-5">{action}</div>
    </article>
  );
}
