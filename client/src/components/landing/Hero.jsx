import { login } from "../../services/authServices";

function scrollToId(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const SESSIONS = [
  { title: "DSA interview prep", track: "DSA & LeetCode", seats: "3/4", time: "Today, 7:30 PM" },
  { title: "React system design", track: "Frontend", seats: "2/3", time: "Today, 9:00 PM" },
  { title: "Backend mock interview", track: "Backend", seats: "1/2", time: "Tomorrow, 6:00 PM" },
];

export default function Hero() {
  return (
    <section id="top" className="landing-section">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Stop studying alone.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Find people learning the same thing, join focused study sessions, and meet in a live
            room to work through it together.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button onClick={login} className="btn btn-primary btn-lg">
              Start studying together
            </button>
            <button onClick={() => scrollToId("#how-it-works")} className="btn btn-secondary btn-lg">
              See how it works
            </button>
          </div>

          <p className="mt-8 text-sm text-muted">
            Students are studying DSA, React and system design right now.
          </p>
        </div>

        <div className="card overflow-hidden" aria-hidden="true">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <span className="text-sm font-medium">Open sessions</span>
            <span className="text-xs text-muted">{SESSIONS.length} starting soon</span>
          </div>
          <ul className="divide-y divide-line">
            {SESSIONS.map((s) => (
              <li key={s.title} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{s.time}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-muted">{s.seats} booked</span>
                  <span className="tag hidden sm:inline-flex">{s.track}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
