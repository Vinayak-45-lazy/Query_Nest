import { useState } from "react";
import { FiCopy, FiCheck, FiRotateCcw } from "react-icons/fi";
import { RiListCheck2, RiQuestionAnswerLine, RiCheckboxLine, RiShuffleLine } from "react-icons/ri";

const TYPE_ICONS = {
  MCQ: RiListCheck2,
  ShortAnswer: RiQuestionAnswerLine,
  TrueFalse: RiCheckboxLine,
  Mixed: RiShuffleLine,
};

const DIFF_STYLES = {
  Easy:   { color: "#065F46", bg: "#D1FAE5", border: "#A7F3D0" },
  Medium: { color: "#854D0E", bg: "#FEF9C3", border: "#FDE047" },
  Hard:   { color: "#7F1D1D", bg: "#FEE2E2", border: "#FCA5A5" },
};

export default function QuestionCard({ question, index, questionType, difficulty }) {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const diff = DIFF_STYLES[difficulty] || DIFF_STYLES.Medium;

  const handleCopy = (e) => {
    e.stopPropagation();
    const text = `Q: ${question.questionText}\nA: ${question.correctAnswer}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOption = (opt) =>
    typeof opt === "string" && opt.trim().length > 0;

  const options = Array.isArray(question.options)
    ? question.options.filter(isOption)
    : [];

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{
        cursor: "pointer",
        perspective: "1000px",
        height: "auto",
        minHeight: "220px",
      }}
    >
      <div style={{
        position: "relative",
        width: "100%",
        transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>

        {/* ── FRONT ── */}
        <div style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Number badge */}
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                backgroundColor: "#4F46E5",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ffffff" }}>
                  {index + 1}
                </span>
              </div>
              {/* Type badge */}
              <span style={{
                fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px",
                borderRadius: "6px", backgroundColor: "#EEF2FF", color: "#4338CA",
              }}>
                {questionType}
              </span>
              {/* Difficulty badge */}
              <span style={{
                fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px",
                borderRadius: "6px",
                backgroundColor: diff.bg,
                color: diff.color,
                border: `1px solid ${diff.border}`,
              }}>
                {difficulty}
              </span>
            </div>
            {/* Copy button */}
            <button
              onClick={handleCopy}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "4px", borderRadius: "6px",
                color: copied ? "#10B981" : "#94A3B8",
                transition: "color 0.2s",
              }}
              title="Copy question"
            >
              {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
            </button>
          </div>

          {/* Question text */}
          <p style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#0F172A",
            lineHeight: 1.65,
            margin: 0,
          }}>
            {question.questionText}
          </p>

          {/* MCQ options */}
          {options.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {options.map((opt, i) => (
                <div key={i} style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  fontSize: "0.8rem",
                  color: "#475569",
                  lineHeight: 1.5,
                }}>
                  {opt}
                </div>
              ))}
            </div>
          )}

          {/* Flip hint */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "5px", paddingTop: "4px",
            borderTop: "1px solid #F1F5F9",
          }}>
            <FiRotateCcw size={11} style={{ color: "#CBD5E1" }} />
            <span style={{ fontSize: "0.7rem", color: "#CBD5E1", fontWeight: 500 }}>
              Click to reveal answer
            </span>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}>
          {/* Back header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                backgroundColor: "#4F46E5",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ffffff" }}>
                  {index + 1}
                </span>
              </div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#475569" }}>Answer</span>
            </div>
            <FiRotateCcw size={13} style={{ color: "#CBD5E1" }} />
          </div>

          {/* Answer box */}
          <div style={{
            padding: "12px 14px",
            borderRadius: "10px",
            backgroundColor: "#EEF2FF",
            border: "1px solid #C7D2FE",
          }}>
            <p style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#4338CA",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              Correct Answer
            </p>
            <p style={{ fontSize: "0.875rem", color: "#1E1B4B", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
              {question.correctAnswer}
            </p>
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div style={{
              padding: "10px 14px",
              borderRadius: "10px",
              backgroundColor: "#F0FDF4",
              border: "1px solid #BBF7D0",
            }}>
              <p style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#166534",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                💡 Explanation
              </p>
              <p style={{ fontSize: "0.8rem", color: "#166534", lineHeight: 1.65, margin: 0 }}>
                {question.explanation}
              </p>
            </div>
          )}

          {/* Flip back hint */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "5px", paddingTop: "4px",
            borderTop: "1px solid #F1F5F9",
          }}>
            <FiRotateCcw size={11} style={{ color: "#CBD5E1" }} />
            <span style={{ fontSize: "0.7rem", color: "#CBD5E1", fontWeight: 500 }}>
              Click to flip back
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}