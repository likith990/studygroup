import useReveal from "../../hooks/useReveal";

const GROUPS = [
  { count: "+3", label: "learning DSA", tones: ["from-violet-500 to-indigo-600", "from-sky-500 to-blue-600", "from-emerald-500 to-teal-600"] },
  { count: "+2", label: "preparing for system design", tones: ["from-amber-500 to-orange-600", "from-rose-500 to-pink-600"] },
  { count: "+4", label: "practicing React", tones: ["from-indigo-500 to-violet-600", "from-teal-500 to-emerald-600", "from-blue-500 to-sky-600", "from-fuchsia-500 to-purple-600"] },
];

export default function PeopleBand() {
  const [ref, visible] = useReveal();

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div
          ref={ref}
          className={`reveal ${
            visible ? "is-visible" : ""
          } ls-panel rounded-3xl px-6 py-10 sm:px-12 sm:py-12`}
        >
          <p className="mx-auto max-w-md text-center text-[15px] leading-relaxed text-zinc-400">
            StudyGroup is about people, not just productivity. Every session is
            a handful of real students, in one focused room.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-14">
            {GROUPS.map((g) => (
              <div key={g.label} className="flex flex-col items-center gap-3 text-center">
                <div className="flex -space-x-2.5">
                  {g.tones.map((tone, i) => (
                    <div
                      key={i}
                      className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr ${tone} text-[11px] font-bold text-white ring-2 ring-[#141624]`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1d2e] text-[11px] font-bold text-zinc-300 ring-2 ring-[#141624]">
                    {g.count}
                  </div>
                </div>
                <span className="text-[13px] font-medium text-zinc-400">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
