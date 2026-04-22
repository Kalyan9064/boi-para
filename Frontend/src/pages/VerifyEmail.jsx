import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function VerifyEmail() {
  const { token } = useParams();

  const [message, setMessage] = useState("Verifying...");
  const [success, setSuccess] = useState(false);

  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const res = await API.get(
          `/api/auth/verify-email/${token}`
        );

        localStorage.setItem("token", res.data.token);

        setMessage(res.data.message);
        setSuccess(true);

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);

      } catch (err) {
        setMessage(
          err.response?.data || "Verification failed"
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          width: "350px"
        }}
      >
        {success && (
          <div
            style={{
              fontSize: "60px",
              color: "green",
              marginBottom: "20px"
            }}
          >
            ✅
          </div>
        )}

        <h2>{message}</h2>

        {success && (
          <p>Redirecting to home page...</p>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;