import { RiListCheck2, RiQuestionAnswerLine, RiCheckboxLine, RiShuffleLine } from "react-icons/ri";

const TYPES = [
  {
    value: "MCQ",
    label: "MCQ",
    description: "Multiple Choice",
    icon: RiListCheck2,
  },
  {
    value: "ShortAnswer",
    label: "Short Answer",
    description: "Written Response",
    icon: RiQuestionAnswerLine,
  },
  {
    value: "TrueFalse",
    label: "True / False",
    description: "Binary Choice",
    icon: RiCheckboxLine,
  },
  {
    value: "Mixed",
    label: "Mixed",
    description: "All Types",
    icon: RiShuffleLine,
  },
];

export default function QuestionTypeSelector({ value, onChange }) {
  return (
    <div>
      <p
        className="text-sm font-semibold mb-3"
        style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Question Type
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TYPES.map((type) => {
          const isSelected = value === type.value;
          const Icon = type.icon;

          return (
            <button
              key={type.value}
              onClick={() => onChange(type.value)}
              className="flex flex-col items-center gap-2 px-3 py-4 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                backgroundColor: isSelected ? "#2D3A8C" : "#ffffff",
                border: `2px solid ${isSelected ? "#2D3A8C" : "#E5E7EB"}`,
                boxShadow: isSelected
                  ? "0 4px 16px rgba(45,58,140,0.25)"
                  : "0 1px 4px rgba(0,0,0,0.05)",
                cursor: "pointer",
              }}
            >
              {/* Icon bubble */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: isSelected
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(45,58,140,0.07)",
                }}
              >
                <Icon
                  size={20}
                  style={{ color: isSelected ? "#ffffff" : "#2D3A8C" }}
                />
              </div>

              {/* Label */}
              <div className="text-center">
                <p
                  className="text-xs font-bold leading-tight"
                  style={{
                    color: isSelected ? "#ffffff" : "#1F2937",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {type.label}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    color: isSelected ? "rgba(255,255,255,0.65)" : "#9CA3AF",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}