import { FiCheck } from "react-icons/fi";

export default function ProgressBar({ steps, currentStep }) {
  // currentStep: 0-indexed, e.g. 0 = first step active

  return (
    <div className="w-full">
      {/* Step indicators */}
      <div className="flex items-center justify-between relative">
        {/* Connector line behind steps */}
        <div
          className="absolute top-4 left-0 right-0 h-0.5 -z-0"
          style={{ backgroundColor: "#E5E7EB", margin: "0 1rem" }}
        >
          <div
            className="h-full transition-all duration-700 ease-in-out"
            style={{
              backgroundColor: "#2D3A8C",
              width: `${Math.min((currentStep / (steps.length - 1)) * 100, 100)}%`,
            }}
          />
        </div>

        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={step} className="flex flex-col items-center gap-2 z-10">
              {/* Circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: isDone
                    ? "#10B981"
                    : isActive
                    ? "#2D3A8C"
                    : "#ffffff",
                  border: `2px solid ${
                    isDone
                      ? "#10B981"
                      : isActive
                      ? "#2D3A8C"
                      : "#E5E7EB"
                  }`,
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(45,58,140,0.15)"
                    : isDone
                    ? "0 0 0 4px rgba(16,185,129,0.12)"
                    : "none",
                }}
              >
                {isDone ? (
                  <FiCheck size={14} color="#ffffff" strokeWidth={3} />
                ) : isActive ? (
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: "#ffffff" }}
                  />
                ) : (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#D1D5DB" }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className="text-xs font-medium text-center"
                style={{
                  color: isDone
                    ? "#10B981"
                    : isActive
                    ? "#2D3A8C"
                    : "#9CA3AF",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  maxWidth: "64px",
                  lineHeight: "1.3",
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}