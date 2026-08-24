// Lets an admin add new quiz questions for any planet + difficulty, straight from the browser --
// no need to use Postman. This calls the existing backend route: POST /api/quiz/questions

import { useState } from "react";
import api from "../api/axios.js";

const DIFFICULTIES = ["easy", "medium", "hard"];

const AdminQuizManager = ({ planets }) => {
  const [form, setForm] = useState({
    planet: "",
    difficulty: "easy",
    question: "",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleOptionChange = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await api.post("/quiz/questions", form);
      setMessage("Question added successfully.");
      setForm({ ...form, question: "", options: ["", "", "", ""], correctAnswerIndex: 0 });
    } catch (err) {
      const errors = err.response?.data?.errors;
      setMessage(errors ? errors.map((x) => x.message).join(", ") : err.response?.data?.message || "Failed to add question");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-panel p-6">
      <h2 className="mb-4 font-display text-xl font-semibold text-ink">Add a quiz question</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Planet</label>
            <select
              value={form.planet}
              onChange={(e) => setForm({ ...form, planet: e.target.value })}
              required
              className="w-full rounded-xl border border-line p-2.5 text-sm"
            >
              <option value="">Select a planet</option>
              {planets.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full rounded-xl border border-line p-2.5 text-sm capitalize"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Question</label>
          <input
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
            className="w-full rounded-xl border border-line p-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Options (select the correct one)</label>
          <div className="flex flex-col gap-2">
            {form.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={form.correctAnswerIndex === i}
                  onChange={() => setForm({ ...form, correctAnswerIndex: i })}
                />
                <input
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  required
                  placeholder={`Option ${i + 1}`}
                  className="w-full rounded-xl border border-line p-2 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {message && <p className="text-sm text-accent">{message}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="self-start rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-accent disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add question"}
        </button>
      </form>
    </div>
  );
};

export default AdminQuizManager;