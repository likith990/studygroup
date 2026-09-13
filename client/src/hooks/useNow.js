import { useEffect, useState } from "react";

/**
 * Returns the current time as a Date, re-rendering the component every
 * `intervalMs` so anything computed off "now" (meeting live/ended state,
 * "starts in X min" labels, filtering out finished rooms) stays correct
 * without the user needing to refresh the page.
 *
 * @param {number} intervalMs default 15s - frequent enough that a join
 * button flips on/off promptly, cheap enough not to matter perf-wise.
 */
export default function useNow(intervalMs = 15000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
