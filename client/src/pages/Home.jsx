import { useNavigate } from "react-router-dom";
import { RiUploadCloud2Line, RiSettings4Line, RiFileList3Line, RiDownload2Line } from "react-icons/ri";
import { FiArrowRight, FiCheck, FiStar } from "react-icons/fi";
import { useSession } from "../context/SessionContext";

const FEATURES = [
  {
    icon: RiUploadCloud2Line,
    title: "Upload Any PDF",
    description: "Textbooks, lecture notes, research papers. Any PDF up to 10MB.",
    tag: "Step 1",
  },
  {
    icon: RiSettings4Line,
    title: "Configure",
    description: "Choose question type, difficulty level, and how many questions you need.",
    tag: "Step 2",
  },
  {
    icon: RiFileList3Line,
    title: "AI Generates",
    description: "Llama 3.3 70B reads your content and writes accurate, relevant questions.",
    tag: "Step 3",
  },
  {
    icon: RiDownload2Line,
    title: "Study & Export",
    description: "Flip cards to reveal answers. Download a clean PDF whenever you're ready.",
    tag: "Step 4",
  },
];

const SOCIAL_PROOF = [
  { name: "Riya M.", role: "NEET Student", text: "Cut my revision time in half. The MCQs are surprisingly accurate." },
  { name: "Dev S.", role: "CS Undergrad", text: "I paste my lecture notes and get a quiz instantly. Game changer." },
  { name: "Ms. Rao", role: "High School Teacher", text: "I use it to create weekly quizzes for my class. Students love it." },
];

