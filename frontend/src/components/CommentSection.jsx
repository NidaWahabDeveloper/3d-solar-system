import { useState, useEffect } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const CommentSection = ({ planetId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/planets/${planetId}/comments`);
        setComments(res.data.data);
      } catch (err) {
        console.error("Failed to load comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [planetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setPosting(true);
    try {
      const res = await api.post(`/planets/${planetId}/comments`, { text });
      setComments((prev) => [res.data.data, ...prev]);
      setText("");
    } catch (err) {
      alert(err.response?.data?.message || "Could not post comment");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete comment");
    }
  };

  return (
    <section className="mt-10 border-t border-line pt-8">
      <h2 className="mb-4 font-display text-2xl font-semibold text-ink">Discussion</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share a thought or question about this planet..."
            maxLength={500}
            rows={3}
            className="w-full rounded-xl border border-line bg-panel p-3 text-sm text-ink focus:border-accent"
          />
          <button
            type="submit"
            disabled={posting || !text.trim()}
            className="self-end rounded-full bg-ink px-5 py-2 text-sm font-medium text-white hover:bg-accent disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post comment"}
          </button>
        </form>
      ) : (
        <p className="mb-6 text-sm text-muted">Log in to join the discussion.</p>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted">No comments yet -- be the first to say something.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {comments.map((c) => (
            <li key={c._id} className="rounded-xl border border-line bg-panel p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-ink">{c.user?.name || "Unknown"}</span>

                {(user?._id === c.user?._id || user?.role === "admin") && (
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-xs text-muted hover:text-coral"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-ink/90">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CommentSection;