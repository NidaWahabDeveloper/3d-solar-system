import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // form ka data ek hi object mein rakha hai
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // ye function har input field ke liye kaam karega (name se pata chal jata hai konsa field hai)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(form.email, form.password);

    if (result.success) {
      navigate("/"); // login ho gaya, home page pe bhej do
    } else {
      setError(result.message); // backend se aya hua error dikhado
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Log in</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-line bg-panel p-3 text-sm text-ink focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-line bg-panel p-3 text-sm text-ink focus:border-accent"
          />
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-accent disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Don't have an account?{" "}
        <Link to="/register" className="text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;