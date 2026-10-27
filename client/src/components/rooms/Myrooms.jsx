import { useCallback, useEffect, useState } from "react";
import { authClient } from "../../lib/auth-client";
import Myroomscard from "./Myroomscard";
import { API_BASE } from "../../lib/config";

export default function Myrooms() {
  const { data: session } = authClient.useSession();
  const [posted, setPosted] = useState([]);
  const [requested, setRequested] = useState([]);
  const [tab, setTab] = useState("posted");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!session?.user?.id) return;
    const id = setInterval(() => getmyrooms({ silent: true }), 20000);
    return () => clearInterval(id);
  }, [session, getmyrooms]);

  const activeRooms = tab === "posted" ? posted : requested;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setTab("posted")} aria-pressed={tab === "posted"} className="chip">
          Hosted by me
          <span className="opacity-70">{posted.length}</span>
        </button>
        <button
          onClick={() => setTab("requested")}
          aria-pressed={tab === "requested"}
          className="chip"
        >
          Applied
          <span className="opacity-70">{requested.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map((i) => (
            <div key={i} className="card h-56 animate-pulse" />
          ))}
        </div>
      ) : activeRooms.length === 0 ? (
        <div className="card flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
          <h3 className="text-base font-medium">
            {tab === "posted"
              ? "You haven't hosted any sessions"
              : "You haven't applied to any sessions"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted">
            {tab === "posted"
              ? "Select Create session in the top bar to schedule your first one."
              : "Open Available sessions and apply to study with others."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
