import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "./context/SessionContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Generate from "./pages/Generate";
import Results from "./pages/Results";
import History from "./pages/History";

// ───────────────────────────────────────────
// Tailwind base styles injected via index.css
// ───────────────────────────────────────────

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F9FAFB" }}>

          {/* Global Navbar */}
          <Navbar />

          {/* Page content */}
          <main className="flex-1">
            <Routes>
              <Route path="/"         element={<Home />} />
              <Route path="/upload"   element={<Upload />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/results"  element={<Results />} />
              <Route path="/history"  element={<History />} />
              {/* Catch-all → home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer
            className="py-5 text-center text-xs"
            style={{
              color: "#9CA3AF",
              borderTop: "1px solid #F3F4F6",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <span style={{ fontFamily: "'DM Serif Display', serif", color: "#2D3A8C" }}>
              QueryNest
            </span>{" "}
            — AI Question Generator · Built with Groq + LangChain + FAISS
          </footer>

          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.8rem",
                borderRadius: "12px",
                padding: "10px 14px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              },
              success: {
                iconTheme: { primary: "#10B981", secondary: "#ffffff" },
              },
              error: {
                iconTheme: { primary: "#EF4444", secondary: "#ffffff" },
              },
              loading: {
                iconTheme: { primary: "#2D3A8C", secondary: "#ffffff" },
              },
            }}
          />
        </div>
      </BrowserRouter>
    </SessionProvider>
  );
}