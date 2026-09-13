import { Search, ArrowRight, Video, Mic, ScreenShare } from "lucide-react";
import useReveal from "../../hooks/useReveal";

function StepVisual1() {
  return (
    <div className="ls-panel rounded-xl p-4">
      <div className="flex items-center gap-2 rounded-lg border border-[#2d324d] bg-[#0d0e17] px-3 py-2">
        <Search className="h-3.5 w-3.5 text-zinc-500" />
        <span className="text-[12px] text-zinc-500">Search by topic, track or host…</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["DSA & LeetCode", "System Design", "Frontend"].map((t, i) => (
          <span
            key={t}
            className={`rounded-lg px-2.5 py-1 text-[10.5px] font-semibold ${
              i === 0
                ? "bg-violet-600 text-white"
                : "border border-[#2d324d] bg-[#1a1d2e] text-zinc-400"
            }`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function StepVisual2() {
  return (
    <div className="ls-panel flex items-center justify-between rounded-xl p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-[11px] font-bold text-white">
          AR
        </span>
        <div>
          <p className="text-[12.5px] font-semibold text-white">Arjun requested a seat</p>
          <p className="text-[10.5px] text-zinc-500">DSA Interview Prep</p>
        </div>
      </div>
      <span className="animate-gradient-pan rounded-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 px-2.5 py-1 text-[10.5px] font-bold text-white">
        Accepted
      </span>
    </div>
  );
}

function StepVisual3() {
  return (
    <div className="ls-panel rounded-xl p-4">
      <div className="grid grid-cols-2 gap-2">
        {["S", "M"].map((initial, i) => (
          <div
            key={initial}
            className="video-tile flex h-14 items-center justify-center rounded-lg border border-[#23263b]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
              {initial}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1a1d2e] text-zinc-300">
          <Mic className="h-3 w-3" />
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1a1d2e] text-zinc-300">
          <Video className="h-3 w-3" />
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600 text-white">
          <ScreenShare className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Find your session",
    desc: "Browse sessions by topic, skill or learning goal.",
    Visual: StepVisual1,
  },
  {
    n: "02",
    title: "Get in",
    desc: "Request a seat and connect with people working toward the same goal.",
    Visual: StepVisual2,
  },
  {
    n: "03",
    title: "Learn together",
    desc: "Enter the live room and study, practice, discuss or interview together.",
    Visual: StepVisual3,
  },
];

export default function HowItWorks() {
  const [ref, visible] = useReveal();

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} mb-16 max-w-xl`}>
          <p className="ls-eyebrow">How it works</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pick a session. Get accepted. Show up.
          </h2>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {/* connecting line on desktop */}
          <div className="section-fade-line absolute left-0 right-0 top-[76px] hidden md:block" />

          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className={`reveal reveal-${i + 1} ${visible ? "is-visible" : ""} relative`}
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="font-display text-3xl font-bold text-zinc-700">{step.n}</span>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 text-zinc-700 md:block" />
                )}
              </div>
              <h3 className="font-display text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-zinc-400">{step.desc}</p>
              <div className="mt-5">
                <step.Visual />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
