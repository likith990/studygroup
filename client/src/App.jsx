import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { authClient } from "./lib/auth-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoCall from "./pages/videoCall";

function App() {
  const { data: session, isPending, error } = authClient.useSession();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isPending ? <p>loading....</p> : session ? <Dashboard /> : <Landing />
          }
        />
        <Route path="/:url" element={<VideoCall />} />
      </Routes>
    </Router>
  );
}

export default App;
