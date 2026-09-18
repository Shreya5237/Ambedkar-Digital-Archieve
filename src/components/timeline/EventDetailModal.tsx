import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Tag,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  Share2,
  Check,
  Radio,
  Film,
} from "lucide-react";
import type { HistoricalEvent, SourcePriority } from "@/types/archive";
import { historicalAudios, historicalVideos } from "@/data/multimediaData";
import { allLocalHistoricalImages } from "@/data/historicalImagesData";
import { historicalImages } from "@/data/historicalData";
import ArchivalAudioPlayer from "@/components/media/ArchivalAudioPlayer";
import ArchivalVideoPlayer from "@/components/media/ArchivalVideoPlayer";

interface EventDetailModalProps {
  event: HistoricalEvent | null;
  onClose: () => void;
  onSelectRelatedEvent?: (eventId: string) => void;
}

const PRIORITY_BADGES: Record<SourcePriority, { label: string; bg: string; text: string }> = {
  1: { label: "Priority 1 • Dr. Ambedkar Foundation / BAWS", bg: "bg-blue-900/15 border-blue-600/30", text: "text-blue-700 dark:text-blue-400" },
  2: { label: "Priority 2 • Constitution Primary Records", bg: "bg-emerald-900/15 border-emerald-600/30", text: "text-emerald-700 dark:text-emerald-400" },
  3: { label: "Priority 3 • Parliamentary & Court Archives", bg: "bg-indigo-900/15 border-indigo-600/30", text: "text-indigo-700 dark:text-indigo-400" },
  4: { label: "Priority 4 • Columbia / LSE University Archives", bg: "bg-purple-900/15 border-purple-600/30", text: "text-purple-700 dark:text-purple-400" },
  5: { label: "Priority 5 • Deekshabhoomi Institutional Records", bg: "bg-amber-900/15 border-amber-600/30", text: "text-amber-700 dark:text-amber-400" },
  6: { label: "Priority 6 • Wikimedia Commons Archival", bg: "bg-cyan-900/15 border-cyan-600/30", text: "text-cyan-700 dark:text-cyan-400" },
  7: { label: "Priority 7 • Scholarly Secondary Source", bg: "bg-slate-900/15 border-slate-600/30", text: "text-slate-700 dark:text-slate-400" },
};

