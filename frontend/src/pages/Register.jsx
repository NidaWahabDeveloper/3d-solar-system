import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // form ka data ek object mein
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  // har input field ke liye ek hi change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await register(form.name, form.email, form.password);

    if (result.success) {
      navigate("/"); // account ban gaya, home page pe bhej do
    } else {
      setError(result.message); // backend ka error dikhado
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Create an account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-line bg-panel p-3 text-sm text-ink focus:border-accent"
          />
        </div>

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
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-line bg-panel p-3 text-sm text-ink focus:border-accent"
          />
          <p className="mt-1 text-xs text-muted">At least 6 characters.</p>
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-accent disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;