import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Languages,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { volumeQADatabase, type VolumeQAPair } from "@/data/multimediaData";

interface VolumeCitationCardProps {
  currentPdfName?: string; // e.g. "Volume1.pdf", "Volume17_Part_I.pdf", "VolumeH1.pdf", "VolumeH40.pdf"
}

export default function VolumeCitationCard({ currentPdfName }: VolumeCitationCardProps) {
  const [selectedLang, setSelectedLang] = useState<"all" | "English" | "Hindi">("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredQAs = volumeQADatabase.filter((qa) => {
    const matchesPdf = !currentPdfName || qa.citation.toLowerCase() === currentPdfName.toLowerCase();
    const matchesLang = selectedLang === "all" || qa.language === selectedLang;
    return matchesPdf && matchesLang;
  });

  if (filteredQAs.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[var(--foreground)]">
              Verified Volume Citations & Q&A
            </h3>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Grounded references extracted from official Maharashtra Education Dept & Ambedkar Foundation volumes
            </p>
          </div>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-1">
          {(["all", "English", "Hindi"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLang(l)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                selectedLang === l
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]"
              }`}
            >
              {l === "all" ? "All Languages" : l}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-2.5">
        {filteredQAs.map((qa, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div
              key={index}
              className="rounded border border-[var(--border)] bg-[var(--background)] p-3 text-xs space-y-2 transition-all"
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="w-full flex items-start justify-between gap-2 text-left group"
              >
                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--primary)]/10 text-[var(--primary)] font-bold flex-shrink-0">
                    Q{index + 1}
                  </span>
                  <span className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                    {qa.question}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase">
                    {qa.language}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  )}
                </div>
              </button>

              {/* Answer Body */}
              {isExpanded && (
                <div className="pt-2 pl-7 border-t border-[var(--border)]/60 space-y-2 text-[var(--muted-foreground)]">
                  <div className="flex items-start gap-1.5 text-[var(--foreground)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-serif">{qa.answer}</p>
                  </div>

                  {qa.englishAnswer && qa.language === "Hindi" && (
                    <p className="text-[11px] italic bg-[var(--muted)]/50 p-2 rounded border border-[var(--border)]/50">
                      <strong>English Translation:</strong> {qa.englishAnswer}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1 text-[var(--primary)] font-semibold">
                      <FileText className="w-3 h-3" />
                      Primary Source: {qa.citation}
                    </span>
                    <Link
                      to={`/documents/${qa.citation}`}
                      className="hover:underline text-[var(--primary)] flex items-center gap-0.5"
                    >
                      <span>Read Volume PDF</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
