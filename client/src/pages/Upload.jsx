import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiShieldCheckLine, RiFileTextLine, RiTimeLine } from "react-icons/ri";
import { useSession } from "../context/SessionContext";
import UploadCard from "../components/UploadCard";

const TIPS = [
  {
    icon: RiFileTextLine,
    title: "Best PDF types",
    desc: "Textbooks, lecture notes, research papers, study guides",
  },
  {
    icon: RiShieldCheckLine,
    title: "Size limit",
    desc: "Maximum 10MB per file. Text-based PDFs work best.",
  },
  {
    icon: RiTimeLine,
    title: "Processing time",
    desc: "Most PDFs are indexed in under 30 seconds.",
  },
];

export default function Upload() {
  const navigate = useNavigate();
  const { session } = useSession();

  // If already in a session, show option to continue
  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Page header */}
        <div className="text-center mb-10">
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "2rem",
              color: "#1F2937",
              letterSpacing: "-0.3px",
            }}
          >
            Upload your PDF
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#6B7280" }}>
            Upload any PDF document and we'll index it for AI question generation.
          </p>
        </div>

        {/* Active session warning */}
        {session && (
          <div
            className="mb-6 px-4 py-3 rounded-xl flex items-center justify-between gap-4"
            style={{
              backgroundColor: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
                Active session: {session.fileName}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#B45309" }}>
                Uploading a new PDF will replace your current session.
              </p>
            </div>
            <button
              onClick={() => navigate("/generate")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors hover:opacity-90"
              style={{ backgroundColor: "#F59E0B", color: "#ffffff" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Upload card */}
        <UploadCard />

        {/* Tips */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIPS.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.title}
                className="p-4 rounded-xl flex gap-3"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #F3F4F6",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(45,58,140,0.08)" }}
                >
                  <Icon size={16} style={{ color: "#2D3A8C" }} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#1F2937" }}>{tip.title}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#9CA3AF" }}>{tip.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}