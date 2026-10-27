import { useEffect, useState, useMemo } from "react";
import Roomcard from "./Roomcard";
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

  useEffect(() => {
    const id = setInterval(() => fetchRooms({ silent: true }), 20000);
    return () => clearInterval(id);
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (getMeetingStatus(room, now) === "ended") return false;

      if (selectedCategory !== "all") {
        const titleLower = (room.title || "").toLowerCase();
        const catLower = selectedCategory.toLowerCase();
        if (!titleLower.includes(catLower)) return false;
      }

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

  useEffect(() => {
    if (onRoomCountChange) onRoomCountChange(filteredRooms.length);
  }, [filteredRooms, onRoomCountChange]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card h-56 animate-pulse p-5">
            <div className="h-4 w-2/3 rounded bg-raised" />
            <div className="mt-4 h-3 w-full rounded bg-raised" />
            <div className="mt-2 h-3 w-4/5 rounded bg-raised" />
            <div className="mt-6 h-3 w-1/2 rounded bg-raised" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredRooms.length === 0) {
    return (
      <div className="card flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
        <h3 className="text-base font-medium">
          {searchQuery ? "No matching sessions" : "No sessions yet"}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted">
          {searchQuery
            ? `Nothing matches "${searchQuery}". Try a different keyword or track.`
            : "Create the first session and invite others to join."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredRooms.map((room) => (
        <Roomcard key={room._id} room={room} onApplied={fetchRooms} />
      ))}
    </div>
  );
}
