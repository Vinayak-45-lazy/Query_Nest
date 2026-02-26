import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiTrash2, FiZap, FiInbox, FiChevronRight } from "react-icons/fi";
import { RiListCheck2, RiQuestionAnswerLine, RiCheckboxLine, RiShuffleLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { getHistory, getQuestionSet, clearSession } from "../services/api";
import { useSession } from "../context/SessionContext";
import QuestionCard from "../components/QuestionCard";
import DownloadButton from "../components/DownloadButton";

const TYPE_ICONS = {
  MCQ: RiListCheck2,
  ShortAnswer: RiQuestionAnswerLine,
  TrueFalse: RiCheckboxLine,
  Mixed: RiShuffleLine,
};

const TYPE_COLORS = {
  MCQ: "#2D3A8C",
  ShortAnswer: "#7C3AED",
  TrueFalse: "#F59E0B",
  Mixed: "#6B7280",
};

const DIFF_COLORS = {
  Easy: { color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  Medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  Hard: { color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
};

export default function History() {
  const navigate = useNavigate();
  const { session, saveQuestionSet, clearSession: clearLocalSession } = useSession();

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loadingSet, setLoadingSet] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!session?.sessionId) return;
    fetchHistory();
  }, [session?.sessionId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory(session.sessionId);
      setHistory(data);
    } catch (err) {
      toast.error("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSet = async (setId) => {
    setLoadingSet(true);
    try {
      const data = await getQuestionSet(setId);
      setSelectedSet(data);
      saveQuestionSet(data);
    } catch (err) {
      toast.error("Failed to load question set.");
    } finally {
      setLoadingSet(false);
    }
  };

  const handleClearSession = async () => {
    if (!window.confirm("Clear this session? All generated questions will be lost.")) return;
    setClearing(true);
    try {
      await clearSession(session.sessionId);
      clearLocalSession();
      toast.success("Session cleared.");
      navigate("/upload");
    } catch (err) {
      toast.error("Failed to clear session.");
    } finally {
      setClearing(false);
    }
  };

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleString([], {
        month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return ""; }
  };

  // No session
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{ backgroundColor: "#F9FAFB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <FiInbox size={40} style={{ color: "#D1D5DB" }} />
        <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>No active session</h2>
        <p className="text-sm" style={{ color: "#9CA3AF" }}>Upload a PDF to get started.</p>
        <button onClick={() => navigate("/upload")}
          className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition hover:scale-105"
          style={{ backgroundColor: "#2D3A8C" }}>
          Upload PDF
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.9rem", color: "#1F2937", letterSpacing: "-0.3px",
            }}>
              Session History
            </h1>
            <p className="mt-1 text-sm truncate max-w-xs" style={{ color: "#6B7280" }}>
              {session.fileName} · {session.pageCount} pages
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => navigate("/generate")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition hover:scale-105"
              style={{ backgroundColor: "#2D3A8C", color: "#ffffff", boxShadow: "0 4px 14px rgba(45,58,140,0.3)" }}>
              <FiZap size={14} /> New Set
            </button>
            <button
              onClick={handleClearSession}
              disabled={clearing}
              className="p-2.5 rounded-xl transition hover:bg-red-50 disabled:opacity-50"
              style={{ border: "1px solid #FCA5A5" }}
              title="Clear session">
              <FiTrash2 size={15} style={{ color: "#EF4444" }} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left: Question set list ── */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#ffffff", border: "1px solid #F3F4F6", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>

              <div className="px-4 py-3" style={{ borderBottom: "1px solid #F3F4F6" }}>
                <p className="text-sm font-bold" style={{ color: "#1F2937" }}>
                  Question Sets
                  {history && (
                    <span className="ml-2 text-xs font-normal" style={{ color: "#9CA3AF" }}>
                      ({history.totalSets})
                    </span>
                  )}
                </p>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 flex flex-col gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-14 rounded-xl animate-pulse" style={{ backgroundColor: "#F3F4F6" }} />
                    ))}
                  </div>
                ) : !history?.questionSets?.length ? (
                  <div className="px-4 py-10 flex flex-col items-center gap-2 text-center">
                    <FiInbox size={24} style={{ color: "#D1D5DB" }} />
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>No sets generated yet.</p>
                  </div>
                ) : (
                  <div className="p-2 flex flex-col gap-1">
                    {history.questionSets.map((qs) => {
                      const Icon = TYPE_ICONS[qs.questionType] || RiListCheck2;
                      const typeColor = TYPE_COLORS[qs.questionType] || "#2D3A8C";
                      const diffStyle = DIFF_COLORS[qs.difficulty] || DIFF_COLORS.Medium;
                      const isActive = selectedSet?.setId === qs.setId;

                      return (
                        <button
                          key={qs.setId}
                          onClick={() => handleSelectSet(qs.setId)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all"
                          style={{
                            backgroundColor: isActive ? "rgba(45,58,140,0.06)" : "transparent",
                            border: isActive ? "1px solid rgba(45,58,140,0.12)" : "1px solid transparent",
                          }}
                        >
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${typeColor}12` }}>
                            <Icon size={16} style={{ color: typeColor }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold" style={{ color: "#1F2937" }}>{qs.questionType}</span>
                              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ backgroundColor: diffStyle.bg, color: diffStyle.color }}>
                                {qs.difficulty}
                              </span>
                              <span className="text-xs" style={{ color: "#9CA3AF" }}>{qs.count}Q</span>
                            </div>
                            {qs.topic && (
                              <p className="text-xs truncate mt-0.5" style={{ color: "#9CA3AF" }}>{qs.topic}</p>
                            )}
                            <div className="flex items-center gap-1 mt-0.5">
                              <FiClock size={9} style={{ color: "#D1D5DB" }} />
                              <span className="text-xs" style={{ color: "#D1D5DB" }}>{formatTime(qs.generatedAt)}</span>
                            </div>
                          </div>
                          <FiChevronRight size={13} style={{ color: isActive ? "#2D3A8C" : "#D1D5DB", flexShrink: 0 }} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Selected set detail ── */}
          <div className="flex-1 min-w-0">
            {loadingSet ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-52 rounded-2xl animate-pulse" style={{ backgroundColor: "#E5E7EB" }} />
                ))}
              </div>
            ) : !selectedSet ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 rounded-2xl"
                style={{ backgroundColor: "#ffffff", border: "2px dashed #E5E7EB" }}>
                <FiChevronRight size={28} style={{ color: "#D1D5DB" }} />
                <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
                  Select a question set to preview
                </p>
              </div>
            ) : (
              <div>
                {/* Set header */}
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold" style={{ color: "#1F2937" }}>
                      {selectedSet.questionType}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: DIFF_COLORS[selectedSet.difficulty]?.bg,
                        color: DIFF_COLORS[selectedSet.difficulty]?.color,
                      }}>
                      {selectedSet.difficulty}
                    </span>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>
                      {selectedSet.questions.length} questions
                    </span>
                    {selectedSet.topic && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "rgba(45,58,140,0.08)", color: "#2D3A8C" }}>
                        {selectedSet.topic}
                      </span>
                    )}
                  </div>
                  <DownloadButton questionSet={selectedSet} fileName={session?.fileName} />
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {selectedSet.questions.map((q, idx) => (
                    <QuestionCard
                      key={q.questionId}
                      question={q}
                      index={idx}
                      questionType={selectedSet.questionType}
                      difficulty={selectedSet.difficulty}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}