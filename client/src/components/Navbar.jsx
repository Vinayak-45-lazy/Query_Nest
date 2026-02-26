import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useSession } from "../context/SessionContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/upload", label: "Upload" },
    { to: "/generate", label: "Generate" },
    { to: "/history", label: "History" },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav style={{
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #F1F5F9",
      position: "sticky",
      top: 0,
      zIndex: 50,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div className="max-w-5xl mx-auto px-5 flex items-center justify-between" style={{ height: "60px" }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "8px",
            backgroundColor: "#4F46E5",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "14px" }}>Q</span>
          </div>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.2rem",
            color: "#0F172A",
            letterSpacing: "-0.3px",
          }}>
            Query<span style={{ color: "#4F46E5" }}>Nest</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to}
              style={{
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: isActive(to) ? "#4F46E5" : "#64748B",
                backgroundColor: isActive(to) ? "#EEF2FF" : "transparent",
                transition: "all 0.15s",
              }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          {session && (
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "4px 10px", borderRadius: "8px",
              backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0",
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {session.fileName}
              </span>
            </div>
          )}
          <button
            onClick={() => navigate(session ? "/generate" : "/upload")}
            style={{
              padding: "7px 18px",
              borderRadius: "8px",
              backgroundColor: "#4F46E5",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseOver={(e) => e.target.style.opacity = "0.9"}
            onMouseOut={(e) => e.target.style.opacity = "1"}
          >
            {session ? "Generate →" : "Get started"}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: "6px" }}
        >
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: "1px solid #F1F5F9",
          padding: "1rem 1.25rem",
          backgroundColor: "#ffffff",
        }}>
          {links.map(({ to, label }) => (
            <Link key={to} to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: isActive(to) ? "#4F46E5" : "#64748B",
                backgroundColor: isActive(to) ? "#EEF2FF" : "transparent",
                marginBottom: "2px",
              }}>
              {label}
            </Link>
          ))}
          <button
            onClick={() => { navigate(session ? "/generate" : "/upload"); setMenuOpen(false); }}
            style={{
              width: "100%", marginTop: "8px",
              padding: "10px", borderRadius: "8px",
              backgroundColor: "#4F46E5", color: "#ffffff",
              fontSize: "0.875rem", fontWeight: 700,
              border: "none", cursor: "pointer",
            }}
          >
            {session ? "Generate Questions" : "Get started free"}
          </button>
        </div>
      )}
    </nav>
  );
}