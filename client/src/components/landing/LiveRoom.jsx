import { Mic, MicOff, Video, ScreenShare, PhoneOff, Wifi } from "lucide-react";
import useReveal from "../../hooks/useReveal";

const PARTICIPANTS = [
  { name: "Priya", initial: "P", mic: true, cam: true, tone: "from-violet-500 to-indigo-600", speaking: true },
  { name: "Arjun", initial: "A", mic: false, cam: true, tone: "from-sky-500 to-blue-600", speaking: false },
  { name: "You", initial: "Y", mic: true, cam: true, tone: "from-emerald-500 to-teal-600", speaking: false },
];

export default function LiveRoom() {
  const [ref, visible] = useReveal();

  return (
    <section id="live-rooms" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} mx-auto mb-14 max-w-xl text-center`}>
          <p className="ls-eyebrow">Live collaboration</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A study session shouldn't end at "good luck."
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
            Once you're accepted into a session, you actually meet — video,
            audio and screen sharing, in a room only the host and accepted
            attendees can enter.
          </p>
        </div>

        <div
          className={`reveal reveal-2 ${
            visible ? "is-visible" : ""
          } ls-glass mx-auto max-w-4xl overflow-hidden rounded-3xl shadow-2xl shadow-black/60`}
        >
          {/* room header */}
          <div className="flex items-center justify-between border-b border-[#23263b] px-5 py-3.5">
            <div>
              <p className="text-[13px] font-semibold text-white">DSA Interview Prep</p>
              <p className="text-[11px] text-zinc-500">Room · Accepted attendees only</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
              <Wifi className="h-3 w-3" />
              Connected
            </div>
          </div>

          {/* video grid */}
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:p-5">
            {PARTICIPANTS.map((p) => (
              <div
                key={p.name}
                className={`video-tile relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border ${
                  p.speaking ? "border-violet-500/50" : "border-[#23263b]"
                }`}
              >
                {p.speaking && (
                  <span className="speaking-ring pointer-events-none absolute inset-0 rounded-xl ring-2 ring-violet-500/40" />
                )}
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr ${p.tone} text-sm font-bold text-white shadow-lg`}
                >
                  {p.initial}
                </span>

                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 backdrop-blur-sm">
                  <span className="text-[10.5px] font-medium text-white">{p.name}</span>
                  {p.mic ? (
                    <Mic className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <MicOff className="h-3 w-3 text-red-400" />
                  )}
                </div>

                {p.name === "Arjun" && (
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-violet-600/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    <ScreenShare className="h-2.5 w-2.5" />
                    Sharing
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* controls */}
          <div className="flex items-center justify-center gap-3 border-t border-[#23263b] px-5 py-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2e334f] bg-[#161826] text-zinc-200 transition-colors hover:bg-[#1c1f30]">
              <Mic className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2e334f] bg-[#161826] text-zinc-200 transition-colors hover:bg-[#1c1f30]">
              <Video className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/40 bg-violet-600/20 text-violet-300 transition-colors hover:bg-violet-600/30">
              <ScreenShare className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-950/40 transition-colors hover:bg-red-500">
              <PhoneOff className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
