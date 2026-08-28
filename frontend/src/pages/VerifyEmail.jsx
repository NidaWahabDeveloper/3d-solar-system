// Page shown when a user clicks the verification link from their email.
// It reads the token from the URL, calls the backend to verify it, and shows the result.

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";

const VerifyEmail = () => {
  const { token } = useParams(); // pulls the :token part out of the URL
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
  if (hasVerified.current) return;
  hasVerified.current = true;

  const verify = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`);
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      {status === "verifying" && <p className="text-muted">Verifying your email...</p>}

      {status === "success" && (
        <>
          <h1 className="mb-3 font-display text-2xl font-semibold text-ink">Email verified!</h1>
          <p className="mb-6 text-muted">{message}</p>
          <Link to="/login" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-accent">
            Go to login
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="mb-3 font-display text-2xl font-semibold text-coral">Verification failed</h1>
          <p className="mb-6 text-muted">{message}</p>
          <Link to="/" className="text-accent hover:underline">
            Back to homepage
          </Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;