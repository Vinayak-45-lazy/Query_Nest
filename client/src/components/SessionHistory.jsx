import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiTrash2, FiChevronRight, FiInbox } from "react-icons/fi";
import { RiListCheck2, RiQuestionAnswerLine, RiCheckboxLine, RiShuffleLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { getHistory, clearSession } from "../services/api";
import { useSession } from "../context/SessionContext";

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
  Easy: "#10B981",
  Medium: "#F59E0B",
  Hard: "#EF4444",
};

export default function SessionHistory({ onSelectSet }) {
  const navigate = useNavigate();
  const { session, clearSession: clearLocalSession } = useSession();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
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
      // silently fail — history is a bonus feature
    } finally {
      setLoading(false);
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
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  if (!session) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #F3F4F6",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid #F3F4F6" }}
      >
        <div>
          <p className="text-sm font-bold" style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Session History
          </p>
          <p className="text-xs mt-0.5 truncate max-w-[160px]" style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {session.fileName}
          </p>
        </div>
        <button
          onClick={handleClearSession}
          disabled={clearing}
          className="p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          title="Clear session"
        >
          <FiTrash2 size={14} style={{ color: "#EF4444" }} />
        </button>
      </div>

      {/* Document meta */}
      <div className="px-4 py-2 flex items-center gap-3" style={{ borderBottom: "1px solid #F9FAFB" }}>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pages</span>
          <span className="text-xs font-semibold" style={{ color: "#2D3A8C", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{session.pageCount}</span>
        </div>
        <div className="w-px h-3" style={{ backgroundColor: "#E5E7EB" }} />
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Chunks</span>
          <span className="text-xs font-semibold" style={{ color: "#2D3A8C", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{session.chunkCount}</span>
        </div>
        <div className="w-px h-3" style={{ backgroundColor: "#E5E7EB" }} />
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }} />
          <span className="text-xs font-medium" style={{ color: "#10B981", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ready</span>
        </div>
      </div>

      {/* Question sets list */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-6 flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl animate-pulse" style={{ backgroundColor: "#F3F4F6" }} />
            ))}
          </div>
        ) : !history || history.questionSets?.length === 0 ? (
          <div className="px-4 py-8 flex flex-col items-center gap-2 text-center">
            <FiInbox size={24} style={{ color: "#D1D5DB" }} />
            <p className="text-xs" style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              No question sets yet.<br />Generate your first set!
            </p>
          </div>
        ) : (
          <div className="p-2 flex flex-col gap-1">
            {history.questionSets.map((qs) => {
              const Icon = TYPE_ICONS[qs.questionType] || RiListCheck2;
              const typeColor = TYPE_COLORS[qs.questionType] || "#2D3A8C";
              const diffColor = DIFF_COLORS[qs.difficulty] || "#F59E0B";

              return (
                <button
                  key={qs.setId}
                  onClick={() => onSelectSet?.(qs.setId)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 hover:bg-gray-50 group"
                >
                  {/* Icon */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${typeColor}12` }}
                  >
                    <Icon size={14} style={{ color: typeColor }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold" style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {qs.questionType}
                      </span>
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${diffColor}15`, color: diffColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {qs.difficulty}
                      </span>
                      <span className="text-xs" style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {qs.count}Q
                      </span>
                    </div>
                    {qs.topic && (
                      <p className="text-xs truncate mt-0.5" style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {qs.topic}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-0.5">
                      <FiClock size={10} style={{ color: "#D1D5DB" }} />
                      <span className="text-xs" style={{ color: "#D1D5DB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {formatTime(qs.generatedAt)}
                      </span>
                    </div>
                  </div>

                  <FiChevronRight size={14} style={{ color: "#D1D5DB" }} className="group-hover:text-gray-400 transition-colors flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}