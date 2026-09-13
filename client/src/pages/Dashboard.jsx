import { logout } from "../services/authServices";
import { authClient } from "../lib/auth-client";
import FormDialog from "../components/rooms/FormDialog.jsx";
import { useEffect, useState } from "react";
import Roomgrid from "../components/rooms/Roomgrid.jsx";
import Myrooms from "../components/rooms/Myrooms.jsx";
import { API_BASE } from "../lib/config";
import {
  Users,
  Search,
  X,
  LogOut,
  Compass,
  Layers,
  Sparkles,
  BookOpen,
} from "lucide-react";

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
    { id: "all", label: "All Sessions" },
    { id: "dsa", label: "DSA & LeetCode" },
    { id: "system", label: "System Design" },
    { id: "frontend", label: "Frontend / React" },
    { id: "backend", label: "Backend / API" },
  ];

  return (
    <div className="min-h-screen app-background text-zinc-100 selection:bg-violet-500/40 selection:text-white">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-[#23263b] bg-[#0d0e17]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 shadow-md shadow-violet-900/40">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold tracking-tight text-white">
                  StudyGroup
                </span>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                  LIVE
                </span>
              </div>
              <p className="hidden text-xs text-zinc-400 sm:block">
                Peer learning & collaborative study rooms
              </p>
            </div>
          </div>

          {/* Right Actions: Create Session + Profile */}
          <div className="flex items-center gap-3">
            <FormDialog rerender={rerender} />

            {/* User Profile Chip */}
            <div className="flex items-center gap-2.5 rounded-xl border border-[#2d324d] bg-[#161826] p-1.5 pr-3 shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm">
                {userInitials}
              </div>
              <span className="hidden text-xs font-medium text-zinc-200 sm:inline max-w-[120px] truncate">
                {userName}
              </span>
              <button
                onClick={logout}
                title="Log out"
                className="cursor-pointer rounded-lg p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-[#26293e] bg-gradient-to-r from-[#171929] via-[#141624] to-[#11121c] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-medium text-violet-300 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span>Peer Learning & Mock Interviews</span>
              </div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Welcome back, {userName.split(" ")[0]}!
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Join live peer study rooms, practice coding challenges, or host a session with classmates.
              </p>
            </div>

            {/* Stat Card */}
            <div className="flex items-center gap-4 rounded-2xl border border-[#2e334f] bg-[#1a1d2e] px-6 py-4 shadow-xl backdrop-blur-md shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-950/50">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">
                  {totalRooms}
                </div>
                <div className="text-xs font-medium text-zinc-400">
                  Active Sessions
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discovery & Navigation Controls */}
        <section className="mb-8 space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Segmented Tabs */}
            <div className="inline-flex items-center rounded-2xl border border-[#282b42] bg-[#141624] p-1.5 shadow-sm">
              <button
                onClick={() => setactiveTab("available")}
                className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "available"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-900/50"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Compass className="h-4 w-4" />
                <span>Available Sessions</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  activeTab === "available"
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-zinc-400"
                }`}>
                  {totalRooms}
                </span>
              </button>

              <button
                onClick={() => setactiveTab("mine")}
                className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "mine"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-900/50"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>My Sessions</span>
              </button>
            </div>

            {/* High-Contrast Search Input */}
            {activeTab === "available" && (
              <div className="relative w-full sm:w-84">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search by topic, track or host..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-[#2e334f] bg-[#161826] py-2.5 pl-10 pr-9 text-xs text-white placeholder:text-zinc-500 shadow-md outline-none transition-all focus:border-violet-500 focus:bg-[#1a1d2e] focus:ring-2 focus:ring-violet-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Track Filter Pills */}
          {activeTab === "available" && (
            <div className="flex flex-wrap items-center gap-2.5 border-t border-[#23263b] pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mr-1.5">
                Tracks:
              </span>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-violet-600 text-white shadow-md shadow-violet-900/40 border border-violet-500"
                        : "border border-[#2e334f] bg-[#161826] text-zinc-300 hover:border-violet-500/40 hover:bg-[#1c1f30]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Content Display */}
        <section className="min-h-[400px]">
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

        {/* Anchored Footer */}
        <footer className="mt-24 border-t border-[#23263b] pt-8 pb-12 text-center text-xs text-zinc-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-4 w-4 text-violet-400" />
            <span className="font-semibold text-zinc-400">StudyGroup Platform</span>
          </div>
          <p>Collaborative peer learning, mock coding interviews, and concept mastery.</p>
        </footer>
      </main>
    </div>
  );
}
