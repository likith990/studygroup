import { Sparkles, Users, Radio, CheckCircle2, ArrowRight } from "lucide-react";
import { login } from "../../services/authServices";
import useReveal from "../../hooks/useReveal";

function scrollToId(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const SESSIONS = [
  {
    title: "DSA Interview Prep",
    track: "DSA & LeetCode",
    seats: "3 / 4",
    full: false,
    time: "Today · 7:30 PM",
    action: "Join session",
    tone: "emerald",
  },
  {
    title: "React System Design",
    track: "Frontend",
    seats: "2 / 3",
    full: false,
    time: "Today · 9:00 PM",
    action: "Request to join",
    tone: "violet",
  },
  {
    title: "Mock Interview — Backend",
    track: "Backend",
    seats: "1 / 2",
    full: false,
    time: "Tomorrow · 6:00 PM",
    action: "Join",
    tone: "sky",
  },
];

export default function Hero() {
  const [ref, visible] = useReveal();

  return (
    <section id="top" className="relative pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Copy column */}
        <div ref={ref} className={`reveal ${visible ? "is-visible" : ""}`}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1.5 text-xs font-medium text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Peer learning, live</span>
          </div>

          <h1 className="text-balance font-display text-[2.75rem] font-bold leading-[1.05] tracking-tight text-white sm:text-[3.4rem] lg:text-[3.75rem]">
            Stop studying <span className="gradient-text">alone.</span>
          </h1>

          <p className="mt-6 max-w-lg text-balance text-[1.05rem] leading-relaxed text-zinc-400 sm:text-lg">
            Find people learning the same thing, join focused study sessions,
            and meet in a live room to actually work through it together.
          </p>

          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <button
              onClick={login}
              className="btn-primary group flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_auto] px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-violet-950/50"
            >
              Start studying together
              <ArrowRight className="btn-arrow h-4 w-4" />
            </button>
            <button
              onClick={() => scrollToId("#how-it-works")}
              className="link-cta group flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#2e334f] bg-[#141624]/60 px-6 py-3.5 text-[15px] font-semibold text-zinc-200 transition-colors hover:border-[#3d4266] hover:text-white"
            >
              See how it works
            </button>
          </div>

          <div className="mt-10 flex items-center gap-3 text-xs text-zinc-500">
            <div className="flex -space-x-2">
              {["from-violet-500 to-indigo-500", "from-sky-500 to-blue-600", "from-emerald-500 to-teal-600", "from-amber-500 to-orange-600"].map(
                (grad, i) => (
                  <div
                    key={i}
                    className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr ${grad} text-[10px] font-bold text-white ring-2 ring-[#0a0b12]`}
                  >
                    {["A", "M", "S", "K"][i]}
                  </div>
                )
              )}
            </div>
            <span>Real students, currently studying DSA, React and system design</span>
          </div>
        </div>

        {/* Visual column */}
        <div className="hero-visual relative mx-auto w-full max-w-md lg:max-w-none">
          {/* Ambient glow behind the window */}
          <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-tr from-violet-600/25 via-indigo-600/10 to-transparent blur-3xl" />

          <div className="hero-window ls-glass relative rounded-2xl p-1.5 shadow-2xl shadow-black/60">
            <div className="rounded-xl border border-[#23263b] bg-[#0d0e17] p-4 sm:p-5">
              {/* window chrome */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-tr from-violet-600 to-indigo-600">
                    <Users className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="font-display text-sm font-bold text-white">StudyGroup</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  LIVE SESSIONS
                </div>
              </div>

              <div className="space-y-2.5">
                {SESSIONS.map((s, i) => (
                  <div
                    key={s.title}
                    className="animate-float-slow rounded-xl border border-[#23263b] bg-[#141624] p-3.5"
                    style={{ animationDelay: `${i * 0.6}s` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-white">{s.title}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">{s.time}</p>
                      </div>
                      <span className="shrink-0 rounded-md border border-[#2d324d] bg-[#1a1d2e] px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                        {s.seats}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400/70" />
                        {s.track}
                      </span>
                      <span
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${
                          i === 0
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white"
                            : "border border-[#2e334f] bg-[#1a1d2e] text-zinc-200"
                        }`}
                      >
                        {s.action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating toast: acceptance */}
          <div
            className="floating-toast ls-glass absolute -left-6 top-8 hidden max-w-[190px] rounded-xl px-3.5 py-2.5 shadow-xl sm:block"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <p className="text-[11.5px] font-medium leading-snug text-zinc-200">
                Alex accepted your request
              </p>
            </div>
          </div>

          {/* Floating toast: participants joining */}
          <div
            className="floating-toast ls-glass absolute -right-4 top-1/2 hidden max-w-[170px] -translate-y-1/2 rounded-xl px-3.5 py-2.5 shadow-xl sm:block"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 shrink-0 text-violet-400" />
              <p className="text-[11.5px] font-medium leading-snug text-zinc-200">
                3 people joined
              </p>
            </div>
          </div>

          {/* Floating toast: countdown */}
          <div
            className="floating-toast ls-glass absolute -bottom-6 left-6 hidden max-w-[190px] rounded-xl px-3.5 py-2.5 shadow-xl sm:block"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-amber-400" />
              </span>
              <p className="text-[11.5px] font-medium leading-snug text-zinc-200">
                Session starting in 12 min
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
