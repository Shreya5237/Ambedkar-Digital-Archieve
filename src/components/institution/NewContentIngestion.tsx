import React, { useState } from "react";
import {
  Upload,
  FileText,
  FileCode,
  Image as ImageIcon,
  Music,
  Video,
  CheckCircle2,
  Clock,
  Sparkles,
  Database,
  ArrowRight,
  ShieldAlert,
  Layers,
  Network,
  Cpu,
  Trash2,
} from "lucide-react";
import type { FileType, ArchiveFile, ExtractedRelationship, UnifiedAttributes } from "@/types/institution";
import { PREDEFINED_EXTRACTION_MAP, FILE_SPECIFIC_EXTRACTION_MAP } from "@/data/institutionMockData";
import { useInstitution } from "@/context/InstitutionContext";

interface QueuedFileItem {
  id: string;
  filename: string;
  fileType: FileType;
  fileSize: string;
  rawFile?: File;
  stage: "idle" | "detecting" | "extracting" | "attributes" | "completed";
}

const FORMAT_ICONS: Record<FileType, React.ReactNode> = {
  PDF: <FileText className="w-5 h-5 text-red-500" />,
  DOCX: <FileCode className="w-5 h-5 text-blue-500" />,
  IMAGE: <ImageIcon className="w-5 h-5 text-emerald-500" />,
  AUDIO: <Music className="w-5 h-5 text-amber-500" />,
  VIDEO: <Video className="w-5 h-5 text-purple-500" />,
};

