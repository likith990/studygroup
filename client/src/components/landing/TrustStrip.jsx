import { Radio, Users2, SlidersHorizontal, Target } from "lucide-react";
import useReveal from "../../hooks/useReveal";

const INDICATORS = [
  { icon: Radio, label: "Live study rooms" },
  { icon: Users2, label: "Real-time collaboration" },
  { icon: SlidersHorizontal, label: "Flexible session sizes" },
  { icon: Target, label: "Focused learning" },
];

const TRACKS = ["DSA", "System Design", "Frontend", "Backend", "Exam Prep"];

export default function TrustStrip() {
  const [ref, visible] = useReveal();

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div ref={ref} className={`reveal ${visible ? "is-visible" : ""}`}>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Built for the way people actually learn
          </p>

          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {INDICATORS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="tilt-card flex items-center gap-2.5 rounded-xl border border-[#23263b] bg-[#101223]/60 px-4 py-3.5 hover:border-violet-500/30"
              >
                <Icon className="h-4 w-4 shrink-0 text-violet-400" />
                <span className="text-[13px] font-medium text-zinc-300">{label}</span>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
              From first concept to interview day
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {TRACKS.map((t) => (
                <span key={t} className="font-display text-sm font-semibold text-zinc-400">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="section-fade-line mx-auto mt-16 max-w-5xl" />
    </section>
  );
}
