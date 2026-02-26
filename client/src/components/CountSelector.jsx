const COUNTS = [5, 10, 15, 20];

export default function CountSelector({ value, onChange }) {
  return (
    <div>
      <p
        className="text-sm font-semibold mb-3"
        style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Number of Questions
      </p>

      <div className="flex gap-3">
        {COUNTS.map((count) => {
          const isSelected = value === count;

          return (
            <button
              key={count}
              onClick={() => onChange(count)}
              className="flex-1 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.05] active:scale-[0.97]"
              style={{
                backgroundColor: isSelected ? "#2D3A8C" : "#ffffff",
                color: isSelected ? "#ffffff" : "#4B5563",
                border: `2px solid ${isSelected ? "#2D3A8C" : "#E5E7EB"}`,
                boxShadow: isSelected
                  ? "0 4px 16px rgba(45,58,140,0.25)"
                  : "0 1px 4px rgba(0,0,0,0.05)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: "pointer",
              }}
            >
              {count}
            </button>
          );
        })}
      </div>

      <p
        className="text-xs mt-2"
        style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {value} question{value > 1 ? "s" : ""} will be generated from your document
      </p>
    </div>
  );
}