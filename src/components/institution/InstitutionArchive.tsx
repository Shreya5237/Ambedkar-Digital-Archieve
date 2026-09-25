import React, { useState } from "react";
import {
  FileText,
  FileCode,
  Image as ImageIcon,
  Music,
  Video,
  CheckCircle2,
  AlertTriangle,
  Search,
  Layers,
  Network,
  Database,
  X,
  Archive,
  ArrowUpRight,
} from "lucide-react";
import type { FileType, ArchiveFile } from "@/types/institution";
import { useInstitution } from "@/context/InstitutionContext";
import TranscriptAudioPlayer from "@/components/media/TranscriptAudioPlayer";

const FORMAT_ICONS: Record<FileType, React.ReactNode> = {
  PDF: <FileText className="w-5 h-5 text-red-500" />,
  DOCX: <FileCode className="w-5 h-5 text-blue-500" />,
  IMAGE: <ImageIcon className="w-5 h-5 text-emerald-500" />,
  AUDIO: <Music className="w-5 h-5 text-amber-500" />,
  VIDEO: <Video className="w-5 h-5 text-purple-500" />,
};

export default function InstitutionArchive() {
  const { files } = useInstitution();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string>("ALL");
  const [selectedFile, setSelectedFile] = useState<ArchiveFile | null>(null);

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.extractedContent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.attributes.persons.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      file.attributes.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFormat === "ALL") return matchesSearch;
    return matchesSearch && file.fileType === selectedFormat;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-md p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Archive className="w-5 h-5 text-[var(--primary)]" />
              <span>Institutional Digital Archive Catalog</span>
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Browse processed multi-format institutional holdings with extracted transcripts, unified attribute tags, and vector index verification.
            </p>
          </div>
          <div className="font-mono text-xs text-[var(--muted-foreground)]">
            Total Holdings: <strong>{files.length}</strong> items
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archive by title, person, event, or topic..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {["ALL", "PDF", "DOCX", "IMAGE", "AUDIO", "VIDEO"].map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                  selectedFormat === fmt
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-bold"
                    : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Archival Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFiles.length === 0 ? (
          <div className="col-span-full p-12 text-center border border-dashed border-[var(--border)] rounded bg-[var(--card)] text-[var(--muted-foreground)] font-mono text-xs">
            No institutional archive items match your search.
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className="p-5 rounded border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/60 transition-all flex flex-col justify-between shadow-xs group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded bg-[var(--background)] border border-[var(--border)]">
                    {FORMAT_ICONS[file.fileType]}
                  </div>
                  {file.vectorStatus === "updated" ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      ✓ Indexed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" />
                      ⚠ Vector Pending
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display font-semibold text-base text-[var(--foreground)] line-clamp-2 leading-snug">
                    {file.extractedContent.title}
                  </h3>
                  <div className="font-mono text-[11px] text-[var(--primary)] mt-1">{file.filename}</div>
                </div>

                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-3">
                  {file.extractedContent.summary}
                </p>

                {/* Key Attributes Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {file.attributes.persons.slice(0, 2).map((p, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] font-medium">
                      {p}
                    </span>
                  ))}
                  {file.attributes.topics.slice(0, 2).map((t, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-[var(--muted-foreground)]">{file.category}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(file)}
                  className="font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>[ View Details ]</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ARCHIVE ITEM DETAIL MODAL */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-md shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-modal-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--border)] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1 rounded bg-[var(--background)] border border-[var(--border)]">
                    {FORMAT_ICONS[selectedFile.fileType]}
                  </span>
                  <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-[var(--primary)] text-[var(--primary-foreground)] font-bold">
                    {selectedFile.fileType} ARCHIVE ITEM
                  </span>
                  {selectedFile.vectorStatus === "updated" ? (
                    <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Vector Database Indexed
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Vector DB Pending
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-display font-bold">{selectedFile.extractedContent.title}</h3>
                <div className="font-mono text-xs text-[var(--muted-foreground)] mt-0.5">
                  {selectedFile.filename} • {selectedFile.fileSize} • Uploaded {selectedFile.uploadDate}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="p-1.5 rounded hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original File Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono bg-[var(--background)] p-3 rounded border border-[var(--border)]">
              <div>
                <div className="text-[var(--muted-foreground)] uppercase text-[10px]">Category</div>
                <div className="font-semibold text-[var(--foreground)] mt-0.5">{selectedFile.category}</div>
              </div>
              <div>
                <div className="text-[var(--muted-foreground)] uppercase text-[10px]">Source Institution</div>
                <div className="font-semibold text-[var(--foreground)] mt-0.5">{selectedFile.sourceInstitution}</div>
              </div>
              <div>
                <div className="text-[var(--muted-foreground)] uppercase text-[10px]">Languages</div>
                <div className="font-semibold text-[var(--foreground)] mt-0.5">{selectedFile.languages.join(", ")}</div>
              </div>
            </div>

            {/* Extracted Content & Audiobook Player */}
            <div className="space-y-3">
              <h4 className="font-display font-semibold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--primary)]" />
                <span>Extracted Content & Audio Transcript</span>
              </h4>
              <TranscriptAudioPlayer
                text={selectedFile.extractedContent.text}
                title={selectedFile.extractedContent.title}
                language={selectedFile.languages[0] || "en"}
                pageNumber={1}
                totalPages={1}
              />
              <div className="p-4 rounded bg-[var(--background)] border border-[var(--border)] text-xs leading-relaxed space-y-3 font-mono">
                <p>"{selectedFile.extractedContent.text}"</p>
                {selectedFile.extractedContent.visualInfo && (
                  <div className="pt-2 border-t border-[var(--border)] text-[var(--muted-foreground)]">
                    <strong>Visual Scene Analysis:</strong> {selectedFile.extractedContent.visualInfo}
                  </div>
                )}
                {selectedFile.extractedContent.audioInfo && (
                  <div className="pt-2 border-t border-[var(--border)] text-[var(--muted-foreground)]">
                    <strong>Acoustic Analysis:</strong> {selectedFile.extractedContent.audioInfo}
                  </div>
                )}
              </div>
            </div>

            {/* Unified Attributes Extraction Table */}
            <div className="space-y-3">
              <h4 className="font-display font-semibold text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--primary)]" />
                <span>UNIFIED ATTRIBUTES (COMMON ARCHIVAL SCHEMA)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-[var(--background)] border border-[var(--border)]">
                  <div className="font-mono text-[10px] uppercase font-bold text-[var(--primary)] mb-1">PERSON</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedFile.attributes.persons.map((p, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[var(--primary)]/15 text-[var(--primary)] font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-[var(--background)] border border-[var(--border)]">
                  <div className="font-mono text-[10px] uppercase font-bold text-[var(--primary)] mb-1">DOCUMENT</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedFile.attributes.documents.map((d, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-[var(--background)] border border-[var(--border)]">
                  <div className="font-mono text-[10px] uppercase font-bold text-[var(--primary)] mb-1">EVENT</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedFile.attributes.events.map((e, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-[var(--background)] border border-[var(--border)]">
                  <div className="font-mono text-[10px] uppercase font-bold text-[var(--primary)] mb-1">PLACE & DATE</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedFile.attributes.places.map((pl, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">
                        📍 {pl}
                      </span>
                    ))}
                    {selectedFile.attributes.dates.map((dt, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">
                        🗓 {dt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-full p-3 rounded bg-[var(--background)] border border-[var(--border)]">
                  <div className="font-mono text-[10px] uppercase font-bold text-[var(--primary)] mb-1">TOPICS</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedFile.attributes.topics.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Relationships */}
            <div className="space-y-2">
              <h4 className="font-display font-semibold text-sm flex items-center gap-2">
                <Network className="w-4 h-4 text-[var(--primary)]" />
                <span>Extracted Relationships</span>
              </h4>
              <div className="space-y-1.5">
                {selectedFile.relationships.map((rel, i) => (
                  <div key={i} className="p-2 rounded bg-[var(--background)] border border-[var(--border)] text-xs font-mono flex items-center justify-between">
                    <span>{rel.source}</span>
                    <span className="text-[var(--primary)] font-bold">── {rel.relation} ──►</span>
                    <span>{rel.target}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vector DB Verification Footer */}
            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)]">
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[var(--primary)]" />
                <span>VECTOR DATABASE INDEX STATUS:</span>
                {selectedFile.vectorStatus === "updated" ? (
                  <strong className="text-emerald-600 dark:text-emerald-400">✓ FAISS RAG Ready</strong>
                ) : (
                  <strong className="text-amber-600 dark:text-amber-400">⚠ Pending Synchronization</strong>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="px-4 py-1.5 rounded bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
