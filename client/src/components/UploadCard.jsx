import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUploadCloud, FiFile, FiX, FiCheckCircle } from "react-icons/fi";
import { uploadPDF } from "../services/api";
import { useSession } from "../context/SessionContext";
import ProgressBar from "./ProgressBar";

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function UploadCard() {
  const navigate = useNavigate();
  const { startSession, setIsUploading, setUploadProgress, uploadProgress, isUploading } = useSession();

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStep, setUploadStep] = useState(0);
  // 0 = idle, 1 = uploading, 2 = extracting, 3 = indexing, 4 = done
  const fileInputRef = useRef(null);

  const steps = ["Uploading", "Extracting Text", "Building Index", "Ready"];

  const validateFile = (file) => {
    if (!file) return "No file selected.";
    if (!file.name.toLowerCase().endsWith(".pdf")) return "Only PDF files are supported.";
    if (file.size > MAX_SIZE_BYTES) return `File too large. Max size is ${MAX_SIZE_MB}MB.`;
    return null;
  };

  const handleFile = useCallback((file) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleInputChange = (e) => handleFile(e.target.files[0]);
  const handleRemoveFile = () => { setSelectedFile(null); setUploadStep(0); };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStep(1);
    setUploadProgress(0);

    try {
      // Step 1: Upload
      const toastId = toast.loading("Uploading PDF...");
      const data = await uploadPDF(selectedFile, (progressEvent) => {
        const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setUploadProgress(pct);
      });

      // Step 2: Extracting (simulated visual step)
      setUploadStep(2);
      toast.loading("Extracting text...", { id: toastId });
      await new Promise((r) => setTimeout(r, 800));

      // Step 3: Building Index
      setUploadStep(3);
      toast.loading("Building vector index...", { id: toastId });
      await new Promise((r) => setTimeout(r, 600));

      // Step 4: Done
      setUploadStep(4);
      toast.success(
        `✅ Ready! ${data.pageCount} pages · ${data.chunkCount} chunks indexed`,
        { id: toastId, duration: 4000 }
      );

      startSession({
        sessionId: data.sessionId,
        fileName: data.fileName,
        pageCount: data.pageCount,
        chunkCount: data.chunkCount,
        vectorStoreReady: data.vectorStoreReady,
      });

      setTimeout(() => navigate("/generate"), 1200);

    } catch (err) {
      toast.error(err.message || "Upload failed. Please try again.");
      setUploadStep(0);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className="relative rounded-2xl transition-all duration-300 cursor-pointer"
        style={{
          border: `2px dashed ${dragOver ? "#F59E0B" : selectedFile ? "#10B981" : "#CBD5E1"}`,
          backgroundColor: dragOver
            ? "rgba(245,158,11,0.05)"
            : selectedFile
            ? "rgba(16,185,129,0.04)"
            : "#ffffff",
          padding: "2.5rem 2rem",
          boxShadow: dragOver
            ? "0 0 0 4px rgba(245,158,11,0.15)"
            : "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
        />

        {!selectedFile ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: dragOver ? "rgba(245,158,11,0.12)" : "rgba(45,58,140,0.08)" }}
            >
              <FiUploadCloud
                size={30}
                style={{ color: dragOver ? "#F59E0B" : "#2D3A8C" }}
                className="transition-colors duration-200"
              />
            </div>
            <div>
              <p className="font-semibold text-base" style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {dragOver ? "Drop your PDF here" : "Drag & drop your PDF"}
              </p>
              <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                or <span style={{ color: "#2D3A8C", fontWeight: 600 }}>browse files</span> · Max {MAX_SIZE_MB}MB
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: "rgba(45,58,140,0.08)", color: "#2D3A8C" }}>
                PDF only
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: "rgba(16,185,129,0.08)", color: "#10B981" }}>
                Textbooks
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: "rgba(245,158,11,0.08)", color: "#F59E0B" }}>
                Notes
              </span>
            </div>
          </div>
        ) : (
          /* File selected state */
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(16,185,129,0.1)" }}>
              {uploadStep === 4
                ? <FiCheckCircle size={22} style={{ color: "#10B981" }} />
                : <FiFile size={22} style={{ color: "#10B981" }} />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {selectedFile.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!isUploading && uploadStep !== 4 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FiX size={16} style={{ color: "#EF4444" }} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Steps */}
      {isUploading && uploadStep > 0 && uploadStep < 4 && (
        <div className="mt-4">
          <ProgressBar steps={steps} currentStep={uploadStep - 1} />
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && uploadStep === 0 && (
        <button
          onClick={handleUpload}
          className="mt-4 w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: "#2D3A8C",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.95rem",
            boxShadow: "0 4px 16px rgba(45,58,140,0.35)",
          }}
        >
          Upload & Process PDF
        </button>
      )}

      {/* Success CTA */}
      {uploadStep === 4 && (
        <button
          onClick={() => navigate("/generate")}
          className="mt-4 w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
          style={{
            backgroundColor: "#10B981",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.95rem",
            boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
          }}
        >
          Generate Questions →
        </button>
      )}
    </div>
  );
}