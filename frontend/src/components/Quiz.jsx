
import { useState, useEffect, useRef } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const DIFFICULTIES = ["easy", "medium", "hard"];

const Quiz = ({ planetId }) => {
  const { user } = useAuth();

  const [difficulty, setDifficulty] = useState(null); 
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [answers, setAnswers] = useState([]); 
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [result, setResult] = useState(null); 
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef(null); 


  useEffect(() => {
    if (difficulty && !result) {
      timerRef.current = setInterval(() => setSecondsElapsed((s) => s + 1), 1000);
    }
    return () => clearInterval(timerRef.current); 
  }, [difficulty, result]);

  const startQuiz = async (level) => {
    setLoading(true);
    setSecondsElapsed(0);
    setAnswers([]);
    setCurrentIndex(0);
    setResult(null);
    try {
      const res = await api.get(`/quiz/${planetId}/${level}`);
      setQuestions(res.data.data);
      setDifficulty(level);
    } catch (err) {
      alert("Could not load quiz questions");
    } finally {
      setLoading(false);
    }
  };


  const selectAnswer = (selectedIndex) => {
    const updated = [...answers, { questionId: questions[currentIndex]._id, selectedIndex }];
    setAnswers(updated);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1); 
    } else {
      submitQuiz(updated);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    clearInterval(timerRef.current); 
    setLoading(true);
    try {
      const res = await api.post(`/quiz/${planetId}/${difficulty}/submit`, {
        answers: finalAnswers,
        timeTakenSeconds: secondsElapsed,
      });
      setResult(res.data.data);
      fetchLeaderboard(); 
    } catch (err) {
      alert(err.response?.data?.message || "Could not submit quiz");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get(`/quiz/${planetId}/${difficulty || "easy"}/leaderboard`);
      setLeaderboard(res.data.data);
    } catch (err) {
      console.error("Could not load leaderboard", err);
    }
  };

  
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  
  if (!difficulty) {
    return (
      <section className="mt-10 border-t border-line pt-8">
        <h2 className="mb-4 font-display text-2xl font-semibold text-ink">Test your knowledge</h2>
        <p className="mb-4 text-sm text-muted">Choose a difficulty to start a timed quiz.</p>
        <div className="flex gap-3">
          {DIFFICULTIES.map((level) => (
            <button
              key={level}
              onClick={() => startQuiz(level)}
              className="rounded-full border border-line bg-panel px-5 py-2 text-sm font-medium capitalize text-ink hover:border-accent hover:text-accent"
            >
              {level}
            </button>
          ))}
        </div>
      </section>
    );
  }

  
  if (result) {
    return (
      <section className="mt-10 border-t border-line pt-8">
        <h2 className="mb-2 font-display text-2xl font-semibold text-ink">Quiz complete!</h2>
        <p className="mb-6 text-ink">
          You scored <span className="font-semibold text-accent">{result.score}</span> out of{" "}
          {result.totalQuestions} in {formatTime(secondsElapsed)}.
        </p>

        <h3 className="mb-3 font-display text-lg font-semibold text-ink capitalize">
          {difficulty} leaderboard
        </h3>
        <ol className="flex flex-col gap-2">
          {leaderboard.map((entry, i) => (
            <li
              key={entry._id}
              className="flex items-center justify-between rounded-lg border border-line bg-panel px-4 py-2 text-sm"
            >
              <span>
                <span className="mr-2 font-mono text-muted">#{i + 1}</span>
                {entry.user?.name || "Anonymous"}
              </span>
              <span className="font-mono text-muted">
                {entry.score}/{entry.totalQuestions} · {formatTime(entry.timeTakenSeconds)}
              </span>
            </li>
          ))}
        </ol>

        <button
          onClick={() => setDifficulty(null)}
          className="mt-6 rounded-full bg-ink px-5 py-2 text-sm font-medium text-white hover:bg-accent"
        >
          Try another difficulty
        </button>
      </section>
    );
  }
  const question = questions[currentIndex];
  if (loading || !question) {
    return <p className="mt-10 text-sm text-muted">Loading quiz...</p>;
  }

  return (
    <section className="mt-10 border-t border-line pt-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs uppercase text-muted">
          Question {currentIndex + 1} of {questions.length}
        </span>
        
        <span className="font-mono text-sm font-semibold text-coral">⏱ {formatTime(secondsElapsed)}</span>
      </div>

      <h3 className="mb-5 font-display text-xl font-semibold text-ink">{question.question}</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => selectAnswer(idx)}
            className="rounded-xl border border-line bg-panel p-4 text-left text-sm text-ink hover:border-accent hover:bg-accent/10 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Quiz;