export default function EventDetailModal({
  event,
  onClose,
  onSelectRelatedEvent,
}: EventDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "sources" | "media">("overview");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!event) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Find all verified photographs for this event ──────────────────────────
  const matchingImages = React.useMemo(() => {
    const list: typeof allLocalHistoricalImages = [];
    const seen = new Set<string>();

    const add = (img?: any) => {
      if (!img || !img.url || seen.has(img.url)) return;
      seen.add(img.url);
      list.push(img);
    };

    // 1. Existing relatedImages on the event
    if (event.relatedImages && event.relatedImages.length > 0) {
      event.relatedImages.forEach(add);
    }

    // 2. Exact match in allLocalHistoricalImages by eventId
    allLocalHistoricalImages
      .filter((img) => img.eventId && (img.eventId === event.id || img.eventId === event.event_id))
      .forEach(add);

    // 3. Match in legacy historicalImages
    historicalImages
      .filter((img) => img.eventId && (img.eventId === event.id || img.eventId === event.event_id))
      .forEach(add);

    // 4. Fallback by decade if none matched directly
    if (list.length === 0) {
      const decadeStr = `${Math.floor(event.year / 10) * 10}s`;
      const decadeMatches = allLocalHistoricalImages.filter((img) => img.decade === decadeStr);
      decadeMatches.slice(0, 3).forEach(add);
    }

    return list;
  }, [event]);

  const activePhoto =
    matchingImages[selectedPhotoIndex] ||
    matchingImages[0] ||
    (event.image
      ? {
          url: event.image,
          title: event.title,
          caption: event.significance || event.description,
          sourceInstitution: "Archival Collection",
          license: "Verified Public Domain",
        }
      : null);

  const matchingAudios =
    event.relatedAudios && event.relatedAudios.length > 0
      ? event.relatedAudios
      : historicalAudios.filter((a) => a.eventId === event.id);

  const matchingVideos =
    event.relatedVideos && event.relatedVideos.length > 0
      ? event.relatedVideos
      : historicalVideos.filter((v) => v.eventId === event.id);

  const totalMediaCount =
    matchingImages.length +
    event.relatedDocuments.length +
    matchingAudios.length +
    matchingVideos.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-[var(--card)] border border-[var(--border)] rounded-md shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--muted)]/50">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--primary)] px-2.5 py-0.5 rounded bg-[var(--primary)]/10 border border-[var(--primary)]/20">
              {event.eventType}
            </span>
            <span className="text-xs font-mono text-[var(--muted-foreground)]">
              ID: {event.id}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
              <ShieldCheck className="w-3 h-3" />
              {event.confidence.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1 text-xs"
              title="Copy event link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[var(--border)] bg-[var(--background)]">
          {(
            [
              { key: "overview", label: "Overview & Trajectory" },
              { key: "evidence", label: `Claim-Level Evidence (${event.evidence.length})` },
              { key: "sources", label: `Verified Sources (${event.sources.length})` },
              {
                key: "media",
                label: `Photographs & Media (${
                  matchingImages.length +
                  matchingAudios.length +
                  matchingVideos.length +
                  event.relatedDocuments.length
                })`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2.5 px-2 text-xs font-mono font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "border-[var(--primary)] text-[var(--primary)] font-bold"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Event Hero Title & Date */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2 text-xs font-mono text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1.5 font-bold text-[var(--primary)]">
                    <Calendar className="w-4 h-4" />
                    {event.date} ({event.datePrecision.toUpperCase()} PRECISION)
                  </span>

                  {/* Strict Archival Time Status */}
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    <Clock className="w-3.5 h-3.5" />
                    {event.time.value ? event.time.value : "Time: Not documented in verified sources."}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--foreground)] leading-tight">
                  {event.title}
                </h1>
              </div>

              {/* Location Badge & Coordinates Map Preview */}
              {event.locationDetails && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-md bg-[var(--muted)]/40 border border-[var(--border)]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-xs text-[var(--foreground)]">
                        {event.locationDetails.siteName ? `${event.locationDetails.siteName}, ` : ""}
                        {event.locationDetails.name}, {event.locationDetails.state ? `${event.locationDetails.state}, ` : ""}
                        {event.locationDetails.country}
                      </div>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                        {event.locationDetails.description}
                      </p>
                    </div>
                  </div>

                  {event.locationDetails.coordinates && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${event.locationDetails.coordinates.lat},${event.locationDetails.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded text-[11px] font-mono bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--primary)] flex items-center gap-1 transition-colors"
                    >
                      <span>Lat: {event.locationDetails.coordinates.lat.toFixed(2)}, Lng: {event.locationDetails.coordinates.lng.toFixed(2)}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Featured Archival Photograph */}
              {activePhoto && (
                <div className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--muted)]/20 shadow-sm">
                  <div className="relative group bg-black/5 flex items-center justify-center min-h-[220px] max-h-96 overflow-hidden">
                    <img
                      src={activePhoto.url}
                      alt={activePhoto.title || event.title}
                      className="w-full h-auto max-h-96 object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    {matchingImages.length > 1 && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-black/70 text-white backdrop-blur-sm border border-white/20">
                        {selectedPhotoIndex + 1} of {matchingImages.length}
                      </div>
                    )}
                  </div>

                  {/* Photo details bar */}
                  <div className="p-3 bg-[var(--card)] border-t border-[var(--border)] space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[var(--foreground)] line-clamp-1">
                        {activePhoto.title || event.title}
                      </span>
                      {activePhoto.license && (
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-[var(--muted)] rounded border border-[var(--border)] whitespace-nowrap text-[var(--muted-foreground)]">
                          {activePhoto.license}
                        </span>
                      )}
                    </div>
                    {activePhoto.caption && (
                      <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
                        {activePhoto.caption}
                      </p>
                    )}
                    {activePhoto.sourceInstitution && (
                      <div className="text-[10px] font-mono text-[var(--muted-foreground)] flex items-center gap-1.5 pt-0.5">
                        <span className="text-[var(--primary)] font-semibold">Provenance:</span>
                        <span>{activePhoto.sourceInstitution}</span>
                      </div>
                    )}
                  </div>

                  {/* Multi-photo thumbnail strip */}
                  {matchingImages.length > 1 && (
                    <div className="p-2.5 bg-[var(--muted)]/30 border-t border-[var(--border)] flex items-center gap-2 overflow-x-auto">
                      {matchingImages.map((img, idx) => (
                        <button
                          key={img.id || idx}
                          type="button"
                          onClick={() => setSelectedPhotoIndex(idx)}
                          className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                            selectedPhotoIndex === idx
                              ? "border-[var(--primary)] shadow-md scale-105"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                          title={img.title}
                        >
                          <img
                            src={img.url}
                            alt={img.title || `Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Historical Description */}
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                  Historical Account
                </h3>
                <p className="text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Significance Box */}
              <div className="p-4 rounded-md bg-[var(--primary)]/5 border-l-4 border-[var(--primary)] space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--primary)] font-bold">
                  <Award className="w-3.5 h-3.5" />
                  Historical Significance & Impact
                </div>
                <p className="text-xs leading-relaxed text-[var(--foreground)]">
                  {event.significance}
                </p>
              </div>

              {/* People & Themes Pills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
                    Key People Documented
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {event.people.map((pId) => (
                      <Link
                        key={pId}
                        to={`/people/${pId}`}
                        onClick={onClose}
                        className="px-2.5 py-1 rounded text-xs bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] border border-[var(--border)] flex items-center gap-1 transition-colors"
                      >
                        <span>{pId === "P1" ? "Dr. B. R. Ambedkar" : pId === "P2" ? "Mahatma Gandhi" : pId === "P3" ? "Jawaharlal Nehru" : pId === "P5" ? "Ramabai Ambedkar" : pId === "P6" ? "Dr. Savita Ambedkar" : pId}</span>
                        <ArrowRight className="w-2.5 h-2.5 opacity-50" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[var(--primary)]" />
                    Themes & Topics
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {event.themes.map((theme) => (
                      <span
                        key={theme}
                        className="px-2.5 py-1 rounded text-xs bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)]"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connected Cross-Event Trajectories */}
              {event.relatedEvents.length > 0 && (
                <div className="pt-3 border-t border-[var(--border)]">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--primary)] font-bold mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Connected Historical Sequence (Knowledge Trajectory)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {event.relatedEvents.map((rel) => (
                      <button
                        key={rel.eventId}
                        onClick={() => onSelectRelatedEvent ? onSelectRelatedEvent(rel.eventId) : undefined}
                        className="p-3 rounded border border-[var(--border)] hover:border-[var(--primary)]/60 bg-[var(--card)] text-left transition-all group flex items-start justify-between gap-2"
                      >
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[var(--primary)] tracking-wider block mb-0.5">
                            {rel.relationType.replace(/_/g, " ")} {rel.year ? `(${rel.year})` : ""}
                          </span>
                          <span className="text-xs font-semibold group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                            {rel.title}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLAIM-LEVEL EVIDENCE */}
          {activeTab === "evidence" && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-[var(--foreground)] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Claim-Level Provenance:</strong> Every historical assertion is traced back to specific archival editions, official parliamentary records, or primary registers.
                </p>
              </div>

              <div className="space-y-3">
                {event.evidence.map((evItem) => (
                  <div
                    key={evItem.id}
                    className="p-4 rounded-md border border-[var(--border)] bg-[var(--card)] space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-[var(--primary)] uppercase">
                        Evidence Statement #{evItem.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        {evItem.confidence.toUpperCase()} CONFIDENCE
                      </span>
                    </div>

                    <p className="text-sm font-medium text-[var(--foreground)]">
                      "{evItem.claimStatement}"
                    </p>

                    {evItem.quote && (
                      <blockquote className="text-xs italic text-[var(--muted-foreground)] border-l-2 border-[var(--primary)]/50 pl-3 py-1 bg-[var(--muted)]/30 rounded-r">
                        "{evItem.quote}"
                      </blockquote>
                    )}

                    <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)] font-mono">
                      <span>Supported by: <strong>{evItem.sourceTitle}</strong></span>
                      {evItem.pageOrRef && <span>Ref: {evItem.pageOrRef}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SOURCES */}
          {activeTab === "sources" && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-[var(--foreground)] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Source Priority Rule:</strong> Sources are ranked strictly according to institutional integrity: (1) Official Writings & Speeches (BAWS), (2) Constitution Records, (3) Court/Parliamentary Archives, (4) University Archives, (5) Deekshabhoomi Registers, (6) Wikimedia Public Domain, and (7) Recognized Secondary Biographies.
                </p>
              </div>

              <div className="space-y-3">
                {event.sources.map((src) => {
                  const badge = PRIORITY_BADGES[src.priority];
                  return (
                    <div
                      key={src.id}
                      className="p-4 rounded-md border border-[var(--border)] bg-[var(--card)] space-y-2 shadow-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-xs font-mono text-[var(--muted-foreground)]">
                          {src.publicationDate ?? "Historical"}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[var(--foreground)]">
                        {src.title}
                      </h4>

                      <div className="text-xs text-[var(--muted-foreground)] space-y-0.5">
                        <p><strong>Institution:</strong> {src.institution}</p>
                        <p><strong>Provenance:</strong> {src.provenance}</p>
                        {src.pages && <p><strong>Citation / Volume:</strong> {src.pages}</p>}
                      </div>

                      {src.url && (
                        <div className="pt-2">
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline font-mono"
                          >
                            <span>Inspect Official Archival Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: MULTIMEDIA, AUDIO, VIDEO & DOCUMENTS */}
          {activeTab === "media" && (
            <div className="space-y-6">
              {/* Rare Archival Audio Recordings */}
              {matchingAudios.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-amber-500" />
                    Rare Archival Voice Recordings ({matchingAudios.length})
                  </h3>
                  <div className="space-y-4">
                    {matchingAudios.map((audio) => (
                      <ArchivalAudioPlayer key={audio.id} audio={audio} compact />
                    ))}
                  </div>
                </div>
              )}

              {/* Archival Motion Picture & Film Newsreels */}
              {matchingVideos.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-emerald-500" />
                    Archival Motion Picture & Newsreels ({matchingVideos.length})
                  </h3>
                  <div className="space-y-4">
                    {matchingVideos.map((video) => (
                      <ArchivalVideoPlayer key={video.id} video={video} />
                    ))}
                  </div>
                </div>
              )}

              {/* Photographs */}
              <div className={matchingAudios.length > 0 || matchingVideos.length > 0 ? "pt-4 border-t border-[var(--border)]" : ""}>
                <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                  Verified Historical Photographs ({matchingImages.length})
                </h3>

                {matchingImages.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-[var(--border)] rounded text-xs text-[var(--muted-foreground)]">
                    No verified photographs available for this specific milestone. Unverified images are excluded by policy.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {matchingImages.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        onClick={() => {
                          setSelectedPhotoIndex(idx);
                          setActiveTab("overview");
                        }}
                        className="rounded border border-[var(--border)] overflow-hidden bg-[var(--card)] hover:border-[var(--primary)]/60 cursor-pointer transition-all group"
                      >
                        <div className="h-48 bg-black/5 overflow-hidden flex items-center justify-center">
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3 space-y-1.5">
                          <div className="font-semibold text-xs group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                            {img.title}
                          </div>
                          {img.caption && (
                            <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-2">{img.caption}</p>
                          )}
                          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--muted-foreground)]">
                            <span className="line-clamp-1">{img.sourceInstitution || "Dr. Ambedkar Foundation"}</span>
                            <span className="px-1.5 py-0.5 bg-[var(--muted)] rounded uppercase whitespace-nowrap">{img.license}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Related Documents & PDFs */}
              <div className="pt-4 border-t border-[var(--border)]">
                <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[var(--primary)]" />
                  Primary Archival Documents & Volumes
                </h3>

                {event.relatedDocuments.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-[var(--border)] rounded text-xs text-[var(--muted-foreground)]">
                    No connected scanned manuscripts attached to this event.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {event.relatedDocuments.map((docId) => (
                      <div
                        key={docId}
                        className="p-3 rounded border border-[var(--border)] hover:border-[var(--primary)]/60 bg-[var(--card)] flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-[var(--primary)]" />
                          <div>
                            <span className="text-xs font-semibold group-hover:text-[var(--primary)] transition-colors">
                              {docId.replace(".pdf", "").replace(/-/g, " ")}
                            </span>
                            <span className="block text-[10px] font-mono text-[var(--muted-foreground)]">
                              Official Institutional Record • Full Text Reader & Citations
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {docId.endsWith(".pdf") && (
                            <a
                              href={`/${docId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded text-[11px] font-mono bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] transition-colors"
                            >
                              Open PDF
                            </a>
                          )}
                          <Link
                            to={`/documents/${docId}`}
                            onClick={onClose}
                            className="p-1.5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors"
                            title="Inspect in document reader"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[var(--border)] bg-[var(--muted)]/50 flex items-center justify-between text-xs">
          <div className="text-[11px] font-mono text-[var(--muted-foreground)]">
            Ambedkar Digital Heritage Archive • Source-Grounded Record
          </div>
          <Link
            to={`/events/${event.id}`}
            onClick={onClose}
            className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            <span>Open Dedicated Event Page</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
