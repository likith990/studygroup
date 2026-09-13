import { X, Check } from "lucide-react";
import useReveal from "../../hooks/useReveal";

const ALONE = ["47 tabs open", "No accountability", "Questions pile up", "Motivation drops"];
const TOGETHER = ["One focused session", "A shared goal", "Real conversation", "Instant feedback"];

export default function Problem() {
  const [ref, visible] = useReveal();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} text-center`}>
          <p className="ls-eyebrow">The problem</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.6rem]">
            Studying alone is surprisingly inefficient.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-balance text-[15px] leading-relaxed text-zinc-400 sm:text-base">
            You can watch another tutorial. Read another article. Open another
            tab. But sometimes you just need another person.
          </p>
        </div>

        {/* Split comparison */}
        <div
          className={`reveal reveal-2 ${
            visible ? "is-visible" : ""
          } relative mt-16 grid grid-cols-1 overflow-hidden rounded-3xl border border-[#23263b] bg-[#0e0f1a]/70 sm:grid-cols-2`}
        >
          {/* divider */}
          <div className="split-divider absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 sm:block" />

          {/* Alone */}
          <div className="p-8 sm:p-10">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-600">
              Alone
            </span>
            <ul className="mt-6 space-y-4">
              {ALONE.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-zinc-500">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/60">
                    <X className="h-3 w-3 text-zinc-500" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Together */}
          <div className="relative p-8 sm:p-10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/[0.07] via-transparent to-transparent" />
            <span className="relative text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
              Together
            </span>
            <ul className="relative mt-6 space-y-4">
              {TOGETHER.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] font-medium text-zinc-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/15">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </span>
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
