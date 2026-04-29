import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "X-API-Version": "1",
  },
});

function getCookie(name) {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));

  return value ? decodeURIComponent(value.split("=")[1]) : null;
}

api.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrftoken");

  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  return config;
});

// api.defaults.xsrfCookieName = 'csrftoken';
// api.defaults.xsrfHeaderName = 'X-CSRFToken';

export default api;