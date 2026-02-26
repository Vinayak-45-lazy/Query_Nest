import { RiLeafLine, RiFireLine, RiBlazeLineIcon } from "react-icons/ri";
import { HiOutlineLightningBolt } from "react-icons/hi";

const DIFFICULTIES = [
  {
    value: "Easy",
    label: "Easy",
    description: "Recall & basic comprehension",
    icon: RiLeafLine,
    color: "#10B981",
    bgColor: "rgba(16,185,129,0.08)",
    borderColor: "rgba(16,185,129,0.3)",
    activeBg: "#10B981",
    shadow: "rgba(16,185,129,0.3)",
  },
  {
    value: "Medium",
    label: "Medium",
    description: "Application & analysis",
    icon: HiOutlineLightningBolt,
    color: "#F59E0B",
    bgColor: "rgba(245,158,11,0.08)",
    borderColor: "rgba(245,158,11,0.3)",
    activeBg: "#F59E0B",
    shadow: "rgba(245,158,11,0.3)",
  },
  {
    value: "Hard",
    label: "Hard",
    description: "Synthesis & evaluation",
    icon: RiFireLine,
    color: "#EF4444",
    bgColor: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.3)",
    activeBg: "#EF4444",
    shadow: "rgba(239,68,68,0.3)",
  },
];

export default function DifficultySelector({ value, onChange }) {
  return (
    <div>
      <p
        className="text-sm font-semibold mb-3"
        style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Difficulty Level
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {DIFFICULTIES.map((diff) => {
          const isSelected = value === diff.value;
          const Icon = diff.icon;

          return (
            <button
              key={diff.value}
              onClick={() => onChange(diff.value)}
              className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: isSelected ? diff.activeBg : diff.bgColor,
                border: `2px solid ${isSelected ? diff.activeBg : diff.borderColor}`,
                boxShadow: isSelected ? `0 4px 16px ${diff.shadow}` : "none",
                cursor: "pointer",
              }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: isSelected
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(255,255,255,0.7)",
                }}
              >
                <Icon
                  size={18}
                  style={{ color: isSelected ? "#ffffff" : diff.color }}
                />
              </div>

              {/* Text */}
              <div className="text-left">
                <p
                  className="text-sm font-bold leading-tight"
                  style={{
                    color: isSelected ? "#ffffff" : "#1F2937",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {diff.label}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    color: isSelected ? "rgba(255,255,255,0.7)" : "#9CA3AF",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {diff.description}
                </p>
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}