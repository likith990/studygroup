import { useCallback, useEffect, useState } from "react";
import { authClient } from "../../lib/auth-client";
import Myroomscard from "./Myroomscard";
import { Sparkles, CalendarClock, Inbox } from "lucide-react";
import { API_BASE } from "../../lib/config";

export default function Myrooms() {
  const { data: session } = authClient.useSession();
  const [posted, setPosted] = useState([]);
  const [requested, setRequested] = useState([]);
  const [tab, setTab] = useState("posted");
  const [loading, setLoading] = useState(true);

  // Pulled out of the effect (and memoized) so Accept/Deny/Cancel/Leave
  // actions further down the tree can trigger a refetch after they succeed,
  // instead of the list only updating on next mount.
  const getmyrooms = useCallback(async ({ silent = false } = {}) => {
    if (!session?.user?.id) return;
    try {
      if (!silent) setLoading(true);
      let response = await fetch(`${API_BASE}/api/room/myroom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      let data = await response.json();
      setPosted(data.posted || []);
      setRequested(data.requested || []);
    } catch (err) {
      console.error("Failed to load user rooms:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    getmyrooms();
  }, [getmyrooms]);

  // Background refresh so a host sees new join requests (and an attendee
  // sees an accept/deny) without needing to switch tabs or reload.
  useEffect(() => {
    if (!session?.user?.id) return;
    const id = setInterval(() => getmyrooms({ silent: true }), 20000);
    return () => clearInterval(id);
  }, [session, getmyrooms]);

  const activeRooms = tab === "posted" ? posted : requested;

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setTab("posted")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            tab === "posted"
              ? "bg-violet-600 text-white shadow-md shadow-violet-900/40"
              : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Hosted by Me</span>
          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] text-white">
            {posted.length}
          </span>
        </button>

        <button
          onClick={() => setTab("requested")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            tab === "requested"
              ? "bg-violet-600 text-white shadow-md shadow-violet-900/40"
              : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
          }`}
        >
          <CalendarClock className="h-3.5 w-3.5" />
          <span>Applied / Requested</span>
          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] text-white">
            {requested.length}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02] p-5"
            />
          ))}
        </div>
      ) : activeRooms.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/40 p-8 text-center backdrop-blur-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-400">
            <Inbox className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-white">
            {tab === "posted"
              ? "You haven't hosted any sessions yet"
              : "You haven't applied to any sessions yet"}
          </h3>
          <p className="mt-1 max-w-sm text-xs text-zinc-400">
            {tab === "posted"
              ? "Click 'Create Session' in the top bar to schedule your first room!"
              : "Browse the 'Available Sessions' tab and apply to study with peers."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activeRooms.map((room) => (
            <Myroomscard
              key={room._id}
              room={room}
              mode={tab}
              userId={session?.user?.id}
              onChange={getmyrooms}
            />
          ))}
        </div>
      )}
    </div>
  );
}
