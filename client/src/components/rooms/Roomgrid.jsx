
import { useEffect, useState, useMemo } from "react";
import Roomcard from "./Roomcard";
import { BookOpen, SearchX, Sparkles } from "lucide-react";
import useNow from "../../hooks/useNow";
import { getMeetingStatus } from "../../lib/meetingTime";
import { API_BASE } from "../../lib/config";

export default function Roomgrid({
  rerender,
  searchQuery = "",
  selectedCategory = "all",
  onRoomCountChange,
}) {
  const [rooms, setrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  // Ticks every 15s so rooms whose meeting has ended drop out of the list
  // on their own, without the user needing to refresh.
  const now = useNow(15000);

  async function fetchRooms({ silent = false } = {}) {
    try {
      if (!silent) setLoading(true);
      let response = await fetch(`${API_BASE}/api/room`);
      let allrooms = await response.json();
      if (Array.isArray(allrooms)) {
        setrooms(allrooms);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, [rerender]);

  // Background refresh so new rooms/newly-full rooms show up for someone
  // browsing without them needing to reload the page. Silent (no loading
  // skeleton) so it doesn't interrupt anyone mid-scroll.
  useEffect(() => {
    const id = setInterval(() => fetchRooms({ silent: true }), 20000);
    return () => clearInterval(id);
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Hide rooms whose meeting time is already over. This is purely a
      // display filter - the room stays in the database untouched.
      if (getMeetingStatus(room, now) === "ended") return false;

      // Category filter
      if (selectedCategory !== "all") {
        const titleLower = (room.title || "").toLowerCase();
        const catLower = selectedCategory.toLowerCase();
        if (!titleLower.includes(catLower)) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTopic = (room.topic || "").toLowerCase().includes(query);
        const matchesTitle = (room.title || "").toLowerCase().includes(query);
        const matchesDesc = (room.desc || "").toLowerCase().includes(query);
        const matchesOwner = (room.ownername || "").toLowerCase().includes(query);
        return matchesTopic || matchesTitle || matchesDesc || matchesOwner;
      }

      return true;
    });
  }, [rooms, searchQuery, selectedCategory, now]);

  // Reports the visible (non-ended, filtered) count up to Dashboard, so the
  // "Active Sessions" stat matches what's actually on screen.
  useEffect(() => {
    if (onRoomCountChange) onRoomCountChange(filteredRooms.length);
  }, [filteredRooms, onRoomCountChange]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02] p-5"
          >
            <div className="h-4 w-20 rounded bg-white/10" />
            <div className="mt-4 h-6 w-3/4 rounded bg-white/10" />
            <div className="mt-2 h-4 w-1/2 rounded bg-white/5" />
            <div className="mt-6 flex gap-2">
              <div className="h-6 w-16 rounded-full bg-white/10" />
              <div className="h-6 w-16 rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredRooms.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/40 p-8 text-center backdrop-blur-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-400 shadow-inner">
          {searchQuery ? (
            <SearchX className="h-7 w-7 text-zinc-400" />
          ) : (
            <BookOpen className="h-7 w-7 text-violet-400" />
          )}
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">
          {searchQuery ? "No matching sessions found" : "No sessions available yet"}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-zinc-400">
          {searchQuery
            ? `We couldn't find any rooms matching "${searchQuery}". Try a different keyword or filter.`
            : "Be the first to create a peer study room and invite classmates!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRooms.map((room) => (
        <Roomcard key={room._id} room={room} onApplied={fetchRooms} />
      ))}
    </div>
  );
}