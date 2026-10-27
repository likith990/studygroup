import { useState } from "react";
import { X } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { API_BASE } from "../../lib/config";

function toDatetimeLocalValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
    </div>
  );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-session-title"
        className="card max-h-[90vh] w-full max-w-xl overflow-y-auto p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="create-session-title" className="text-lg font-semibold tracking-tight">
              Create a session
            </h2>
            <p className="mt-1 text-sm text-muted">
              Set a topic, a time and a seat limit, then let others apply.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setisform(false)}
            className="btn btn-ghost btn-icon -mr-2 -mt-1"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Track" htmlFor="title">
            <input
              id="title"
              type="text"
              placeholder="e.g. DSA, System Design, Frontend"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              className="input"
              required
            />
          </Field>

          <Field label="Topic" htmlFor="topic">
            <input
              id="topic"
              type="text"
              placeholder="e.g. Graph traversal with BFS and DFS"
              value={topic}
              onChange={(e) => settopic(e.target.value)}
              className="input"
              required
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Start time" htmlFor="starttime">
              <input
                id="starttime"
                type="datetime-local"
                min={minStart}
                value={starttime}
                onChange={(e) => setstarttime(e.target.value)}
                className="input"
                required
              />
            </Field>

            <Field label="Duration (minutes)" htmlFor="duration">
              <input
                id="duration"
                type="number"
                min="5"
                max="300"
                placeholder="60"
                value={duration}
                onChange={(e) => setduration(e.target.value)}
                className="input"
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Seats" htmlFor="capacity">
              <input
                id="capacity"
                type="number"
                min="2"
                max="50"
                placeholder="5"
                value={capacity}
                onChange={(e) => setcapacity(e.target.value)}
                className="input"
                required
              />
            </Field>

            <Field label="Who can join" htmlFor="eligibility">
              <input
                id="eligibility"
                type="text"
                placeholder="e.g. Beginners welcome"
                value={eligibility}
                onChange={(e) => seteligibility(e.target.value)}
                className="input"
                required
              />
            </Field>
          </div>

          <Field label="Description" htmlFor="desc">
            <textarea
              id="desc"
              rows={3}
              placeholder="What will you discuss, practice or build together?"
              value={desc}
              onChange={(e) => setdesc(e.target.value)}
              className="input resize-none"
              required
            />
          </Field>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
            <button type="button" onClick={() => setisform(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Publishing..." : "Publish session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
