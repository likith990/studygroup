const GROUPS = [
  { count: "+3", label: "learning DSA", people: ["A", "M", "S"] },
  { count: "+2", label: "preparing for system design", people: ["K", "R"] },
  { count: "+4", label: "practicing React", people: ["P", "N", "T", "J"] },
];

export default function PeopleBand() {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="card px-6 py-10 sm:px-12 sm:py-12">
          <p className="mx-auto max-w-md text-center text-[15px] leading-relaxed text-muted">
            StudyGroup is about people, not just productivity. Every session is a handful of real
            students in one focused room.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-14">
            {GROUPS.map((g) => (
              <div key={g.label} className="flex flex-col items-center gap-3 text-center">
                <div className="flex -space-x-2" aria-hidden="true">
                  {g.people.map((initial) => (
                    <span key={initial} className="avatar !h-9 !w-9 ring-2 ring-surface">
                      {initial}
                    </span>
                  ))}
                  <span className="avatar !h-9 !w-9 text-muted ring-2 ring-surface">{g.count}</span>
                </div>
                <span className="text-sm text-muted">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
