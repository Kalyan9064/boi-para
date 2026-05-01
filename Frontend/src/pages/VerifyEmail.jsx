import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const res = await API.get(`/api/auth/verify-email/${token}`);

        // ✅ Save token → user is now logged in
        localStorage.setItem("token", res.data.token);

        setMessage("Email Verified Successfully!");
        setSuccess(true);

        // ✅ Countdown 3 → 2 → 1 then redirect
        let count = 3;
        const interval = setInterval(() => {
          count -= 1;
          setCountdown(count);

          if (count === 0) {
            clearInterval(interval);
            // ✅ Force full page reload so navbar re-reads token
            window.location.href = "/";
          }
        }, 1000);

      } catch (err) {
        setMessage(
          err.response?.data?.message ||
          err.response?.data ||
          "Verification failed. Link may have expired."
        );
        setSuccess(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f3efe6"
    }}>
      <div style={{
        background: "white",
        padding: "50px 40px",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        textAlign: "center",
        width: "380px",
        border: "1px solid #e5dfd6"
      }}>

        {/* ICON */}
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>
          {success ? "✅" : "⏳"}
        </div>

        {/* MESSAGE */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "26px",
          color: "#2c1e16",
          marginBottom: "12px"
        }}>
          {message}
        </h2>

        {/* SUCCESS STATE */}
        {success && (
          <>
            <p style={{ color: "#7a6a58", fontSize: "15px", marginBottom: "20px" }}>
              You are now logged in. Redirecting to home page in{" "}
              <strong style={{ color: "#8b5a2b" }}>{countdown}</strong> second{countdown !== 1 ? "s" : ""}...
            </p>

            {/* MANUAL REDIRECT BUTTON */}
            <button
              onClick={() => { window.location.href = "/"; }}
              style={{
                background: "#8b5a2b",
                color: "white",
                border: "none",
                padding: "12px 28px",
                borderRadius: "8px",
                fontSize: "15px",
                cursor: "pointer",
                transition: "0.3s"
              }}
              onMouseOver={e => e.target.style.background = "#6a4420"}
              onMouseOut={e => e.target.style.background = "#8b5a2b"}
            >
              Go to Home →
            </button>
          </>
        )}

        {/* FAILURE STATE */}
        {!success && message !== "Verifying your email..." && (
          <>
            <p style={{ color: "#7a6a58", fontSize: "14px", marginBottom: "20px" }}>
              The verification link may have expired or already been used.
            </p>
            <button
              onClick={() => { window.location.href = "/register"; }}
              style={{
                background: "#8b5a2b",
                color: "white",
                border: "none",
                padding: "12px 28px",
                borderRadius: "8px",
                fontSize: "15px",
                cursor: "pointer"
              }}
            >
              Register Again
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default VerifyEmail;