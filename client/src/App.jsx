import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { authClient } from "./lib/auth-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoCall from "./pages/VideoCall";

function App() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isPending ? (
              <div className="flex min-h-screen items-center justify-center text-sm text-muted">
                Loading...
              </div>
            ) : session ? (
              <Dashboard />
            ) : (
              <Landing />
            )
          }
        />
        <Route path="/:url" element={<VideoCall />} />
      </Routes>
    </Router>
  );
}

export default App;
