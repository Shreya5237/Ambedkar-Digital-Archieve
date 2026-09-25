import { useState } from "react";
import { Copy, Check, Download, X, GraduationCap, FileCode, BookMarked } from "lucide-react";
import type { AcademicCitationSet } from "@/types/archive";
import { downloadFile } from "@/services/researchService";

interface AcademicCitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  citations: AcademicCitationSet;
}

export default function AcademicCitationModal({
  isOpen,
  onClose,
  title,
  citations,
}: AcademicCitationModalProps) {
  const [activeTab, setActiveTab] = useState<"apa" | "chicago" | "mla" | "bibtex">("apa");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentContent = citations[activeTab] || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy citation:", e);
    }
  };

  const handleDownloadBib = () => {
    downloadFile(
      `${title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 25)}_citation.bib`,
      citations.bibtex,
      "application/x-bibtex;charset=utf-8"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-[var(--foreground)]">
                Academic Citation Generator
              </h3>
              <p className="text-[11px] text-[var(--muted-foreground)] truncate max-w-sm">
                {title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded hover:bg-[var(--muted)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Tabs */}
        <div className="flex border-b border-[var(--border)] bg-[var(--background)]/50 px-4 pt-2 gap-2 text-xs font-mono">
          {(
            [
              { key: "apa", label: "APA 7th" },
              { key: "chicago", label: "Chicago 17th" },
              { key: "mla", label: "MLA 9th" },
              { key: "bibtex", label: "BibTeX (.bib)" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setCopied(false);
              }}
              className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-[var(--primary)] text-[var(--primary)] font-bold"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="p-5 space-y-4">
          <div className="relative p-4 rounded bg-[var(--background)] border border-[var(--border)] text-xs font-mono leading-relaxed text-[var(--foreground)] select-all overflow-x-auto whitespace-pre-wrap max-h-56">
            {currentContent}
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1.5 text-[11px]">
              <BookMarked className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Verified Institutional Archival Provenance
            </span>

            <div className="flex items-center gap-2">
              {activeTab === "bibtex" && (
                <button
                  onClick={handleDownloadBib}
                  className="flex items-center gap-1 px-3 py-1.5 border border-[var(--border)] rounded hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                  title="Download BibTeX File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .bib</span>
                </button>
              )}

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:opacity-90 font-medium transition-opacity"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Citation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
