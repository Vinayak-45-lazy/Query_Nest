import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiZap, FiInbox } from "react-icons/fi";
import { RiListCheck2, RiQuestionAnswerLine, RiCheckboxLine, RiShuffleLine } from "react-icons/ri";
import { useSession } from "../context/SessionContext";
import QuestionCard from "../components/QuestionCard";
import DownloadButton from "../components/DownloadButton";

const TYPE_ICONS = {
  MCQ: RiListCheck2,
  ShortAnswer: RiQuestionAnswerLine,
  TrueFalse: RiCheckboxLine,
  Mixed: RiShuffleLine,
};

const DIFF_COLORS = {
  Easy: { color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  Medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  Hard: { color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
};

export default function Results() {
  const navigate = useNavigate();
  const { currentQuestionSet, session } = useSession();

  // Empty state — no questions generated yet
  if (!currentQuestionSet || !currentQuestionSet.questions?.length) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{ backgroundColor: "#F9FAFB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <FiInbox size={40} style={{ color: "#D1D5DB" }} />
        <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>No questions yet</h2>
        <p className="text-sm text-center" style={{ color: "#9CA3AF" }}>
          Head to Generate to create your first question set.
        </p>
        <button
          onClick={() => navigate(session ? "/generate" : "/upload")}
          className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition hover:scale-105"
          style={{ backgroundColor: "#2D3A8C", boxShadow: "0 4px 14px rgba(45,58,140,0.3)" }}
        >
          {session ? "Generate Questions" : "Upload PDF"}
        </button>
      </div>
    );
  }

  const { questions, questionType, difficulty, count, topic, generatedAt } = currentQuestionSet;
  const TypeIcon = TYPE_ICONS[questionType] || RiListCheck2;
  const diffStyle = DIFF_COLORS[difficulty] || DIFF_COLORS.Medium;

  const formattedDate = (() => {
    try {
      return new Date(generatedAt).toLocaleString([], {
        month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return ""; }
  })();

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">

        {/* ── Top bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate("/generate")}
              className="flex items-center gap-1.5 text-sm mb-3 transition-colors hover:opacity-70"
              style={{ color: "#6B7280" }}
            >
              <FiArrowLeft size={14} />
              Back to Generate
            </button>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.9rem",
                color: "#1F2937",
                letterSpacing: "-0.3px",
              }}
            >
              Your Questions
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/generate")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #E5E7EB",
                color: "#2D3A8C",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <FiZap size={14} />
              Generate Again
            </button>
            <DownloadButton
              questionSet={currentQuestionSet}
              fileName={session?.fileName}
            />
          </div>
        </div>

        {/* ── Meta card ── */}
        <div
          className="p-4 rounded-2xl mb-8 flex flex-wrap items-center gap-4"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #F3F4F6",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          {/* Type */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(45,58,140,0.08)" }}>
              <TypeIcon size={16} style={{ color: "#2D3A8C" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>Type</p>
              <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>{questionType}</p>
            </div>
          </div>

          <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: "#F3F4F6" }} />

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: diffStyle.bg, color: diffStyle.color }}
            >
              {difficulty}
            </span>
          </div>

          <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: "#F3F4F6" }} />

          {/* Count */}
          <div>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>Questions</p>
            <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>{questions.length}</p>
          </div>

          {/* Topic */}
          {topic && (
            <>
              <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: "#F3F4F6" }} />
              <div>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>Topic</p>
                <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>{topic}</p>
              </div>
            </>
          )}

          {/* Source */}
          {session?.fileName && (
            <>
              <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: "#F3F4F6" }} />
              <div className="min-w-0">
                <p className="text-xs" style={{ color: "#9CA3AF" }}>Source</p>
                <p className="text-sm font-semibold truncate max-w-[180px]" style={{ color: "#1F2937" }}>
                  {session.fileName}
                </p>
              </div>
            </>
          )}

          {/* Time */}
          {formattedDate && (
            <div className="ml-auto">
              <p className="text-xs text-right" style={{ color: "#9CA3AF" }}>{formattedDate}</p>
            </div>
          )}
        </div>

        {/* ── Flip hint ── */}
        <p className="text-xs text-center mb-6" style={{ color: "#9CA3AF" }}>
          💡 Click any card to flip and reveal the answer
        </p>

        {/* ── Question cards grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.questionId}
              question={q}
              index={idx}
              questionType={questionType}
              difficulty={difficulty}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/generate")}
            className="px-7 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #E5E7EB",
              color: "#2D3A8C",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            ← Generate New Set
          </button>
          <DownloadButton
            questionSet={currentQuestionSet}
            fileName={session?.fileName}
          />
        </div>
      </div>
    </div>
  );
}