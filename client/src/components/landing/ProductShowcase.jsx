import { Search, Users, Calendar, Timer, User } from "lucide-react";

const CATEGORIES = ["All sessions", "DSA & LeetCode", "System design", "Frontend", "Backend"];

const CARDS = [
  {
    track: "DSA & LeetCode",
    topic: "DSA Blind 75 evening sprint",
    desc: "Working through arrays, strings and two-pointer patterns together.",
    host: "Priya",
    time: "Today, 7:30 PM",
    duration: "60 min",
    seats: "3/4",
  },
  {
    track: "Frontend",
    topic: "React architecture study",
    desc: "Component design, state management and rendering performance.",
    host: "Marco",
    time: "Today, 8:00 PM",
    duration: "45 min",
    seats: "2/3",
  },
  {
    track: "Backend",
    topic: "Backend mock interview",
    desc: "System design questions with live feedback from a peer.",
    host: "Sana",
    time: "Today, 9:30 PM",
    duration: "30 min",
    seats: "1/2",
  },
];

export default function ProductShowcase() {
  return (
    <section id="sessions" className="landing-section border-t border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="section-title max-w-xl">Every session, searchable and filterable.</h2>
        <p className="section-lead">
          Filter by learning track, check who is hosting, and see how many seats are open before
          you request one.
        </p>

        <div className="card mt-12 p-4 sm:p-6" aria-hidden="true">
          <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium">Available sessions</span>
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                strokeWidth={1.75}
              />
              <div className="input pl-9 text-muted">Search sessions</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 py-5">
            {CATEGORIES.map((c, i) => (
              <span key={c} className={`chip ${i === 0 ? "chip-active" : ""}`}>
                {c}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {CARDS.map((c) => (
              <div key={c.topic} className="card flex flex-col bg-bg p-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-[15px] font-semibold leading-snug">{c.topic}</h4>
                    <span className="tag shrink-0">{c.track}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{c.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {c.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Timer className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {c.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {c.host}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {c.seats} booked
                  </span>
                  <span className="btn btn-primary btn-sm">Apply to join</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-center text-xs text-muted">
            Illustrative sessions. Real ones are created by students like you.
          </p>
        </div>
      </div>
    </section>
  );
}
