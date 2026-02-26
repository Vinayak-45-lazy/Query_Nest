import { useState } from "react";
import { FiDownload, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";

export default function DownloadButton({ questionSet, fileName }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!questionSet || !questionSet.questions?.length) {
      toast.error("No questions to download.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Generating PDF...");

    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const checkPageBreak = (needed = 10) => {
        if (y + needed > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // ── Header ──────────────────────────────
      doc.setFillColor(45, 58, 140);
      doc.rect(0, 0, pageWidth, 28, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("QueryNest", margin, 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(180, 190, 220);
      doc.text("AI Question Generator", margin, 19);

      // Metadata top-right
      doc.setFontSize(8);
      doc.setTextColor(180, 190, 220);
      const meta = `${questionSet.questionType} · ${questionSet.difficulty} · ${questionSet.questions.length}Q`;
      doc.text(meta, pageWidth - margin, 12, { align: "right" });
      doc.text(new Date().toLocaleDateString(), pageWidth - margin, 19, { align: "right" });

      y = 38;

      // ── Document title ───────────────────────
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(31, 41, 55);
      const title = fileName ? `Source: ${fileName}` : "Question Set";
      doc.text(title, margin, y);
      y += 6;

      if (questionSet.topic) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128);
        doc.text(`Topic: ${questionSet.topic}`, margin, y);
        y += 5;
      }

      // Divider
      y += 3;
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // ── Questions ────────────────────────────
      questionSet.questions.forEach((q, idx) => {
        checkPageBreak(30);

        // Question number pill background
        doc.setFillColor(45, 58, 140);
        doc.roundedRect(margin, y - 4, 7, 7, 1, 1, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(String(idx + 1), margin + 3.5, y + 1, { align: "center" });

        // Question text
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(31, 41, 55);
        const qLines = doc.splitTextToSize(`  ${q.questionText}`, contentWidth - 10);
        doc.text(qLines, margin + 10, y);
        y += qLines.length * 5 + 3;

        // MCQ Options
        if (q.options && q.options.length > 0) {
          q.options.forEach((opt) => {
            checkPageBreak(7);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(75, 85, 99);
            const optLines = doc.splitTextToSize(opt, contentWidth - 16);
            doc.text(optLines, margin + 14, y);
            y += optLines.length * 5 + 1;
          });
          y += 2;
        }

        // Answer box
        checkPageBreak(14);
        doc.setFillColor(236, 253, 245);
        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(5, 150, 105);
        doc.text("Answer:", margin + 3, y + 5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(31, 41, 55);
        const ansLines = doc.splitTextToSize(q.correctAnswer, contentWidth - 24);
        doc.text(ansLines, margin + 20, y + 5);
        y += 14 + (ansLines.length - 1) * 4;

        // Explanation
        if (q.explanation) {
          checkPageBreak(10);
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8);
          doc.setTextColor(156, 163, 175);
          const expLines = doc.splitTextToSize(`💡 ${q.explanation}`, contentWidth - 8);
          doc.text(expLines, margin + 4, y);
          y += expLines.length * 4.5 + 2;
        }

        // Separator
        checkPageBreak(6);
        y += 3;
        doc.setDrawColor(243, 244, 246);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
      });

      // ── Footer on each page ──────────────────
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `QueryNest — AI Question Generator · Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 8,
          { align: "center" }
        );
      }

      // ── Save ────────────────────────────────
      const safeName = (fileName || "questions").replace(/\.pdf$/i, "").replace(/\s+/g, "_");
      doc.save(`QueryNest_${safeName}_${questionSet.difficulty}_${questionSet.questionType}.pdf`);

      toast.success("PDF downloaded!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        backgroundColor: "#F59E0B",
        color: "#ffffff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxShadow: "0 4px 14px rgba(245,158,11,0.4)",
      }}
    >
      {loading ? (
        <FiLoader size={16} className="animate-spin" />
      ) : (
        <FiDownload size={16} />
      )}
      {loading ? "Generating…" : "Download PDF"}
    </button>
  );
}