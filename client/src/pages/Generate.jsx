import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiZap, FiBookOpen } from "react-icons/fi";
import { useSession } from "../context/SessionContext";
import { generateQuestions } from "../services/api";
import QuestionTypeSelector from "../components/QuestionTypeSelector";
import DifficultySelector from "../components/DifficultySelector";
import CountSelector from "../components/CountSelector";
import SessionHistory from "../components/SessionHistory";

export default function Generate() {
  const navigate = useNavigate();
  const {
    session,
    generateConfig,
    updateConfig,
    saveQuestionSet,
    isGenerating,
    setIsGenerating,
  } = useSession();

  const [topic, setTopic] = useState(generateConfig.topic || "");

  // Redirect if no session
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{ backgroundColor: "#F9FAFB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <FiBookOpen size={40} style={{ color: "#D1D5DB" }} />
        <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>No document uploaded</h2>
        <p className="text-sm text-center" style={{ color: "#9CA3AF" }}>
          Please upload a PDF before generating questions.
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition hover:scale-105"
          style={{ backgroundColor: "#2D3A8C", boxShadow: "0 4px 14px rgba(45,58,140,0.3)" }}
        >
          Upload PDF
        </button>
      </div>
    );
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Generating questions with AI…");

    try {
      const data = await generateQuestions({
        sessionId: session.sessionId,
        questionType: generateConfig.questionType,
        difficulty: generateConfig.difficulty,
        count: generateConfig.count,
        topic: topic.trim() || null,
      });

      saveQuestionSet(data);
      updateConfig({ topic: topic.trim() });

      toast.success(
        `✅ ${data.questions.length} questions generated!`,
        { id: toastId, duration: 3000 }
      );

      navigate("/results");
    } catch (err) {
      toast.error(err.message || "Generation failed. Please try again.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHistorySet = (setId) => {
    navigate(`/history`);
  };

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.9rem",
              color: "#1F2937",
              letterSpacing: "-0.3px",
            }}
          >
            Generate Questions
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
            Configure your quiz settings and let AI do the rest.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left: Config form ── */}
          <div className="flex-1 flex flex-col gap-5">

            {/* Document info banner */}
            <div
              className="px-4 py-3 rounded-xl flex items-center gap-3"
              style={{
                backgroundColor: "rgba(45,58,140,0.06)",
                border: "1px solid rgba(45,58,140,0.12)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(45,58,140,0.1)" }}
              >
                <FiBookOpen size={15} style={{ color: "#2D3A8C" }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "#1F2937" }}>
                  {session.fileName}
                </p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  {session.pageCount} pages · {session.chunkCount} chunks indexed
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }} />
                <span className="text-xs font-medium" style={{ color: "#10B981" }}>Ready</span>
              </div>
            </div>

            {/* Config card */}
            <div
              className="p-6 rounded-2xl flex flex-col gap-7"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #F3F4F6",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              <QuestionTypeSelector
                value={generateConfig.questionType}
                onChange={(v) => updateConfig({ questionType: v })}
              />

              <DifficultySelector
                value={generateConfig.difficulty}
                onChange={(v) => updateConfig({ difficulty: v })}
              />

              <CountSelector
                value={generateConfig.count}
                onChange={(v) => updateConfig({ count: v })}
              />

              {/* Topic input */}
              <div>
                <label
                  className="text-sm font-semibold block mb-2"
                  style={{ color: "#1F2937" }}
                >
                  Topic Filter{" "}
                  <span className="font-normal text-xs" style={{ color: "#9CA3AF" }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. photosynthesis, World War II, recursion…"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    border: "2px solid #E5E7EB",
                    backgroundColor: "#F9FAFB",
                    color: "#1F2937",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2D3A8C")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
                <p className="text-xs mt-1.5" style={{ color: "#9CA3AF" }}>
                  Leave blank to generate from the entire document.
                </p>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              style={{
                backgroundColor: "#2D3A8C",
                boxShadow: "0 4px 20px rgba(45,58,140,0.35)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Generating with AI…
                </>
              ) : (
                <>
                  <FiZap size={18} />
                  Generate {generateConfig.count} Questions
                </>
              )}
            </button>
          </div>

          {/* ── Right: Session history sidebar ── */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <SessionHistory onSelectSet={handleSelectHistorySet} />
          </div>
        </div>
      </div>
    </div>
  );
}