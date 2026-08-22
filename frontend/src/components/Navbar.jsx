import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // logout hone ke baad user ko home page pe bhej do
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-panel/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        
        {/* Logo / brand name */}
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          Solar System <span className="text-accent">Explorer</span>
        </Link>

        <div className="flex items-center gap-6 font-body text-sm text-ink">
          <Link to="/" className="hover:text-accent transition-colors">
            Planets
          </Link>

          {/* sirf admin ko hi ye link dikhega */}
          {isAdmin && (
            <Link to="/admin" className="hover:text-accent transition-colors">
              Admin
            </Link>
          )}

          {/* agar user login hai to naam + logout button, warna login/signup */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-muted">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-line px-4 py-1.5 hover:border-coral hover:text-coral transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hover:text-accent transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-ink px-4 py-1.5 text-white hover:bg-accent transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;