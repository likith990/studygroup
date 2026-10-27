import { Search, Video, Mic, ScreenShare } from "lucide-react";

function StepVisual1() {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 rounded-md border border-line-strong bg-bg px-3 py-2">
        <Search className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />
        <span className="text-xs text-muted">Search by topic, track or host</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["DSA & LeetCode", "System design", "Frontend"].map((t, i) => (
          <span key={t} className={`chip !h-7 !px-2.5 !text-xs ${i === 0 ? "chip-active" : ""}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function StepVisual2() {
  return (
    <div className="card flex items-center justify-between gap-3 p-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="avatar">AR</span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Arjun requested a seat</p>
          <p className="text-xs text-muted">DSA interview prep</p>
        </div>
      </div>
      <span className="tag tag-ok shrink-0">Accepted</span>
    </div>
  );
}

function StepVisual3() {
  return (
    <div className="card p-4">
      <div className="grid grid-cols-2 gap-2">
        {["S", "M"].map((initial) => (
          <div
            key={initial}
            className="flex h-14 items-center justify-center rounded-md border border-line bg-raised"
          >
            <span className="avatar avatar-sm">{initial}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-muted">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line-strong">
          <Mic className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line-strong">
          <Video className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-ink">
          <ScreenShare className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
      </div>
    </div>
  );
}

const STEPS = [
  {
    n: "1",
    title: "Find your session",
    desc: "Browse sessions by topic, skill or learning goal.",
    Visual: StepVisual1,
  },
  {
    n: "2",
    title: "Get in",
    desc: "Request a seat and connect with people working toward the same goal.",
    Visual: StepVisual2,
  },
  {
    n: "3",
    title: "Learn together",
    desc: "Enter the live room and study, practice, discuss or interview together.",
    Visual: StepVisual3,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="landing-section border-t border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="section-title max-w-xl">Pick a session. Get accepted. Show up.</h2>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step) => (
            <div key={step.n}>
              <span className="text-sm font-medium text-accent">Step {step.n}</span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.desc}</p>
              <div className="mt-5" aria-hidden="true">
                <step.Visual />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
