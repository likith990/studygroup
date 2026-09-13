// Every fetch() call in the app should import API_BASE from here instead of
// hardcoding "http://localhost:8080" - that way switching to a deployed
// backend is a single env var change (VITE_SERVER_URL) instead of hunting
// down every fetch call in the codebase.
//
// Set VITE_SERVER_URL in client/.env (see client/.env.example) when
// deploying, e.g. VITE_SERVER_URL=https://api.yourdomain.com
export const API_BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";