export default function Home() {
  const navigate = useNavigate();
  const { session } = useSession();

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: "#ffffff" }}>

      {/* ── Hero ── */}
      <section style={{
        backgroundColor: "#ffffff",
        paddingTop: "5rem",
        paddingBottom: "5rem",
        borderBottom: "1px solid #F1F5F9",
      }}>
        <div className="max-w-5xl mx-auto px-6">

          {/* Top label */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
              style={{ backgroundColor: "#EEF2FF", border: "1px solid #C7D2FE" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#4F46E5" }} />
              <span className="text-xs font-semibold" style={{ color: "#4338CA" }}>
                Powered by Llama 3.3 70B via Groq — 100% free
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              color: "#0F172A",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              marginBottom: "1.5rem",
            }}>
              Turn any PDF into a{" "}
              <span style={{
                color: "#4F46E5",
                borderBottom: "3px solid #C7D2FE",
                paddingBottom: "2px",
              }}>
                quiz in seconds
              </span>
            </h1>
            <p style={{
              color: "#64748B",
              fontSize: "1.1rem",
              lineHeight: 1.75,
              maxWidth: "520px",
              margin: "0 auto",
            }}>
              Upload a textbook, notes, or research paper. QueryNest generates
              MCQ, short answer, and true/false questions tailored to your content.
            </p>
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <button
              onClick={() => navigate(session ? "/generate" : "/upload")}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white transition-all duration-150 hover:opacity-90 hover:scale-[1.02]"
              style={{
                backgroundColor: "#4F46E5",
                fontSize: "0.95rem",
                boxShadow: "0 1px 3px rgba(79,70,229,0.3), 0 4px 16px rgba(79,70,229,0.2)",
              }}
            >
              {session ? "Generate Questions" : "Get started free"}
              <FiArrowRight size={16} />
            </button>
            <button
              onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold transition-all duration-150 hover:bg-slate-50"
              style={{
                backgroundColor: "#ffffff",
                color: "#334155",
                fontSize: "0.95rem",
                border: "1px solid #E2E8F0",
              }}
            >
              See how it works
            </button>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap justify-center gap-6">
            {["No account needed", "No credit card", "Results in under 30s", "Export to PDF"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <FiCheck size={13} style={{ color: "#4F46E5" }} />
                <span className="text-xs font-medium" style={{ color: "#64748B" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof strip ── */}
      <section style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #F1F5F9", padding: "1.25rem 1.5rem" }}>
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6">
          <span className="text-xs font-semibold" style={{ color: "#94A3B8" }}>USED BY STUDENTS AT</span>
          {["IIT Delhi", "BITS Pilani", "NIT Trichy", "Delhi University", "VIT"].map((u) => (
            <span key={u} className="text-xs font-bold" style={{ color: "#CBD5E1" }}>{u}</span>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem", borderBottom: "1px solid #F1F5F9" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4F46E5" }}>
              How it works
            </p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: "#0F172A" }}>
              From PDF to quiz in 4 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  className="relative p-6 rounded-2xl group transition-all duration-200 hover:-translate-y-1"
                  style={{
                    backgroundColor: "#FAFAFA",
                    border: "1px solid #F1F5F9",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Step tag */}
                  <div className="inline-block px-2 py-0.5 rounded-md text-xs font-bold mb-4"
                    style={{ backgroundColor: "#EEF2FF", color: "#4338CA" }}>
                    {f.tag}
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: "#EEF2FF" }}>
                    <Icon size={20} style={{ color: "#4F46E5" }} />
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: "#0F172A" }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{f.description}</p>

                  {/* Connector arrow */}
                  {idx < 3 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <FiArrowRight size={14} style={{ color: "#CBD5E1" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Live demo card ── */}
      <section style={{ backgroundColor: "#F8FAFC", padding: "5rem 1.5rem", borderBottom: "1px solid #F1F5F9" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4F46E5" }}>
              Preview
            </p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: "#0F172A" }}>
              Here's what you'll get
            </h2>
          </div>

          {/* Mock UI */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}>
            {/* Window bar */}
            <div style={{
              padding: "0.75rem 1.25rem",
              borderBottom: "1px solid #F1F5F9",
              backgroundColor: "#FAFAFA",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FDA4AF" }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FCD34D" }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#86EFAC" }} />
              <span className="ml-3 text-xs font-medium" style={{ color: "#94A3B8" }}>QueryNest — Results</span>
            </div>

            <div style={{ padding: "1.5rem" }}>
              {/* Meta row */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: "MCQ", color: "#EEF2FF", text: "#4338CA" },
                  { label: "Medium", color: "#FEF9C3", text: "#854D0E" },
                  { label: "10 questions", color: "#F0FDF4", text: "#166534" },
                  { label: "Photosynthesis", color: "#F1F5F9", text: "#475569" },
                ].map((b) => (
                  <span key={b.label} className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ backgroundColor: b.color, color: b.text }}>
                    {b.label}
                  </span>
                ))}
              </div>

              {/* Sample question */}
              <div style={{
                padding: "1rem 1.25rem",
                borderRadius: "12px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                marginBottom: "0.75rem",
              }}>
                <p className="text-xs font-bold mb-2" style={{ color: "#94A3B8" }}>Q1 of 10</p>
                <p className="text-sm font-medium mb-4" style={{ color: "#0F172A", lineHeight: 1.6 }}>
                  Which pigment is primarily responsible for absorbing light energy during photosynthesis?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["A. Xanthophyll", "B. Chlorophyll ✓", "C. Carotene", "D. Anthocyanin"].map((opt, i) => (
                    <div key={opt} className="px-3 py-2 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: i === 1 ? "#EEF2FF" : "#ffffff",
                        border: `1px solid ${i === 1 ? "#A5B4FC" : "#E2E8F0"}`,
                        color: i === 1 ? "#4338CA" : "#475569",
                      }}>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div style={{
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                backgroundColor: "#F0FDF4",
                border: "1px solid #BBF7D0",
              }}>
                <p className="text-xs font-bold mb-1" style={{ color: "#166534" }}>💡 Explanation</p>
                <p className="text-xs" style={{ color: "#166534", lineHeight: 1.6 }}>
                  Chlorophyll, found in chloroplasts, absorbs red and blue wavelengths of light and is the primary pigment driving the light-dependent reactions of photosynthesis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem", borderBottom: "1px solid #F1F5F9" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4F46E5" }}>
              Testimonials
            </p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: "#0F172A" }}>
              Students & teachers love it
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SOCIAL_PROOF.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl"
                style={{
                  backgroundColor: "#FAFAFA",
                  border: "1px solid #F1F5F9",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                <div className="flex gap-0.5 mb-4">
                  {"12345".split("").map((_, i) => (
                    <FiStar key={i} size={13} style={{ color: "#FBBF24", fill: "#FBBF24" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#334155" }}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "#EEF2FF", color: "#4F46E5" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: "#0F172A" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "#94A3B8" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        backgroundColor: "#4F46E5",
        padding: "5rem 1.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <div className="max-w-xl mx-auto relative">
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "2.5rem",
            color: "#ffffff",
            lineHeight: 1.15,
            marginBottom: "1rem",
            letterSpacing: "-0.5px",
          }}>
            Start studying smarter today
          </h2>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
            No account. No credit card. Just upload your PDF and get a quiz in seconds.
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-150 hover:scale-105"
            style={{
              backgroundColor: "#ffffff",
              color: "#4F46E5",
              fontSize: "0.95rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            Upload your first PDF <FiArrowRight size={16} />
          </button>
        </div>
      </section>

    </div>
  );
}