export default function NewContentIngestion({
  onNavigateToHistory,
  onNavigateToArchive,
}: {
  onNavigateToHistory: () => void;
  onNavigateToArchive: () => void;
}) {
  const { addBatchFiles } = useInstitution();

  // Selected files queue
  const [queuedFiles, setQueuedFiles] = useState<QueuedFileItem[]>([]);
  const [category, setCategory] = useState("Speech");
  const [sourceInstitution, setSourceInstitution] = useState("Dr. Ambedkar International Centre");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English", "Hindi"]);

  // Pipeline execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingCompleted, setProcessingCompleted] = useState(false);
  const [processedBatch, setProcessedBatch] = useState<ArchiveFile[]>([]);

  // Vector DB Indexing state
  const [isUpdatingVectorDb, setIsUpdatingVectorDb] = useState(false);
  const [vectorDbCompleted, setVectorDbCompleted] = useState(false);
  const [vectorStep, setVectorStep] = useState(0);

  // Helper to detect extension to format mapping
  const detectFileType = (name: string): FileType => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "PDF";
    if (ext === "docx" || ext === "doc") return "DOCX";
    if (["jpg", "jpeg", "png", "webp"].includes(ext || "")) return "IMAGE";
    if (["mp3", "wav", "aac", "ogg"].includes(ext || "")) return "AUDIO";
    if (["mp4", "mov", "mkv", "webm"].includes(ext || "")) return "VIDEO";
    return "PDF";
  };

  // 1-Click Load Sample Batch
  const handleLoadSampleBatch = () => {
    const samples: QueuedFileItem[] = [
      { id: `q-1`, filename: "ambedkar_speech_1946.pdf", fileType: "PDF", fileSize: "2.4 MB", stage: "idle" },
      { id: `q-2`, filename: "constitutional_debate.docx", fileType: "DOCX", fileSize: "1.1 MB", stage: "idle" },
      { id: `q-3`, filename: "ambedkar_photo_1930.jpg", fileType: "IMAGE", fileSize: "4.8 MB", stage: "idle" },
      { id: `q-4`, filename: "speech_recording_1956.mp3", fileType: "AUDIO", fileSize: "12.3 MB", stage: "idle" },
      { id: `q-5`, filename: "public_event_1956.mp4", fileType: "VIDEO", fileSize: "84.5 MB", stage: "idle" },
    ];
    setQueuedFiles(samples);
    setProcessingCompleted(false);
    setVectorDbCompleted(false);
  };

  // Handle local file uploads
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToList(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToList(Array.from(e.target.files));
    }
  };

  const addFilesToList = (files: File[]) => {
    const newItems: QueuedFileItem[] = files.map((f, i) => ({
      id: `q-${Date.now()}-${i}`,
      filename: f.name,
      fileType: detectFileType(f.name),
      fileSize: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      rawFile: f,
      stage: "idle",
    }));
    setQueuedFiles((prev) => [...prev, ...newItems]);
    setProcessingCompleted(false);
    setVectorDbCompleted(false);
  };

  const handleRemoveFile = (id: string) => {
    setQueuedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  // Trigger Simulated Ingestion Pipeline
  const handleStartProcessing = async () => {
    if (queuedFiles.length === 0) return;
    setIsProcessing(true);
    setProcessingCompleted(false);

    // Step-by-step state simulation per file
    for (let i = 0; i < queuedFiles.length; i++) {
      const fileId = queuedFiles[i].id;

      // Stage: Detecting
      setQueuedFiles((prev) =>
        prev.map((item) => (item.id === fileId ? { ...item, stage: "detecting" } : item))
      );
      await new Promise((r) => setTimeout(r, 600));

      // Stage: Extracting
      setQueuedFiles((prev) =>
        prev.map((item) => (item.id === fileId ? { ...item, stage: "extracting" } : item))
      );
      await new Promise((r) => setTimeout(r, 700));

      // Stage: Attributes
      setQueuedFiles((prev) =>
        prev.map((item) => (item.id === fileId ? { ...item, stage: "attributes" } : item))
      );
      await new Promise((r) => setTimeout(r, 600));

      // Stage: Completed
      setQueuedFiles((prev) =>
        prev.map((item) => (item.id === fileId ? { ...item, stage: "completed" } : item))
      );
    }

    // Build the processed ArchiveFile objects from predefined maps
    const newArchivalFiles: ArchiveFile[] = queuedFiles.map((qf, idx) => {
      const template = FILE_SPECIFIC_EXTRACTION_MAP[qf.filename] || PREDEFINED_EXTRACTION_MAP[qf.fileType];
      return {
        id: `NEW_FILE_${Date.now()}_${idx}`,
        filename: qf.filename,
        fileType: qf.fileType,
        fileSize: qf.fileSize,
        uploadDate: new Date().toISOString().split("T")[0],
        category,
        sourceInstitution,
        languages: selectedLanguages.length > 0 ? selectedLanguages : ["English"],
        processingStatus: "completed",
        vectorStatus: "not_updated",
        extractedContent: template.extractedContent,
        attributes: template.attributes,
        relationships: template.relationships,
      };
    });

    setProcessedBatch(newArchivalFiles);
    setIsProcessing(false);
    setProcessingCompleted(true);
  };

  // Consolidated Unified Attributes & Relationships across batch
  const consolidatedAttributes: UnifiedAttributes = processedBatch.reduce(
    (acc, item) => {
      acc.persons = Array.from(new Set([...acc.persons, ...item.attributes.persons]));
      acc.documents = Array.from(new Set([...acc.documents, ...item.attributes.documents]));
      acc.events = Array.from(new Set([...acc.events, ...item.attributes.events]));
      acc.places = Array.from(new Set([...acc.places, ...item.attributes.places]));
      acc.dates = Array.from(new Set([...acc.dates, ...item.attributes.dates]));
      acc.topics = Array.from(new Set([...acc.topics, ...item.attributes.topics]));
      acc.publications = Array.from(new Set([...acc.publications, ...item.attributes.publications]));
      return acc;
    },
    { persons: [], documents: [], events: [], places: [], dates: [], topics: [], publications: [] }
  );

  const consolidatedRelationships: ExtractedRelationship[] = processedBatch.reduce((acc, item) => {
    item.relationships.forEach((rel) => {
      if (!acc.some((r) => r.source === rel.source && r.relation === rel.relation && r.target === rel.target)) {
        acc.push(rel);
      }
    });
    return acc;
  }, [] as ExtractedRelationship[]);

  // Simulated Vector Database Update Action
  const handleUpdateVectorDatabase = async () => {
    setIsUpdatingVectorDb(true);
    setVectorStep(1); // Preparing
    await new Promise((r) => setTimeout(r, 700));

    setVectorStep(2); // Generating Embeddings
    await new Promise((r) => setTimeout(r, 900));

    setVectorStep(3); // Indexing documents
    await new Promise((r) => setTimeout(r, 800));

    setVectorStep(4); // Updating vector db
    await new Promise((r) => setTimeout(r, 900));

    setVectorStep(5); // Synchronized

    // Commit files with vectorStatus = "updated" to context
    const updatedFiles = processedBatch.map((f) => ({ ...f, vectorStatus: "updated" as const }));
    addBatchFiles(updatedFiles);

    setIsUpdatingVectorDb(false);
    setVectorDbCompleted(true);
  };

  return (
    <div className="space-y-10">
      {/* Step Header */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-md p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] mb-2">
              <Cpu className="w-3 h-3" />
              IN-BROWSER INGESTION PIPELINE
            </div>
            <h2 className="text-2xl font-display font-bold">Upload & Processing Pipeline</h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Upload multi-format archival files (PDF, DOCX, Image, Audio, Video) for automated content extraction, attribute mapping, and vector database indexing.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSampleBatch}
            className="px-4 py-2.5 rounded border border-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-all text-xs font-mono font-semibold flex items-center justify-center gap-2 group shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[var(--primary)] group-hover:text-[var(--primary-foreground)]" />
            <span>⚡ Load Sample Archival Batch (5 Formats)</span>
          </button>
        </div>
      </div>

      {/* 1. UPLOAD SECTION */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-md p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-display font-semibold flex items-center gap-2 border-b border-[var(--border)] pb-3">
          <Upload className="w-5 h-5 text-[var(--primary)]" />
          <span>1. Upload Archival Files</span>
        </h3>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--background)]/60 rounded-md p-8 text-center transition-colors relative cursor-pointer group"
        >
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.webp,.mp3,.wav,.mp4,.mov"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="w-12 h-12 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
          </div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Drag & drop files here, or <span className="text-[var(--primary)] underline">Browse Files</span>
          </p>
          <div className="flex items-center justify-center gap-3 mt-3 font-mono text-[11px] text-[var(--muted-foreground)]">
            <span className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">📄 PDF</span>
            <span className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">📝 DOCX</span>
            <span className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">🖼 IMAGE</span>
            <span className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">🎵 AUDIO</span>
            <span className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">🎥 VIDEO</span>
          </div>
        </div>

        {/* Queued Files List */}
        {queuedFiles.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
              <span>Selected Files Queue ({queuedFiles.length})</span>
              <button
                type="button"
                onClick={() => setQueuedFiles([])}
                className="text-red-500 hover:underline cursor-pointer"
              >
                Clear Queue
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {queuedFiles.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded border border-[var(--border)] bg-[var(--background)] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded bg-[var(--card)] border border-[var(--border)]">
                      {FORMAT_ICONS[item.fileType]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-[var(--foreground)]">
                        {item.filename}
                      </div>
                      <div className="text-[10px] font-mono text-[var(--muted-foreground)] flex items-center gap-2 mt-0.5">
                        <span className="px-1 rounded bg-[var(--muted)] font-bold text-[var(--primary)]">
                          {item.fileType}
                        </span>
                        <span>{item.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  {!isProcessing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(item.id)}
                      className="p-1 rounded text-[var(--muted-foreground)] hover:text-red-500 hover:bg-[var(--muted)] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. METADATA FORM & PROCESSING TRIGGER */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-md p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-display font-semibold flex items-center gap-2 border-b border-[var(--border)] pb-3">
          <Layers className="w-5 h-5 text-[var(--primary)]" />
          <span>2. Archival Metadata Classification</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="Speech">Speech</option>
              <option value="Writing">Writing</option>
              <option value="Constitutional Debate">Constitutional Debate</option>
              <option value="Photograph">Photograph</option>
              <option value="Event">Event</option>
              <option value="Manuscript">Manuscript</option>
              <option value="Publication">Publication</option>
              <option value="Biography">Biography</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Source Institution */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
              Source Institution
            </label>
            <select
              value={sourceInstitution}
              onChange={(e) => setSourceInstitution(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="Dr. Ambedkar International Centre">Dr. Ambedkar International Centre</option>
              <option value="Parliamentary Archives">Parliamentary Archives</option>
              <option value="University Archive">University Archive</option>
              <option value="National Archives">National Archives</option>
              <option value="Private Collection">Private Collection</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Languages Multi-select */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
              Languages
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {["English", "Hindi", "Marathi", "Tamil", "Bengali", "Telugu"].map((lang) => {
                const active = selectedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                      active
                        ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)] font-semibold"
                        : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {active ? "✓ " : ""}{lang}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Start Processing Action */}
        <div className="pt-2 border-t border-[var(--border)]">
          <button
            type="button"
            disabled={queuedFiles.length === 0 || isProcessing}
            onClick={handleStartProcessing}
            className="w-full py-3.5 px-6 rounded text-sm font-semibold uppercase tracking-wider text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-[var(--primary-foreground)] border-t-transparent rounded-full animate-spin" />
                <span>Processing Multi-Format Archival Files ({queuedFiles.length})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>[ START PROCESSING ]</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. SIMULATED PROCESSING PIPELINE PROGRESS */}
      {(isProcessing || processingCompleted) && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-md p-6 shadow-xs space-y-4 animate-modal-in">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="text-lg font-display font-semibold flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[var(--primary)] animate-pulse" />
              <span>3. Mock Processing Pipeline Execution</span>
            </h3>
            <span className="text-xs font-mono text-[var(--muted-foreground)]">
              {queuedFiles.filter((f) => f.stage === "completed").length} / {queuedFiles.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {queuedFiles.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded border border-[var(--border)] bg-[var(--background)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    {FORMAT_ICONS[item.fileType]}
                    <span>{item.filename}</span>
                  </div>

                  {item.stage === "completed" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Ready
                    </span>
                  ) : item.stage === "idle" ? (
                    <span className="text-xs font-mono text-[var(--muted-foreground)]">Queued</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--primary)] animate-pulse font-bold">
                      <Clock className="w-4 h-4" />
                      Processing...
                    </span>
                  )}
                </div>

                {/* Micro Steps */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div className={`p-1.5 rounded border ${item.stage !== "idle" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" : "bg-[var(--muted)]/50 border-[var(--border)] text-[var(--muted-foreground)]"}`}>
                    ✓ File detected
                  </div>
                  <div className={`p-1.5 rounded border ${["extracting", "attributes", "completed"].includes(item.stage) ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" : item.stage === "detecting" ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)] animate-pulse" : "bg-[var(--muted)]/50 border-[var(--border)] text-[var(--muted-foreground)]"}`}>
                    {item.fileType} Identified
                  </div>
                  <div className={`p-1.5 rounded border ${["attributes", "completed"].includes(item.stage) ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" : item.stage === "extracting" ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)] animate-pulse" : "bg-[var(--muted)]/50 border-[var(--border)] text-[var(--muted-foreground)]"}`}>
                    Content Extracted
                  </div>
                  <div className={`p-1.5 rounded border ${item.stage === "completed" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" : item.stage === "attributes" ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)] animate-pulse" : "bg-[var(--muted)]/50 border-[var(--border)] text-[var(--muted-foreground)]"}`}>
                    Attributes Mapped
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EXTRACTED CONTENT CARDS */}
      {processingCompleted && processedBatch.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-md p-6 shadow-xs space-y-6 animate-modal-in">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="text-lg font-display font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--primary)]" />
              <span>4. Extracted Content by Format</span>
            </h3>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {processedBatch.length} Files Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processedBatch.map((file) => (
              <div key={file.id} className="p-5 rounded border border-[var(--border)] bg-[var(--background)] space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    {FORMAT_ICONS[file.fileType]}
                    <span className="truncate max-w-[220px]">{file.filename}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--primary)] text-[var(--primary-foreground)]">
                    {file.fileType} DETECTED ✓
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-sm text-[var(--foreground)] mb-1">
                    {file.extractedContent.title}
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed italic">
                    "{file.extractedContent.summary}"
                  </p>
                </div>

                {/* Format Specific Detailed Output */}
                <div className="pt-2 border-t border-[var(--border)] text-xs space-y-2">
                  {file.extractedContent.text && (
                    <div className="space-y-2">
                      <div>
                        <div className="font-mono text-[10px] uppercase text-[var(--muted-foreground)] font-bold mb-1">
                          {file.fileType === "AUDIO" || file.fileType === "VIDEO" ? "Extracted Transcript" : "Extracted Text"}
                        </div>
                        <div className="p-2.5 rounded bg-[var(--card)] font-mono text-[11px] leading-relaxed text-[var(--foreground)] border border-[var(--border)] max-h-24 overflow-y-auto">
                          {file.extractedContent.text}
                        </div>
                      </div>
                      {file.extractedContent.translatedText && (
                        <div>
                          <div className="font-mono text-[10px] uppercase text-[var(--muted-foreground)] font-bold mb-1 text-emerald-600 dark:text-emerald-400">
                            English Translation
                          </div>
                          <div className="p-2.5 rounded bg-emerald-500/5 font-mono text-[11px] leading-relaxed text-[var(--foreground)] border border-emerald-500/30 max-h-24 overflow-y-auto">
                            {file.extractedContent.translatedText}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {file.extractedContent.visualInfo && (
                    <div>
                      <div className="font-mono text-[10px] uppercase text-[var(--muted-foreground)] font-bold mb-1">
                        Visual Scene Analysis
                      </div>
                      <div className="p-2 rounded bg-[var(--muted)]/40 text-[11px] text-[var(--foreground)]">
                        {file.extractedContent.visualInfo}
                      </div>
                    </div>
                  )}

                  {file.extractedContent.audioInfo && (
                    <div>
                      <div className="font-mono text-[10px] uppercase text-[var(--muted-foreground)] font-bold mb-1">
                        Acoustic Analysis
                      </div>
                      <div className="p-2 rounded bg-[var(--muted)]/40 text-[11px] text-[var(--foreground)]">
                        {file.extractedContent.audioInfo}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. UNIFIED ATTRIBUTE EXTRACTION SECTION (CRITICAL REQUIREMENT) */}
      {processingCompleted && (
        <div className="bg-[var(--card)] border-2 border-[var(--primary)]/60 rounded-md p-6 shadow-md space-y-6 animate-modal-in">
          <div className="border-b border-[var(--border)] pb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[var(--primary)] text-[var(--primary-foreground)] mb-2">
              <Layers className="w-3.5 h-3.5" />
              UNIFIED METADATA SCHEMA
            </div>
            <h3 className="text-xl font-display font-bold">UNIFIED ATTRIBUTE EXTRACTION</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Information extracted from heterogeneous formats (PDF, DOCX, Image, Audio, Video) is mapped into a standardized archival entity structure.
            </p>
          </div>

          {/* Unified Schema Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Person */}
            <div className="p-4 rounded border border-[var(--border)] bg-[var(--background)]">
              <div className="font-mono text-xs uppercase font-bold text-[var(--primary)] mb-2 flex items-center justify-between">
                <span>PERSON</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">{consolidatedAttributes.persons.length} entities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {consolidatedAttributes.persons.map((p, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-[var(--primary)]/10 text-[var(--primary)] font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Document */}
            <div className="p-4 rounded border border-[var(--border)] bg-[var(--background)]">
              <div className="font-mono text-xs uppercase font-bold text-[var(--primary)] mb-2 flex items-center justify-between">
                <span>DOCUMENT</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">{consolidatedAttributes.documents.length} entities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {consolidatedAttributes.documents.map((d, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Event */}
            <div className="p-4 rounded border border-[var(--border)] bg-[var(--background)]">
              <div className="font-mono text-xs uppercase font-bold text-[var(--primary)] mb-2 flex items-center justify-between">
                <span>EVENT</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">{consolidatedAttributes.events.length} entities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {consolidatedAttributes.events.map((e, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]">
                    {e}
                  </span>
                ))}
              </div>
            </div>

            {/* Place */}
            <div className="p-4 rounded border border-[var(--border)] bg-[var(--background)]">
              <div className="font-mono text-xs uppercase font-bold text-[var(--primary)] mb-2 flex items-center justify-between">
                <span>PLACE</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">{consolidatedAttributes.places.length} entities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {consolidatedAttributes.places.map((pl, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]">
                    {pl}
                  </span>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="p-4 rounded border border-[var(--border)] bg-[var(--background)]">
              <div className="font-mono text-xs uppercase font-bold text-[var(--primary)] mb-2 flex items-center justify-between">
                <span>DATE</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">{consolidatedAttributes.dates.length} entities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {consolidatedAttributes.dates.map((dt, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] font-mono">
                    {dt}
                  </span>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div className="p-4 rounded border border-[var(--border)] bg-[var(--background)]">
              <div className="font-mono text-xs uppercase font-bold text-[var(--primary)] mb-2 flex items-center justify-between">
                <span>TOPIC</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">{consolidatedAttributes.topics.length} entities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {consolidatedAttributes.topics.map((tp, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-[var(--primary)]/10 text-[var(--primary)] font-medium">
                    {tp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. EXTRACTED RELATIONSHIPS (KNOWLEDGE GRAPH READY) */}
      {processingCompleted && consolidatedRelationships.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-md p-6 shadow-xs space-y-4 animate-modal-in">
          <h3 className="text-lg font-display font-semibold flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <Network className="w-5 h-5 text-[var(--primary)]" />
            <span>5. Extracted Entity Relationships (Knowledge Graph Ready)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {consolidatedRelationships.map((rel, i) => (
              <div
                key={i}
                className="p-3 rounded border border-[var(--border)] bg-[var(--background)] flex items-center justify-between text-xs font-mono"
              >
                <span className="font-bold text-[var(--foreground)]">{rel.source}</span>
                <span className="px-2 py-0.5 rounded bg-[var(--primary)]/15 text-[var(--primary)] font-semibold">
                  ── {rel.relation} ──►
                </span>
                <span className="font-bold text-[var(--foreground)]">{rel.target}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. VECTOR DATABASE INDEXING SECTION */}
      {processingCompleted && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-md p-6 shadow-md space-y-6 animate-modal-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div>
              <div className="text-xs font-mono text-[var(--primary)] font-semibold uppercase">Ingestion Flow Complete</div>
              <h3 className="text-xl font-display font-bold mt-0.5">ARCHIVAL CONTENT READY</h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                {processedBatch.length} files processed • {consolidatedAttributes.persons.length + consolidatedAttributes.topics.length + consolidatedAttributes.events.length} attributes extracted • {consolidatedRelationships.length} relationships identified
              </p>
            </div>

            {!vectorDbCompleted && (
              <button
                type="button"
                disabled={isUpdatingVectorDb}
                onClick={handleUpdateVectorDatabase}
                className="py-3 px-6 rounded text-sm font-semibold uppercase tracking-wider text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isUpdatingVectorDb ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[var(--primary-foreground)] border-t-transparent rounded-full animate-spin" />
                    <span>Indexing Vector Database...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>[ UPDATE VECTOR DATABASE ]</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Simulated Vector DB Update Progress Modal / Animation */}
          {isUpdatingVectorDb && (
            <div className="p-5 rounded border border-[var(--primary)]/50 bg-[var(--primary)]/5 space-y-3 font-mono text-xs animate-pulse">
              <div className="font-bold text-[var(--primary)] flex items-center gap-2">
                <Database className="w-4 h-4 animate-spin" />
                <span>UPDATING KNOWLEDGE BASE & VECTOR DATABASE</span>
              </div>
              <div className="space-y-1.5 text-[var(--foreground)]">
                <div className={vectorStep >= 1 ? "text-emerald-600 dark:text-emerald-400" : "opacity-40"}>
                  {vectorStep >= 1 ? "✓" : "○"} Preparing extracted content chunks...
                </div>
                <div className={vectorStep >= 2 ? "text-emerald-600 dark:text-emerald-400" : "opacity-40"}>
                  {vectorStep >= 2 ? "✓" : "○"} Generating dense embeddings (32 chunks generated)...
                </div>
                <div className={vectorStep >= 3 ? "text-emerald-600 dark:text-emerald-400" : "opacity-40"}>
                  {vectorStep >= 3 ? "✓" : "○"} Indexing documents into FAISS / Vector Index...
                </div>
                <div className={vectorStep >= 4 ? "text-emerald-600 dark:text-emerald-400" : "opacity-40"}>
                  {vectorStep >= 4 ? "✓" : "○"} Updating vector database and graph metadata...
                </div>
                <div className={vectorStep >= 5 ? "text-emerald-600 dark:text-emerald-400" : "opacity-40"}>
                  {vectorStep >= 5 ? "✓" : "○"} Synchronizing archive catalog...
                </div>
              </div>
            </div>
          )}

          {/* Vector DB Updated Completion Banner */}
          {vectorDbCompleted && (
            <div className="p-6 rounded border border-emerald-500/40 bg-emerald-500/10 text-center space-y-4 animate-modal-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-display font-bold text-emerald-700 dark:text-emerald-300">
                  VECTOR DATABASE UPDATED ✓
                </h4>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-md mx-auto">
                  {processedBatch.length} archival sources have been successfully indexed and added to the searchable RAG knowledge base.
                </p>
              </div>

              {/* Stats pill counter */}
              <div className="inline-flex flex-wrap items-center justify-center gap-3 py-2 px-4 rounded bg-[var(--card)] border border-[var(--border)] font-mono text-xs">
                <span>Documents Indexed: <strong>{processedBatch.length}</strong></span>
                <span>•</span>
                <span>Chunks Generated: <strong>32</strong></span>
                <span>•</span>
                <span>Embeddings Stored: <strong>32</strong></span>
                <span>•</span>
                <span>Entities Indexed: <strong>{consolidatedAttributes.persons.length + consolidatedAttributes.topics.length}</strong></span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onNavigateToHistory}
                  className="w-full sm:w-auto px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <span>VIEW UPLOAD HISTORY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onNavigateToArchive}
                  className="w-full sm:w-auto px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition-colors flex items-center justify-center gap-2"
                >
                  <span>BROWSE INSTITUTION ARCHIVE</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
