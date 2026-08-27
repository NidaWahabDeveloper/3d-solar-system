import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

import Home from "./pages/Home.jsx";
import PlanetDetail from "./pages/PlanetDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main>
        <Routes>
          {/* Public routes -- reachable hain login or logout hr user k lye */}
          <Route path="/" element={<Home />} />
          <Route path="/planets/:slug" element={<PlanetDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes -agr login nhi hn to login page p redirect krdega
              (No dedicated protected page yet besides admin, but this wraps future ones easily.) */}
          <Route element={<ProtectedRoute />}>
            {/* e.g. a future <Route path="/profile" element={<Profile />} /> would go here */}
          </Route>

          {/* Admin-only route -- AdminRoute redirects non-admins away */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all: anything that doesn't match becomes a simple "not found" message */}
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-4xl px-6 py-24 text-center">
                <p className="font-display text-2xl text-ink">Page not found.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
