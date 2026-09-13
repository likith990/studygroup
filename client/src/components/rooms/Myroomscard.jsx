

import Acceptdeny from "./Acceptdeny";
import Statusreq from "./Statusreq";
import { Clock3, Timer, Users } from "lucide-react";

function getCategoryBadge(title = "") {
  const t = title.toLowerCase();
  if (t.includes("dsa") || t.includes("algo")) {
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  }
  if (t.includes("system") || t.includes("backend")) {
    return "bg-violet-500/15 text-violet-300 border-violet-500/30";
  }
  if (t.includes("front") || t.includes("react") || t.includes("web")) {
    return "bg-sky-500/15 text-sky-300 border-sky-500/30";
  }
  return "bg-purple-500/15 text-purple-300 border-purple-500/30";
}

export default function Myroomscard({ room, mode, userId, onChange }) {
  const categoryStyle = getCategoryBadge(room.title);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-[#25283c] bg-[#141624] p-6 shadow-xl shadow-black/50 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-[#181a2b]">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${categoryStyle}`}
          >
            {room.title}
          </span>
          {mode === "posted" ? (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-300">
              Host
            </span>
          ) : (
            <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-0.5 text-xs font-semibold text-violet-300">
              Attendee
            </span>
          )}
        </div>

        <h3 className="font-display text-xl font-bold tracking-tight text-white group-hover:text-violet-200 transition-colors">
          {room.topic}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#2d324d] bg-[#1d2033] px-3 py-1.5 text-zinc-200">
            <Clock3 className="h-3.5 w-3.5 text-violet-400" />
            {new Date(room.starttime).toLocaleString([], {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#2d324d] bg-[#1d2033] px-3 py-1.5 text-zinc-200">
            <Timer className="h-3.5 w-3.5 text-indigo-400" />
            {room.duration} min
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#2d324d] bg-[#1d2033] px-3 py-1.5 text-zinc-200">
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            Cap {room.capacity}
          </span>
        </div>

        <p className="mt-3.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">
          {room.desc}
        </p>
      </div>

      <div className="mt-5 border-t border-[#25283c] pt-4">
        {mode === "posted" && <Acceptdeny room={room} onChange={onChange} />}
        {mode === "requested" && <Statusreq room={room} onChange={onChange} />}
      </div>
    </div>
  );
}