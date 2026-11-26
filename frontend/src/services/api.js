import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const defaultBaseUrl = import.meta.env.DEV ? "/api" : `${window.location.origin}/api`;

const api = axios.create({
  baseURL: configuredBaseUrl || defaultBaseUrl,
  withCredentials: true,
  withXSRFToken: false,
});

let csrfToken = null;
let csrfTokenRequest = null;

export async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  if (!csrfTokenRequest) {
    csrfTokenRequest = api.get("/auth/csrf")
      .then((response) => {
        csrfToken = response.data?.token || null;
        return csrfToken;
      })
      .finally(() => {
        csrfTokenRequest = null;
      });
  }
  return csrfTokenRequest;
}

api.interceptors.request.use(async (config) => {
  if (!["get", "head", "options"].includes((config.method || "get").toLowerCase())) {
    const token = csrfToken || await ensureCsrfToken();
    if (token) {
      config.headers["X-XSRF-TOKEN"] = token;
    }
  }
  return config;
});

// Auto-logout on 401 (expired / invalid token)
api.interceptors.response.use(
  (response) => {
    if (response.config?.url?.includes("/auth/me")) {
      ensureCsrfToken().catch(() => {});
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data;
    const validationError = Array.isArray(payload?.errors) ? payload.errors[0] : null;
    const serverMessage = typeof payload === "string" ? payload : payload?.message;
    error.userMessage = status === 403 ? "You do not have permission to perform this action."
      : status === 404 ? "The requested resource was not found."
      : status >= 500 ? "The server could not complete the request. Please try again later."
      : !error.response ? "Unable to reach the server. Check your connection and try again."
      : status === 400 ? validationError || serverMessage || "Please check the information you entered."
      : status === 401 ? serverMessage || "Your login details could not be verified."
      : serverMessage || "The request could not be completed.";
    if (status === 401) {
      const isLoginRequest = error.config?.url?.includes("/auth/login");
      const isSessionCheck = error.config?.url?.includes("/auth/me");
      if (!isLoginRequest) {
        csrfToken = null;
        localStorage.clear();
        if (!isSessionCheck) window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
