import axios from "axios";

// ───────────────────────────────────────────
// Base Axios Instance
// ───────────────────────────────────────────

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  timeout: 120000, // 2 min — LLM generation can take time
  headers: {
    "Content-Type": "application/json",
  },
});

// ───────────────────────────────────────────
// Request Interceptor — logging in dev
// ───────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ───────────────────────────────────────────
// Response Interceptor — normalize errors
// ───────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);


// ───────────────────────────────────────────
// Upload API
// ───────────────────────────────────────────

export const uploadPDF = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return response.data;
};

export const getUploadStatus = async (sessionId) => {
  const response = await api.get(`/api/upload/status/${sessionId}`);
  return response.data;
};


// ───────────────────────────────────────────
// Generate API
// ───────────────────────────────────────────

export const generateQuestions = async ({
  sessionId,
  questionType,
  difficulty,
  count,
  topic,
}) => {
  const response = await api.post("/api/generate", {
    sessionId,
    questionType,
    difficulty,
    count,
    topic: topic || null,
  });
  return response.data;
};

export const getQuestionSet = async (setId) => {
  const response = await api.get(`/api/generate/${setId}`);
  return response.data;
};


// ───────────────────────────────────────────
// History API
// ───────────────────────────────────────────

export const getHistory = async (sessionId) => {
  const response = await api.get(`/api/download/history/${sessionId}`);
  return response.data;
};

export const clearSession = async (sessionId) => {
  const response = await api.delete(`/api/download/history/${sessionId}`);
  return response.data;
};


// ───────────────────────────────────────────
// Download API
// ───────────────────────────────────────────

export const getDownloadData = async (setId) => {
  const response = await api.get(`/api/download/${setId}`);
  return response.data;
};


export default api;