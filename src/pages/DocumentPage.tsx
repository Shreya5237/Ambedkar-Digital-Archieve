import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  Info,
  BookOpen,
  Search,
  Copy,
  Check,
  ArrowLeft,
  ExternalLink,
  Radio,
  Film,
  Download,
  HelpCircle,
  List,
  File,
} from "lucide-react";
import { getDocument } from "@/services/api";
import ArchivalAudioPlayer from "@/components/media/ArchivalAudioPlayer";
import ArchivalVideoPlayer from "@/components/media/ArchivalVideoPlayer";
import VolumeCitationCard from "@/components/media/VolumeCitationCard";
import TranscriptAudioPlayer from "@/components/media/TranscriptAudioPlayer";
import PageNavigator from "@/components/common/PageNavigator";
import { parseTranscriptPages } from "@/utils/transcriptParser";

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<"transcript" | "metadata" | "provenance">("transcript");
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [copied, setCopied] = useState(false);
  const [docSearch, setDocSearch] = useState("");
  const [transcriptViewMode, setTranscriptViewMode] = useState<"single" | "full">("single");

  const { data: doc, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocument(id!),
    enabled: !!id,
  });

  const currentLang = i18n.language.split('-')[0]; // e.g. 'en-US' -> 'en'
  const displayTranscript = doc?.translatedTranscripts && doc.translatedTranscripts[currentLang]
    ? doc.translatedTranscripts[currentLang]
    : doc?.transcript;

  const parsedPages = useMemo(() => {
    if (doc?.pagesList && doc.pagesList.length > 0) {
      return doc.pagesList;
    }
    return parseTranscriptPages(displayTranscript, doc?.pageCount);
  }, [doc, displayTranscript]);

  const totalPages = Math.max(doc?.pageCount || 1, parsedPages.length || 1);

  const currentPageObj = useMemo(() => {
    return parsedPages.find((p) => p.pageNumber === page) || parsedPages[page - 1] || parsedPages[0];
  }, [parsedPages, page]);

  const currentPageContent = currentPageObj?.content || (parsedPages.length === 1 ? (displayTranscript || "") : "");

  const handleCopyCitation = () => {
    if (!doc) return;
    const citation = `${doc.author}. "${doc.title}." ${doc.date}. ${doc.sourceInstitution}. ${doc.sourceReference}.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[var(--muted)] rounded w-1/4" />
          <div className="h-8 bg-[var(--muted)] rounded w-2/3" />
          <div className="h-4 bg-[var(--muted)] rounded w-1/3" />
          <div className="h-96 bg-[var(--muted)] rounded" />
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)] opacity-50" />
        <h2 className="font-display text-2xl font-semibold mb-2">Document not found</h2>
        <Link to="/search" className="text-sm text-[var(--primary)] hover:underline">
          Return to search
        </Link>
      </div>
    );
  }

  const highlightText = (text: string) => {
    if (!docSearch.trim()) return text;
    const re = new RegExp(`(${docSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.replace(re, `<mark class="bg-amber-200 dark:bg-amber-700 rounded-sm px-0.5">$1</mark>`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
        <Link to="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/search" className="hover:text-[var(--foreground)] transition-colors">Documents</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] truncate max-w-xs">{doc.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8 pb-8 border-b border-[var(--border)]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-sm">
                {doc.contentType.replace(/_/g, " ")}
              </span>
              <span className="font-mono text-xs text-[var(--muted-foreground)]">{doc.date}</span>
              <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">{doc.language}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-3">{doc.title}</h1>
            <p className="text-[var(--muted-foreground)] text-sm">
              By{" "}
              {doc.authorId ? (
                <Link to={`/people/${doc.authorId}`} className="text-[var(--primary)] hover:underline">
                  {doc.author}
                </Link>
              ) : (
                doc.author
              )}
              {doc.publication && <> · Published in <em>{doc.publication}</em></>}
              {doc.pages && <> · pp. {doc.pages}</>}
            </p>
          </div>
          <button
            onClick={handleCopyCitation}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-sm text-sm hover:bg-[var(--muted)] transition-colors flex-shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Cite"}
          </button>
        </div>

        {/* Summary */}
        <div className="mt-4 p-4 bg-[var(--muted)] rounded-sm border-l-2 border-[var(--primary)]">
          <p className="text-sm leading-relaxed text-[var(--foreground)]">{doc.summary}</p>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {doc.topicIds.map((id) => (
            <Link
              key={id}
              to={`/search?topic=${id}`}
              className="text-xs px-3 py-1 bg-[var(--secondary)] hover:bg-[var(--muted)] rounded-sm transition-colors text-[var(--muted-foreground)] border border-[var(--border)]"
            >
              {id.replace("t-", "")}
            </Link>
          ))}
          {doc.eventIds.map((id) => (
            <Link
              key={id}
              to={`/events/${id}`}
              className="text-xs px-3 py-1 bg-[var(--secondary)] hover:bg-[var(--muted)] rounded-sm transition-colors text-[var(--muted-foreground)] border border-[var(--border)]"
            >
              {id.replace("ev-", "")}
            </Link>
          ))}
        </div>
      </div>

      {/* Main viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Document image */}
        <div className="lg:col-span-3">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <PageNavigator page={page} totalPages={totalPages} onPageChange={setPage} />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.min(200, z + 25))}
                className="p-1.5 rounded-sm border border-[var(--border)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 25))}
                className="p-1.5 rounded-sm border border-[var(--border)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-[var(--muted-foreground)]">{zoom}%</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Audio Document Viewer */}
            {doc.mediaType === "audio" ? (
              <div className="p-2">
                <ArchivalAudioPlayer
                  audio={{
                    id: doc.id,
                    title: doc.title,
                    audioUrl: doc.fileUrl || "/audio/speech.mp3",
                    speaker: doc.author,
                    date: doc.date,
                    sourceInstitution: doc.sourceInstitution,
                    provenance: doc.provenance,
                    transcript: doc.transcript || doc.summary,
                    license: doc.rights,
                    confidence: "verified",
                  }}
                />
              </div>
            ) : doc.mediaType === "video" ? (
              <div className="p-2">
                <ArchivalVideoPlayer
                  video={{
                    id: doc.id,
                    title: doc.title,
                    videoUrl: doc.fileUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    posterUrl: doc.thumbnailUrl,
                    date: doc.date,
                    sourceInstitution: doc.sourceInstitution,
                    provenance: doc.provenance,
                    description: doc.summary,
                    transcript: doc.transcript,
                    license: doc.rights,
                    confidence: "verified",
                  }}
                />
              </div>
            ) : (
              /* Document image or PDF Reader */
              <div className="flex-1 border border-[var(--border)] rounded-sm overflow-hidden bg-[var(--muted)] flex flex-col min-h-80">
                {doc.fileUrl && doc.fileUrl.endsWith(".pdf") && (
                  <div className="p-2.5 bg-[var(--card)] border-b border-[var(--border)] flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-[var(--primary)] font-bold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Official Digitized Archival PDF
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open Full Screen</span>
                      </a>
                      <a
                        href={doc.fileUrl}
                        download
                        className="px-2.5 py-1 rounded bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center gap-1 hover:opacity-90 transition-opacity"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex-1 flex items-center justify-center min-h-[550px]">
                  {doc.fileUrl ? (
                    <iframe 
                      src={doc.fileUrl} 
                      className="w-full h-full min-h-[600px] border-0" 
                      title={doc.title} 
                    />
                  ) : doc.thumbnailUrl ? (
                    <img
                      src={doc.thumbnailUrl}
                      alt={`${doc.title} — page ${page}`}
                      className="max-w-full transition-transform duration-200"
                      style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                    />
                  ) : (
                    <div className="text-center text-[var(--muted-foreground)] p-8">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Document image not available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Tabs & Grounded Citations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab nav */}
          <div className="flex border-b border-[var(--border)] mb-4">
            {(["transcript", "metadata", "provenance"] as const).map((tab) => {
              const icons = { transcript: BookOpen, metadata: Info, provenance: ExternalLink };
              const Icon = icons[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 -mb-px capitalize transition-colors ${
                    activeTab === tab
                      ? "border-[var(--primary)] text-[var(--primary)] font-medium"
                      : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t(`document.${tab}`)}
                </button>
              );
            })}
          </div>

          {/* Search within */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              placeholder="Search within document…"
              className="w-full pl-9 pr-4 py-2 bg-[var(--muted)] border border-[var(--border)] rounded-sm text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>

          {/* Transcript tab */}
          {activeTab === "transcript" && (
            <div className="space-y-4">
              {/* Audiobook TTS Reader */}
              <TranscriptAudioPlayer
                text={
                  transcriptViewMode === "single"
                    ? currentPageContent || displayTranscript || ""
                    : displayTranscript || ""
                }
                title={doc.title}
                language={doc.language}
                pageNumber={page}
                totalPages={totalPages}
                onNextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
                onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
                onPageSelect={(p) => setPage(p)}
              />

              {/* View Mode & Page Navigator Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-xs">
                <PageNavigator page={page} totalPages={totalPages} onPageChange={setPage} />

                {totalPages > 1 && (
                  <div className="flex items-center gap-1 bg-[var(--muted)] p-1 rounded-md border border-[var(--border)] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setTranscriptViewMode("single")}
                      className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 font-semibold ${
                        transcriptViewMode === "single"
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <File className="w-3 h-3" />
                      <span>Single Page</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTranscriptViewMode("full")}
                      className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 font-semibold ${
                        transcriptViewMode === "full"
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <List className="w-3 h-3" />
                      <span>Full Scroll</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Transcript Content Container */}
              <div className="max-h-[550px] overflow-y-auto p-4 rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-inner space-y-3">
                {displayTranscript ? (
                  <div>
                    {doc.translatedTranscripts && doc.translatedTranscripts[currentLang] && (
                      <div className="mb-4 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded border border-green-200 dark:border-green-800 inline-block">
                        ✓ Automatically translated to your language
                      </div>
                    )}

                    {transcriptViewMode === "single" && totalPages > 1 ? (
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border)] font-mono text-xs text-[var(--primary)] font-bold">
                          <span>PAGE {page} TRANSCRIPT</span>
                          <span className="text-[var(--muted-foreground)] font-normal">
                            Page {page} of {totalPages}
                          </span>
                        </div>
                        {currentPageContent ? (
                          <div
                            className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--foreground)] font-serif"
                            dangerouslySetInnerHTML={{ __html: highlightText(currentPageContent) }}
                          />
                        ) : (
                          <div className="py-8 text-center text-xs text-[var(--muted-foreground)] italic font-mono">
                            [Blank or scanned image on Page {page}]
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--foreground)] font-serif"
                        dangerouslySetInnerHTML={{ __html: highlightText(displayTranscript) }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[var(--muted-foreground)]">
                    <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Transcript not yet available for this document</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata tab */}
          {activeTab === "metadata" && (
            <div className="space-y-3">
              {[
                { label: "Title", value: doc.title },
                { label: "Author", value: doc.author },
                { label: "Date", value: doc.date },
                { label: "Language", value: doc.language.toUpperCase() },
                { label: "Type", value: doc.contentType.replace(/_/g, " ") },
                { label: "Source Institution", value: doc.sourceInstitution },
                { label: "Source Reference", value: doc.sourceReference },
                doc.publication ? { label: "Publication", value: doc.publication } : null,
                doc.volume ? { label: "Volume", value: doc.volume } : null,
                doc.pages ? { label: "Pages", value: doc.pages } : null,
                { label: "Rights", value: doc.rights },
              ]
                .filter(Boolean)
                .map((item) => (
                  <div key={item!.label} className="flex gap-3">
                    <dt className="text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)] w-28 flex-shrink-0 pt-0.5">
                      {item!.label}
                    </dt>
                    <dd className="text-sm text-[var(--foreground)] leading-relaxed">{item!.value}</dd>
                  </div>
                ))}

              {doc.personIds.length > 0 && (
                <div className="flex gap-3">
                  <dt className="text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)] w-28 flex-shrink-0 pt-0.5">
                    People
                  </dt>
                  <dd className="flex flex-wrap gap-1">
                    {doc.personIds.map((pid) => (
                      <Link
                        key={pid}
                        to={`/people/${pid}`}
                        className="text-xs text-[var(--primary)] hover:underline"
                      >
                        {doc.people[doc.personIds.indexOf(pid)]}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}

              {/* Citation */}
              <div className="mt-6 p-4 bg-[var(--muted)] rounded-sm border border-[var(--border)]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                  Suggested Citation
                </div>
                <p className="text-xs leading-relaxed text-[var(--foreground)]">
                  {doc.author}. "{doc.title}." {doc.date}.{" "}
                  {doc.publication && <>{doc.publication}. </>}
                  {doc.sourceInstitution}. {doc.sourceReference}.
                </p>
                <button
                  onClick={handleCopyCitation}
                  className="mt-2 flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy citation"}
                </button>
              </div>
            </div>
          )}

          {/* Provenance tab */}
          {activeTab === "provenance" && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                  Provenance
                </div>
                <p className="text-sm text-[var(--foreground)] leading-relaxed">{doc.provenance}</p>
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                  Rights
                </div>
                <p className="text-sm text-[var(--foreground)]">{doc.rights}</p>
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                  Source Institution
                </div>
                <p className="text-sm text-[var(--foreground)]">{doc.sourceInstitution}</p>
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                  Reference
                </div>
                <p className="text-sm font-mono text-[var(--foreground)]">{doc.sourceReference}</p>
              </div>
            </div>
          )}

          {/* Volume Q&A & Archival Citation Assistant from data.json */}
          <VolumeCitationCard currentPdfName={doc.id} />
        </div>
      </div>

      {/* Related events */}
      {doc.eventIds.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <h3 className="font-display text-xl font-semibold mb-4">Related Events</h3>
          <div className="flex gap-3 flex-wrap">
            {doc.eventIds.map((eid) => (
              <Link
                key={eid}
                to={`/events/${eid}`}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-sm text-sm hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-[var(--primary)]" />
                {eid.replace("ev-", "").replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
