import { createContext, useContext, useState, useCallback } from "react";

// ───────────────────────────────────────────
// Context
// ───────────────────────────────────────────

const SessionContext = createContext(null);

// ───────────────────────────────────────────
// Provider
// ───────────────────────────────────────────

export function SessionProvider({ children }) {
  // Current uploaded document session
  const [session, setSession] = useState(null);
  // {sessionId, fileName, pageCount, chunkCount, vectorStoreReady}

  // Current generated question set
  const [currentQuestionSet, setCurrentQuestionSet] = useState(null);
  // {setId, sessionId, questionType, difficulty, count, topic, questions, generatedAt}

  // Generation config (persists between Generate page visits)
  const [generateConfig, setGenerateConfig] = useState({
    questionType: "MCQ",
    difficulty: "Medium",
    count: 10,
    topic: "",
  });

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Upload progress (0–100)
  const [uploadProgress, setUploadProgress] = useState(0);

  // ─── Actions ───────────────────────────

  const startSession = useCallback((sessionData) => {
    setSession(sessionData);
    setCurrentQuestionSet(null);
  }, []);

  const clearSession = useCallback(() => {
    setSession(null);
    setCurrentQuestionSet(null);
    setGenerateConfig({
      questionType: "MCQ",
      difficulty: "Medium",
      count: 10,
      topic: "",
    });
    setUploadProgress(0);
  }, []);

  const saveQuestionSet = useCallback((questionSet) => {
    setCurrentQuestionSet(questionSet);
  }, []);

  const updateConfig = useCallback((updates) => {
    setGenerateConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  // ─── Value ─────────────────────────────

  const value = {
    // State
    session,
    currentQuestionSet,
    generateConfig,
    isUploading,
    isGenerating,
    uploadProgress,

    // Setters
    setIsUploading,
    setIsGenerating,
    setUploadProgress,

    // Actions
    startSession,
    clearSession,
    saveQuestionSet,
    updateConfig,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// ───────────────────────────────────────────
// Hook
// ───────────────────────────────────────────

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a <SessionProvider>");
  }
  return ctx;
}

export default SessionContext;