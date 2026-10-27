import { Radio, Search, CalendarPlus, ShieldCheck, Video, ScreenShare } from "lucide-react";

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
    desc: "Choose the topic, start time, duration and capacity. You set the terms.",
  },
  {
    icon: ShieldCheck,
    title: "Request-based access",
    desc: "Hosts accept or decline every request, so you control who is in your room.",
  },
  {
    icon: Video,
    title: "Real-time video",
    desc: "Meet and study together in a live audio and video room.",
  },
  {
    icon: ScreenShare,
    title: "Screen sharing",
    desc: "Explain code, concepts and problems visually, right inside the session.",
  },
];

export default function Features() {
  return (
    <section className="landing-section border-t border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="section-title max-w-xl">
          Everything you need to find people and actually meet them.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-bg p-7">
              <f.icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
              <h3 className="mt-4 text-[15px] font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
