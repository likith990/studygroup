import { logout } from "../services/authServices";
import { authClient } from "../lib/auth-client";
import FormDialog from "../components/rooms/FormDialog.jsx";
import { useEffect, useState } from "react";
import Roomgrid from "../components/rooms/Roomgrid.jsx";
import Myrooms from "../components/rooms/Myrooms.jsx";
import { API_BASE } from "../lib/config";
import { Search, X, LogOut } from "lucide-react";

export default function Dashboard() {
  const { data: session } = authClient.useSession();
  const [activeTab, setactiveTab] = useState("available");
  const [refresh, setrefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [totalRooms, setTotalRooms] = useState(0);

  useEffect(() => {
    async function checkuser() {
      if (!session?.user?.id) return;
      try {
        let response = await fetch(`${API_BASE}/api/user/check`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
          }),
        });
        await response.json();
      } catch (err) {
        console.error("checkuser error:", err);
      }
    }

    checkuser();
  }, [session?.user?.id]);

  function rerender() {
    setrefresh((prev) => !prev);
  }

  const userName = session?.user?.name || "Student";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const categories = [
    { id: "all", label: "All sessions" },
    { id: "dsa", label: "DSA & LeetCode" },
    { id: "system", label: "System design" },
    { id: "frontend", label: "Frontend / React" },
    { id: "backend", label: "Backend / API" },
  ];

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-bg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="text-base font-semibold tracking-tight">StudyGroup</span>

          <div className="flex items-center gap-3">
            <FormDialog rerender={rerender} />
            <div className="flex items-center gap-2 border-l border-line pl-3">
              <span className="avatar" aria-hidden="true">
                {userInitials}
              </span>
              <span className="hidden max-w-[140px] truncate text-sm text-muted sm:inline">
                {userName}
              </span>
              <button
                onClick={logout}
                title="Log out"
                aria-label="Log out"
                className="btn btn-ghost btn-icon"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {userName.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {totalRooms} active {totalRooms === 1 ? "session" : "sessions"}
          </p>
        </div>

        <div className="flex flex-col gap-3 border-b border-line sm:flex-row sm:items-end sm:justify-between">
          <div role="tablist" className="flex gap-6">
            <button
              role="tab"
              aria-selected={activeTab === "available"}
              onClick={() => setactiveTab("available")}
              className="tab"
            >
              Available sessions
              <span className="ml-2 text-xs font-normal text-muted">{totalRooms}</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "mine"}
              onClick={() => setactiveTab("mine")}
              className="tab"
            >
              My sessions
            </button>
          </div>

          {activeTab === "available" && (
            <div className="relative mb-3 w-full sm:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                strokeWidth={1.75}
              />
              <input
                type="text"
                aria-label="Search sessions"
                placeholder="Search by topic, track or host"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted transition-colors hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {activeTab === "available" && (
          <div
            role="group"
            aria-label="Filter by track"
            className="mt-5 flex flex-wrap items-center gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={selectedCategory === cat.id}
                className="chip"
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        <section className="mt-8 min-h-[320px]">
          {activeTab === "available" ? (
            <Roomgrid
              rerender={refresh}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onRoomCountChange={setTotalRooms}
            />
          ) : (
            <Myrooms />
          )}
        </section>

        <footer className="mt-20 border-t border-line pt-8 text-center text-xs text-muted">
          StudyGroup. Peer learning and collaborative study rooms.
        </footer>
      </main>
    </div>
  );
}
