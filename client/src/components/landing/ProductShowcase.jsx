import { Search, Users, Calendar, Timer, ArrowRight, Sparkles } from "lucide-react";
import useReveal from "../../hooks/useReveal";

const CATEGORIES = ["All Sessions", "DSA & LeetCode", "System Design", "Frontend", "Backend"];

const CARDS = [
  {
    track: "DSA & LEETCODE",
    trackStyle: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    topic: "DSA Blind 75 — Evening Sprint",
    desc: "Working through arrays, strings and two-pointer patterns together.",
    host: "Priya",
    time: "Today, 7:30 PM",
    duration: "60 mins",
    seats: "3 / 4",
    action: "Apply to Join",
  },
  {
    track: "FRONTEND",
    trackStyle: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    topic: "React Architecture Study",
    desc: "Component design, state management and rendering performance.",
    host: "Marco",
    time: "Today, 8:00 PM",
    duration: "45 mins",
    seats: "2 / 3",
    action: "Apply to Join",
  },
  {
    track: "BACKEND",
    trackStyle: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    topic: "Backend Mock Interview",
    desc: "System design questions with live feedback from a peer.",
    host: "Sana",
    time: "Today, 9:30 PM",
    duration: "30 mins",
    seats: "1 / 2",
    action: "Apply to Join",
  },
];

export default function ProductShowcase() {
  const [ref, visible] = useReveal();

  return (
    <section id="sessions" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} mx-auto mb-14 max-w-xl text-center`}>
          <p className="ls-eyebrow">Session discovery</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Every session, searchable and filterable.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
            Filter by learning track, check who's hosting, and see exactly how
            many seats are open before you request one.
          </p>
        </div>

        <div
          className={`reveal reveal-2 ${
            visible ? "is-visible" : ""
          } ls-glass mx-auto max-w-5xl rounded-3xl p-4 shadow-2xl shadow-black/50 sm:p-6`}
        >
          {/* toolbar */}
          <div className="flex flex-col gap-4 border-b border-[#23263b] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600">
                <Users className="h-4 w-4 text-white" />
              </span>
              <span className="font-display text-sm font-bold text-white">Available Sessions</span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <div className="w-full rounded-xl border border-[#2e334f] bg-[#161826] py-2 pl-9 pr-3 text-xs text-zinc-500">
                Search sessions…
              </div>
            </div>
          </div>

          {/* category pills */}
          <div className="flex flex-wrap gap-2 py-5">
            {CATEGORIES.map((c, i) => (
              <span
                key={c}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold ${
                  i === 0
                    ? "bg-violet-600 text-white shadow shadow-violet-900/40"
                    : "border border-[#2e334f] bg-[#161826] text-zinc-400"
                }`}
              >
                {c}
              </span>
            ))}
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CARDS.map((c) => (
              <div
                key={c.topic}
                className="tilt-card flex flex-col justify-between rounded-2xl border border-[#25283c] bg-[#141624] p-4"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[9.5px] font-bold tracking-wide ${c.trackStyle}`}
                    >
                      {c.track}
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-[9px] font-bold text-white">
                      {c.host[0]}
                    </span>
                  </div>
                  <h4 className="font-display text-[14.5px] font-bold leading-snug text-white">
                    {c.topic}
                  </h4>
                  <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-zinc-500">
                    {c.desc}
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#2d324d] bg-[#1a1d2e] px-2 py-1 text-[10px] text-zinc-300">
                      <Calendar className="h-3 w-3 text-violet-400" />
                      {c.time}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#2d324d] bg-[#1a1d2e] px-2 py-1 text-[10px] text-zinc-300">
                      <Timer className="h-3 w-3 text-indigo-400" />
                      {c.duration}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#25283c] pt-3.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400">
                    <Users className="h-3 w-3 text-emerald-400" />
                    {c.seats} booked
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-2.5 py-1.5 text-[10.5px] font-semibold text-white">
                    {c.action}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-zinc-600">
            <Sparkles className="h-3 w-3 text-violet-500" />
            Illustrative sessions — real ones are created by students like you
          </div>
        </div>
      </div>
    </section>
  );
}
