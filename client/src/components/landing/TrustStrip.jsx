import { Radio, Users2, SlidersHorizontal, Target } from "lucide-react";

const INDICATORS = [
  { icon: Radio, label: "Live study rooms" },
  { icon: Users2, label: "Real-time collaboration" },
  { icon: SlidersHorizontal, label: "Flexible session sizes" },
  { icon: Target, label: "Focused learning" },
];

const TRACKS = ["DSA", "System design", "Frontend", "Backend", "Exam prep"];

export default function TrustStrip() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul className="grid grid-cols-2 sm:grid-cols-4 sm:divide-x sm:divide-line">
          {INDICATORS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 px-2 py-6 text-sm text-muted sm:px-6">
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {label}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-sm text-muted sm:px-6">
          From first concept to interview day: {TRACKS.join(", ")}.
        </p>
      </div>
    </section>
  );
}
