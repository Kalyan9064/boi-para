import axios from "axios";

// 🔥 FORCE LOCAL BACKEND FOR DEV
const isLocal = window.location.hostname === "localhost";

const baseURL = isLocal
  ? "http://localhost:5000"
  : "https://boi-para.onrender.com";

const API = axios.create({
  baseURL
});

// Token attach
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle auth error
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;