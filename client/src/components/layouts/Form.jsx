import { useState } from "react";
import {
  Type,
  Clock3,
  BookOpen,
  Users,
  Timer,
  AlignLeft,
  ShieldCheck,
  X,
  Sparkles,
} from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { API_BASE } from "../../lib/config";

// Formats a Date as the "YYYY-MM-DDTHH:mm" string a datetime-local input
// expects, in the browser's local timezone (toISOString would shift to UTC).
function toDatetimeLocalValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function Form({ setisform = () => {}, rerender = () => {} }) {
  const [title, settitle] = useState("");
  const [starttime, setstarttime] = useState("");
  const [topic, settopic] = useState("");
  const [capacity, setcapacity] = useState("");
  const [duration, setduration] = useState("");
  const [desc, setdesc] = useState("");
  const [eligibility, seteligibility] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = authClient.useSession();

  // Computed once when the form opens - used as the `min` on the start-time
  // picker so most browsers won't even let you pick a past time/date.
  const [minStart] = useState(() => toDatetimeLocalValue(new Date()));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!starttime || new Date(starttime).getTime() <= Date.now()) {
      setError("Start time has to be in the future.");
      return;
    }

    setSubmitting(true);

    let data = {
      title,
      starttime,
      topic,
      capacity: Number(capacity),
      duration: Number(duration),
      desc,
      eligibility,
    };

    const userId = session?.user?.id;
    const reqData = { data, userId };

    try {
      const res = await fetch(`${API_BASE}/api/room`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });
      const resData = await res.json();
      if (!res.ok) {
        setError(resData.error || "Couldn't create the session. Please try again.");
        return;
      }
      setisform(false);
      rerender();
    } catch (err) {
      console.error("Failed to create room:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md transition-all sm:p-6">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl shadow-black/80 backdrop-blur-xl sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-900/40">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-white">
                Create a Study Session
              </h2>
              <p className="text-xs text-zinc-400">
                Schedule a topic, set the participant cap, and invite peers.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setisform(false)}
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field icon={Type} label="Category / Track" htmlFor="title">
            <input
              id="title"
              type="text"
              placeholder="e.g. DSA, System Design, Frontend, React"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              className={inputClass}
              required
            />
          </Field>

          <Field icon={BookOpen} label="Session Topic" htmlFor="topic">
            <input
              id="topic"
              type="text"
              placeholder="e.g. Graph Algorithms & BFS/DFS Traversal"
              value={topic}
              onChange={(e) => settopic(e.target.value)}
              className={inputClass}
              required
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field icon={Clock3} label="Start Time" htmlFor="starttime">
              <input
                id="starttime"
                type="datetime-local"
                min={minStart}
                value={starttime}
                onChange={(e) => setstarttime(e.target.value)}
                className={inputClass}
                required
              />
            </Field>

            <Field icon={Timer} label="Duration (minutes)" htmlFor="duration">
              <input
                id="duration"
                type="number"
                min="5"
                max="300"
                placeholder="60"
                value={duration}
                onChange={(e) => setduration(e.target.value)}
                className={inputClass}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field icon={Users} label="Capacity (Seats)" htmlFor="capacity">
              <input
                id="capacity"
                type="number"
                min="2"
                max="50"
                placeholder="5"
                value={capacity}
                onChange={(e) => setcapacity(e.target.value)}
                className={inputClass}
                required
              />
            </Field>

            <Field icon={ShieldCheck} label="Eligibility / Prereqs" htmlFor="eligibility">
              <input
                id="eligibility"
                type="text"
                placeholder="e.g. Beginners welcome, basic JS knowledge"
                value={eligibility}
                onChange={(e) => seteligibility(e.target.value)}
                className={inputClass}
                required
              />
            </Field>
          </div>

          <Field icon={AlignLeft} label="Description / Agenda" htmlFor="desc">
            <textarea
              id="desc"
              rows={3}
              placeholder="What will you discuss, practice, or build together?"
              value={desc}
              onChange={(e) => setdesc(e.target.value)}
              className={`${inputClass} resize-none`}
              required
            />
          </Field>

          {/* Actions */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setisform(false)}
              className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-800/70 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-colors focus:border-violet-500 focus:bg-zinc-800 focus:ring-1 focus:ring-violet-500";

function Field({ icon: Icon, label, htmlFor, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400"
      >
        <Icon size={14} className="text-violet-400" strokeWidth={2} />
        {label}
      </label>
      {children}
    </div>
  );
}
