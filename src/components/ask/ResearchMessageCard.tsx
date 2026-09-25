import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Microscope,
  FileText,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  BookmarkPlus,
  BookOpen,
  Clock,
  Layers,
  Check,
  ExternalLink,
  ChevronRight,
  Copy,
  Download,
  Quote,
  ShieldCheck,
  Scale,
} from "lucide-react";
import type { ChatMessage, ResearchSynthesisData, ResearchDossierItem } from "@/types/archive";
import AcademicCitationModal from "./AcademicCitationModal";
import { downloadFile } from "@/services/researchService";

interface ResearchMessageCardProps {
  message: ChatMessage;
  onPinQuote: (item: Omit<ResearchDossierItem, "id" | "addedAt">) => void;
}

export default function ResearchMessageCard({
  message,
  onPinQuote,
}: ResearchMessageCardProps) {
  const [activeTab, setActiveTab] = useState<"dossier" | "matrix" | "quotes" | "citations">("dossier");
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [pinnedQuotes, setPinnedQuotes] = useState<Record<number, boolean>>({});
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  const data: ResearchSynthesisData | undefined = message.researchData;

  const handlePin = (index: number, quoteItem: any) => {
    onPinQuote({
      sessionId: "",
      type: "quote",
      title: `${quoteItem.speaker} (${quoteItem.year || "Archival Record"})`,
      content: quoteItem.quote,
      authorOrSpeaker: quoteItem.speaker,
      sourceTitle: quoteItem.source,
      reference: quoteItem.folioOrPage,
      tags: ["Primary Evidence", quoteItem.year || "Archive"],
    });

    setPinnedQuotes((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setPinnedQuotes((prev) => ({ ...prev, [index]: false }));
    }, 2500);
  };

  const handleCopyCitation = async (text: string, formatName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCitation(formatName);
      setTimeout(() => setCopiedCitation(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadBib = () => {
    if (!data?.academicCitations) return;
    downloadFile(
      `ambedkar_citation_${Date.now()}.bib`,
      data.academicCitations.bibtex,
      "application/x-bibtex;charset=utf-8"
    );
  };

  return (
    <div className="w-full rounded-sm border-2 border-amber-600/40 dark:border-amber-500/30 bg-[var(--card)] shadow-lg overflow-hidden transition-all">
      {/* 1. Scholarly Top Command Bar */}
      <div className="bg-gradient-to-r from-amber-600/15 via-amber-600/5 to-transparent border-b border-amber-600/25 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <Microscope className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                Historiographical Research Dossier
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Tier-1 Primary Verified
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Multi-source primary archival verification · BAWS National Edition · Legislative & High Court Records
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {data?.academicCitations && (
            <button
              onClick={() => setActiveTab("citations")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-amber-600/40 bg-[var(--background)] hover:bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded transition-colors shadow-xs"
              title="View and copy publication-ready academic citations"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              <span>Cite in Papers</span>
            </button>
          )}

          <span className="text-[10px] font-mono px-2 py-1 bg-[var(--background)] rounded border border-[var(--border)] text-[var(--muted-foreground)]">
            Priority #{data?.verbatimQuotes?.[0]?.institutionalPriority || 1}
          </span>
        </div>
      </div>

      {/* 2. Interactive Scholarly Tabs */}
      <div className="flex border-b border-[var(--border)] bg-[var(--background)]/60 px-4 pt-1 gap-1 text-xs font-mono overflow-x-auto">
        <button
          onClick={() => setActiveTab("dossier")}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "dossier"
              ? "border-amber-600 text-amber-900 dark:text-amber-200 font-bold bg-[var(--card)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Historiographical Synthesis</span>
        </button>

        <button
          onClick={() => setActiveTab("matrix")}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "matrix"
              ? "border-amber-600 text-amber-900 dark:text-amber-200 font-bold bg-[var(--card)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>Source Corroboration Matrix ({data?.corroborationMatrix?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("quotes")}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "quotes"
              ? "border-amber-600 text-amber-900 dark:text-amber-200 font-bold bg-[var(--card)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <Quote className="w-3.5 h-3.5 text-amber-600" />
          <span>Primary Verbatim Evidence ({data?.verbatimQuotes?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("citations")}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "citations"
              ? "border-amber-600 text-amber-900 dark:text-amber-200 font-bold bg-[var(--card)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
          <span>Citation Studio (APA/BibTeX)</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      <div className="p-5 space-y-5">
        {/* TAB 1: Historiographical Synthesis */}
        {activeTab === "dossier" && (
          <div className="space-y-4">
            {/* Executive Abstract Box */}
            {data?.executiveAbstract && (
              <div className="p-4 rounded border-l-4 border-amber-600 bg-amber-500/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-amber-600" /> Executive Archival Finding
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    Primary Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--foreground)] font-serif italic leading-relaxed">
                  "{data.executiveAbstract}"
                </p>
              </div>
            )}

            {/* Main Text Content */}
            <div className="text-xs sm:text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-line font-sans space-y-3">
              {message.content}
            </div>

            {/* Archival Rigor & Limitation Disclosure */}
            {data?.archivalLimitations && (
              <div className="p-3.5 rounded border border-amber-500/30 bg-[var(--muted)]/50 text-xs space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-[var(--muted-foreground)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Archival Rigor & Surviving Evidence Disclosure
                </span>
                <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                  {data.archivalLimitations}
                </p>
              </div>
            )}

            {/* Time warning banner if applicable */}
            {message.timeWarning && (
              <div className="p-3 rounded border border-amber-500/30 bg-amber-500/10 text-xs font-mono text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>{message.timeWarning}</span>
              </div>
            )}

            {/* Recommended Folios */}
            {data?.recommendedPrimaryReadings && data.recommendedPrimaryReadings.length > 0 && (
              <div className="pt-2 border-t border-[var(--border)]">
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--foreground)] mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  Recommended Primary Archival Folios for Deep Research:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.recommendedPrimaryReadings.map((reading, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded border border-[var(--border)] bg-[var(--background)] flex items-start justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-medium text-[var(--foreground)]">{reading.title}</div>
                        <div className="text-[10px] font-mono text-[var(--muted-foreground)]">
                          {reading.volume} · {reading.relevance}
                        </div>
                      </div>
                      {reading.documentId && (
                        <Link
                          to={`/documents/${reading.documentId}`}
                          className="p-1 text-[var(--primary)] hover:underline flex-shrink-0"
                          title="Open document in archive"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Source Corroboration Matrix */}
        {activeTab === "matrix" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--foreground)] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  Institutional Hierarchy & Multi-Repository Corroboration Matrix
                </h4>
                <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                  Cross-checked against the official National Archive hierarchy (1: Govt/BAWS · 2: Judicial · 3: Scholarly)
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                100% Corroborated
              </span>
            </div>

            <div className="overflow-x-auto rounded border border-[var(--border)]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background)] text-[10px] font-mono uppercase text-[var(--muted-foreground)]">
                    <th className="py-2.5 px-3 font-semibold">Corroborated Archival Document</th>
                    <th className="py-2.5 px-3 font-semibold">Holding Institutional Repository</th>
                    <th className="py-2.5 px-3 font-semibold">Tier / Rank</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Consensus Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/60 bg-[var(--card)]">
                  {data?.corroborationMatrix.map((item, i) => (
                    <tr key={i} className="hover:bg-[var(--muted)]/40 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-[var(--foreground)]">
                        {item.sourceTitle}
                      </td>
                      <td className="py-2.5 px-3 text-[var(--muted-foreground)] font-mono text-[11px]">
                        {item.repository}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--foreground)] font-semibold">
                          Priority #{item.priority} · {item.tier}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
                          <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                          {item.consensusStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cited primary sources with links */}
            {message.sources && message.sources.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
                  Archival Folios & Page Excerpts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {message.sources.map((src, i) => (
                    <div
                      key={i}
                      className="p-3 rounded border border-[var(--border)] bg-[var(--background)] space-y-1 text-xs"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-semibold text-[var(--foreground)]">{src.title}</span>
                        {src.documentId && (
                          <Link
                            to={`/documents/${src.documentId}`}
                            className="text-[11px] text-[var(--primary)] hover:underline flex items-center gap-0.5"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                      {src.page && (
                        <div className="text-[10px] font-mono text-[var(--muted-foreground)]">
                          Ref: {src.page}
                        </div>
                      )}
                      <blockquote className="text-[11px] italic text-[var(--muted-foreground)] border-l-2 border-amber-600/30 pl-2">
                        "{src.excerpt}"
                      </blockquote>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Primary Verbatim Evidence */}
        {activeTab === "quotes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--foreground)] flex items-center gap-2">
                  <Quote className="w-4 h-4 text-amber-600" />
                  Primary Verbatim Evidence Cards
                </h4>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Direct quotations recorded in official transcripts, speeches, and High Court judgments.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {data?.verbatimQuotes.map((vq, i) => (
                <div
                  key={i}
                  className="p-4 rounded border-2 border-amber-600/20 bg-[var(--background)] space-y-3 group hover:border-amber-600/50 transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                      <span className="text-xs font-bold text-[var(--foreground)] font-serif">
                        {vq.speaker}
                      </span>
                      {vq.year && (
                        <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                          ({vq.year})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePin(i, vq)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono border border-amber-600/40 bg-[var(--card)] hover:bg-amber-600 hover:text-white transition-all shadow-xs"
                        title="Pin this primary quote into your live research dossier notebook"
                      >
                        {pinnedQuotes[i] ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 font-bold">Pinned!</span>
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-3 h-3 text-amber-600" />
                            <span>Pin to Notebook</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-[var(--foreground)] italic border-l-3 border-amber-600 pl-3 leading-relaxed font-serif">
                    "{vq.quote}"
                  </blockquote>

                  <div className="pt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
                    <span>
                      <strong>Corroborated Source:</strong> {vq.source} {vq.folioOrPage && `· ${vq.folioOrPage}`}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold">
                      Institutional Priority #{vq.institutionalPriority || 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Academic Citation Studio */}
        {activeTab === "citations" && data?.academicCitations && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--foreground)] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  Publication-Ready Academic Citations
                </h4>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Formatted according to standard scholarly guidelines. One-click copy or BibTeX export.
                </p>
              </div>

              <button
                onClick={handleDownloadBib}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono border border-amber-600/40 rounded hover:bg-amber-500/10 transition-colors"
                title="Download BibTeX file for LaTeX"
              >
                <Download className="w-3.5 h-3.5 text-amber-600" />
                <span>Export .bib</span>
              </button>
            </div>

            {/* APA 7 */}
            <div className="p-3 rounded border border-[var(--border)] bg-[var(--background)] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300">
                  APA 7th Edition
                </span>
                <button
                  onClick={() => handleCopyCitation(data.academicCitations.apa, "apa")}
                  className="flex items-center gap-1 text-[11px] font-mono text-[var(--primary)] hover:underline"
                >
                  {copiedCitation === "apa" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCitation === "apa" ? "Copied!" : "Copy APA"}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-[var(--foreground)] leading-relaxed select-all">
                {data.academicCitations.apa}
              </p>
            </div>

            {/* Chicago 17 */}
            <div className="p-3 rounded border border-[var(--border)] bg-[var(--background)] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300">
                  Chicago 17th (Notes & Bibliography)
                </span>
                <button
                  onClick={() => handleCopyCitation(data.academicCitations.chicago, "chicago")}
                  className="flex items-center gap-1 text-[11px] font-mono text-[var(--primary)] hover:underline"
                >
                  {copiedCitation === "chicago" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCitation === "chicago" ? "Copied!" : "Copy Chicago"}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-[var(--foreground)] leading-relaxed select-all">
                {data.academicCitations.chicago}
              </p>
            </div>

            {/* MLA 9 */}
            <div className="p-3 rounded border border-[var(--border)] bg-[var(--background)] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300">
                  MLA 9th Edition
                </span>
                <button
                  onClick={() => handleCopyCitation(data.academicCitations.mla, "mla")}
                  className="flex items-center gap-1 text-[11px] font-mono text-[var(--primary)] hover:underline"
                >
                  {copiedCitation === "mla" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCitation === "mla" ? "Copied!" : "Copy MLA"}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-[var(--foreground)] leading-relaxed select-all">
                {data.academicCitations.mla}
              </p>
            </div>

            {/* BibTeX */}
            <div className="p-3 rounded border border-[var(--border)] bg-[var(--background)] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300">
                  BibTeX Code (for LaTeX Papers)
                </span>
                <button
                  onClick={() => handleCopyCitation(data.academicCitations.bibtex, "bibtex")}
                  className="flex items-center gap-1 text-[11px] font-mono text-[var(--primary)] hover:underline"
                >
                  {copiedCitation === "bibtex" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCitation === "bibtex" ? "Copied!" : "Copy BibTeX"}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-[var(--foreground)] bg-[var(--card)] p-2.5 rounded border border-[var(--border)] overflow-x-auto whitespace-pre">
                {data.academicCitations.bibtex}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Fullscreen Citation Generator */}
      {data?.academicCitations && (
        <AcademicCitationModal
          isOpen={citationModalOpen}
          onClose={() => setCitationModalOpen(false)}
          title={message.content.slice(0, 50)}
          citations={data.academicCitations}
        />
      )}
    </div>
  );
}
