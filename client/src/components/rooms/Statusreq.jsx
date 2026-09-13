import { useEffect, useState } from "react"

import { authClient } from "../../lib/auth-client"
import useNow from "../../hooks/useNow";
import { getMeetingStatus, getJoinLabel } from "../../lib/meetingTime";
import { API_BASE } from "../../lib/config";


export default function Statusreq({ room, onChange = () => {} }){
    const { data: session } = authClient.useSession();
    const[status,setstatus]=useState("pending");
    // Ticking clock so the join button enables/disables itself right at
    // meeting start/end without needing a page refresh.
    const now = useNow(15000);
    const meetingStatus = getMeetingStatus(room, now);
    const canJoin = meetingStatus === "live";
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");


    useEffect(()=>{
        function getstatus(){
        let request=room.requests.filter((r)=>r.authid===session.user.id);
        if(request.length>0){
            setstatus(request[0].status);

        }
        

    }
    getstatus();
    },[room, session]);

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

    return(
        
         <div className="mt-3 space-y-2">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-zinc-500">Status</span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                status === "accepted"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : status === "rejected"
                  ? "bg-red-500/10 text-red-400 border border-red-500/30"
                  : "bg-white/5 text-zinc-300 border border-white/10"
              }`}
            >
              {status}
            </span>
          </div>

          {status === "accepted" && (
            canJoin ? (
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
                    : "The join button unlocks once the session starts"
                }
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-500"
              >
                {getJoinLabel(room, now)}
              </span>
            )
          )}

          {status === "pending" && (
            <button
              onClick={handleWithdraw}
              disabled={submitting}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Withdrawing..." : "Withdraw request"}
            </button>
          )}

          {status === "accepted" && (
            <button
              onClick={handleLeave}
              disabled={submitting}
              className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Leaving..." : "Leave session"}
            </button>
          )}
        </div>


        
    )
}
