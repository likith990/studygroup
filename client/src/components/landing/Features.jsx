import {
  Radio,
  Search,
  CalendarPlus,
  ShieldCheck,
  Video,
  ScreenShare,
} from "lucide-react";
import useReveal from "../../hooks/useReveal";

const FEATURES = [
  {
    icon: Radio,
    title: "Live study rooms",
    desc: "Join focused sessions with other learners working toward the same goal.",
  },
  {
    icon: Search,
    title: "Session discovery",
    desc: "Search and filter sessions by learning track, host or time.",
  },
  {
    icon: CalendarPlus,
    title: "Host your own session",
    desc: "Choose the topic, start time, duration and capacity — you set the terms.",
  },
  {
    icon: ShieldCheck,
    title: "Request-based access",
    desc: "Hosts review and accept or decline every request. You control who's in your room.",
  },
  {
    icon: Video,
    title: "Real-time video",
    desc: "Actually meet and study together in a live audio and video room.",
  },
  {
    icon: ScreenShare,
    title: "Screen sharing",
    desc: "Explain code, concepts and problems visually, right inside the session.",
  },
];

export default function Features() {
  const [ref, visible] = useReveal();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} mb-14 max-w-xl`}>
          <p className="ls-eyebrow">The product</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to find people and actually meet them.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#23263b] bg-[#23263b] sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`reveal reveal-${(i % 4) + 1} ${
                visible ? "is-visible" : ""
              } group relative bg-[#0e0f1a] p-7 transition-colors duration-300 hover:bg-[#141624]`}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/0 to-transparent transition-colors duration-300 group-hover:from-violet-600/[0.06]" />
              <div className="relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2d324d] bg-[#161826] text-violet-400 transition-colors duration-300 group-hover:border-violet-500/40 group-hover:text-violet-300">
                  <f.icon className="h-[18px] w-[18px]" />
                </span>
                <h3 className="mt-4 font-display text-[15px] font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
