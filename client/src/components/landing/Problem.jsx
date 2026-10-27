import { X, Check } from "lucide-react";

const ALONE = ["47 tabs open", "No accountability", "Questions pile up", "Motivation drops"];
const TOGETHER = ["One focused session", "A shared goal", "Real conversation", "Instant feedback"];

export default function Problem() {
  return (
    <section className="landing-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="section-title max-w-2xl">Studying alone is surprisingly inefficient.</h2>
        <p className="section-lead">
          You can watch another tutorial, read another article or open another tab. But sometimes
          you just need another person.
        </p>

        <div className="card mt-12 grid grid-cols-1 overflow-hidden sm:grid-cols-2 sm:divide-x sm:divide-line">
          <div className="p-8">
            <h3 className="text-sm font-medium text-muted">Studying alone</h3>
            <ul className="mt-6 space-y-4">
              {ALONE.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-muted">
                  <X className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-line p-8 sm:border-t-0">
            <h3 className="text-sm font-medium">Studying together</h3>
            <ul className="mt-6 space-y-4">
              {TOGETHER.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px]">
                  <Check className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
