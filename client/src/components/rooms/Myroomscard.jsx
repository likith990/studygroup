import Acceptdeny from "./Acceptdeny";
import Statusreq from "./Statusreq";
import Meta from "./Meta";
import { Clock3, Timer, Users } from "lucide-react";

export default function Myroomscard({ room, mode, userId, onChange }) {
  return (
    <article className="card card-hover flex h-full flex-col p-5">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug">{room.topic}</h3>
          <span className="tag max-w-[40%] shrink-0">{room.title}</span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {mode === "posted" ? "You are hosting" : "You applied"}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{room.desc}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted">
          <Meta icon={Clock3}>
            {new Date(room.starttime).toLocaleString([], {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </Meta>
          <Meta icon={Timer}>{room.duration} min</Meta>
          <Meta icon={Users}>Capacity {room.capacity}</Meta>
        </div>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        {mode === "posted" && <Acceptdeny room={room} onChange={onChange} />}
        {mode === "requested" && <Statusreq room={room} onChange={onChange} />}
      </div>
    </article>
  );
}
