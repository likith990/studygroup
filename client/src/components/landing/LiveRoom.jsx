import { Mic, MicOff, Video, ScreenShare, PhoneOff } from "lucide-react";

const PARTICIPANTS = [
  { name: "Priya", initial: "P", mic: true, speaking: true },
  { name: "Arjun", initial: "A", mic: false, speaking: false },
  { name: "You", initial: "Y", mic: true, speaking: false },
];

export default function LiveRoom() {
  return (
    <section id="live-rooms" className="landing-section border-t border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="section-title max-w-xl">A study session shouldn't end at "good luck."</h2>
        <p className="section-lead">
          Once you're accepted, you actually meet. Video, audio and screen sharing, in a room only
          the host and accepted attendees can enter.
        </p>

        <div className="card mt-12 overflow-hidden" aria-hidden="true">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div>
              <p className="text-sm font-medium">DSA interview prep</p>
              <p className="text-xs text-muted">Accepted attendees only</p>
            </div>
            <span className="tag tag-ok">Connected</span>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:p-5">
            {PARTICIPANTS.map((p) => (
              <div
                key={p.name}
                className={`relative flex aspect-video items-center justify-center rounded-md border bg-raised ${
                  p.speaking ? "border-accent" : "border-line"
                }`}
              >
                <span className="avatar !h-12 !w-12 !text-sm">{p.initial}</span>

                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded bg-bg/80 px-2 py-1">
                  <span className="text-xs">{p.name}</span>
                  {p.mic ? (
                    <Mic className="h-3 w-3 text-muted" strokeWidth={1.75} />
                  ) : (
                    <MicOff className="h-3 w-3 text-bad" strokeWidth={1.75} />
                  )}
                </div>

                {p.name === "Arjun" && (
                  <span className="tag absolute right-2 top-2 bg-bg/80">
                    <ScreenShare className="mr-1 h-3 w-3" strokeWidth={1.75} />
                    Sharing
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 border-t border-line px-5 py-4">
            <span className="btn btn-secondary btn-icon">
              <Mic className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="btn btn-secondary btn-icon">
              <Video className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="btn btn-secondary btn-icon">
              <ScreenShare className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="btn btn-icon bg-bad-solid text-white">
              <PhoneOff className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
