
import { useState, useEffect } from "react";
import api from "../api/axios.js";
import AdminQuizManager from "../components/AdminQuizManager.jsx";


const emptyForm = {
  name: "", slug: "", tagline: "", description: "", color: "#4C7BE1", orbitPosition: 1, funFact: "",
};

const AdminDashboard = () => {
  const [planets, setPlanets] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(true);

  const fetchPlanets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/planets");
      setPlanets(res.data.data);
    } catch (err) {
      setMessage("Could not load planets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm({ ...form, [name]: name === "orbitPosition" ? Number(value) : value });
  };

  
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""); 
    setForm({ ...form, name, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await api.post("/planets", form);
      setMessage(`"${form.name}" was added successfully.`);
      setForm(emptyForm);
      fetchPlanets(); 
    } catch (err) {
      const errors = err.response?.data?.errors;
      setMessage(errors ? errors.map((x) => x.message).join(", ") : err.response?.data?.message || "Failed to add planet");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/planets/${id}`);
      setPlanets((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete planet");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Admin panel</h1>
      <p className="mb-10 text-muted">Add or remove planets shown in the explorer.</p>

      <div className="grid gap-10 lg:grid-cols-2">
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-line bg-panel p-6">
          <h2 className="font-display text-xl font-semibold text-ink">Add a new planet</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Name</label>
            <input
              name="name" required value={form.name} onChange={handleNameChange}
              className="w-full rounded-xl border border-line p-2.5 text-sm focus:border-accent"
            />
          </div>
          <div className="mt-10">
  <AdminQuizManager planets={planets} />
</div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Slug (auto-generated, URL-safe)</label>
            <input
              name="slug" required value={form.slug} onChange={handleChange}
              className="w-full rounded-xl border border-line p-2.5 text-sm font-mono focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Tagline</label>
            <input
              name="tagline" value={form.tagline} onChange={handleChange}
              className="w-full rounded-xl border border-line p-2.5 text-sm focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Description</label>
            <textarea
              name="description" required rows={3} value={form.description} onChange={handleChange}
              className="w-full rounded-xl border border-line p-2.5 text-sm focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Color</label>
              <input
                name="color" type="color" value={form.color} onChange={handleChange}
                className="h-10 w-full rounded-xl border border-line"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Orbit position (1-8)</label>
              <input
                name="orbitPosition" type="number" min={1} max={8} required
                value={form.orbitPosition} onChange={handleChange}
                className="w-full rounded-xl border border-line p-2.5 text-sm focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Fun fact</label>
            <input
              name="funFact" value={form.funFact} onChange={handleChange}
              className="w-full rounded-xl border border-line p-2.5 text-sm focus:border-accent"
            />
          </div>

          {message && <p className="text-sm text-accent">{message}</p>}

          <button
            type="submit" disabled={submitting}
            className="mt-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-accent disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add planet"}
          </button>
        </form>

        
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">Existing planets</h2>
          {loading ? (
            <p className="text-sm text-muted">Loading...</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {planets.map((p) => (
                <li key={p._id} className="flex items-center justify-between rounded-xl border border-line bg-panel p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full" style={{ backgroundColor: p.color }} />
                    <div>
                      <p className="font-medium text-ink">{p.name}</p>
                      <p className="font-mono text-xs text-muted">/{p.slug}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(p._id, p.name)}
                    className="text-xs text-muted hover:text-coral"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;