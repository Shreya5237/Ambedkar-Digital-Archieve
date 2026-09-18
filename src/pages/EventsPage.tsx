import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  FileText,
  ArrowRight,
  MapPin,
  Users,
  Clock,
  ShieldCheck,
  Tag,
  BookOpen,
  Sparkles,
  ExternalLink,
  Award,
  AlertCircle,
  Share2,
  Check,
  Search,
} from "lucide-react";
import { getFeaturedEvents, getEvent } from "@/services/api";
import type { SourcePriority, EventCategory, HistoricalTrajectory } from "@/types/archive";

const PRIORITY_BADGES: Record<SourcePriority, { label: string; bg: string; text: string }> = {
  1: { label: "Priority 1 • Dr. Ambedkar Foundation / BAWS", bg: "bg-blue-900/15 border-blue-600/30", text: "text-blue-700 dark:text-blue-400" },
  2: { label: "Priority 2 • Constitution Primary Records", bg: "bg-emerald-900/15 border-emerald-600/30", text: "text-emerald-700 dark:text-emerald-400" },
  3: { label: "Priority 3 • Parliamentary & Court Archives", bg: "bg-indigo-900/15 border-indigo-600/30", text: "text-indigo-700 dark:text-indigo-400" },
  4: { label: "Priority 4 • Columbia / LSE University Archives", bg: "bg-purple-900/15 border-purple-600/30", text: "text-purple-700 dark:text-purple-400" },
  5: { label: "Priority 5 • Deekshabhoomi Institutional Records", bg: "bg-amber-900/15 border-amber-600/30", text: "text-amber-700 dark:text-amber-400" },
  6: { label: "Priority 6 • Wikimedia Commons Archival", bg: "bg-cyan-900/15 border-cyan-600/30", text: "text-cyan-700 dark:text-cyan-400" },
  7: { label: "Priority 7 • Scholarly Secondary Source", bg: "bg-slate-900/15 border-slate-600/30", text: "text-slate-700 dark:text-slate-400" },
};

const TRAJECTORY_NAMES: Record<HistoricalTrajectory, string> = {
  mahad_movement: "Mahad Movement",
  constitutional_journey: "Constitutional Journey",
  religious_liberation: "Religious Liberation & Buddhism",
  gender_equality: "Gender Equality & Hindu Code",
  education_early_life: "Education & Early Life",
  labour_reforms: "Labour & Social Security",
  general: "General Lifespan",
};

export function EventsListPage() {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedTrajectory, setSelectedTrajectory] = useState<string>("all");

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getFeaturedEvents,
  });

  const filtered = (events ?? []).filter((e) => {
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      const haystack = [
        e.title,
        e.description,
        e.significance,
        ...(e.places ?? []),
        ...(e.themes ?? []),
        String(e.year),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (selectedTrajectory !== "all" && e.trajectory !== selectedTrajectory) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="border border-[var(--border)] rounded-md p-6 bg-[var(--card)] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--primary)] mb-2">
              <Calendar className="w-4 h-4" />
              Source-Grounded Archival Corpus
            </div>
            <h1 className="font-display text-3xl font-bold">Historical Events (1891–1956)</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Every event is mapped with spatial coordinates, claim-level provenance, and primary institutional sources.
            </p>
          </div>

          <Link
            to="/timeline"
            className="px-4 py-2 text-xs font-mono font-bold bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:opacity-90 transition-opacity flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Switch to Chronological Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search historical events by title, date, place, or concept…"
              className="w-full pl-9 pr-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

          <div className="sm:w-64">
            <select
              value={selectedTrajectory}
              onChange={(e) => setSelectedTrajectory(e.target.value)}
              className="w-full py-2 px-3 bg-[var(--background)] border border-[var(--border)] rounded text-xs font-mono"
            >
              <option value="all">All Trajectories ({events?.length ?? 0})</option>
              {Object.entries(TRAJECTORY_NAMES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-[var(--muted)] rounded-md" />)}
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {filtered.map((event) => {
          const hasExactTime = event.time && event.time.value !== null;
          return (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group flex flex-col sm:flex-row gap-5 border border-[var(--border)] rounded-md p-5 sm:p-6 hover:border-[var(--primary)]/60 hover:bg-[var(--card)] hover:shadow-md transition-all"
            >
              {event.image && (
                <div className="w-full sm:w-36 h-28 flex-shrink-0 rounded overflow-hidden bg-[var(--muted)] border border-[var(--border)]">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <span className="font-mono text-xs font-bold text-[var(--primary)] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {event.date}
                  </span>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]">
                    {event.eventType}
                  </span>

                  {event.trajectory && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] font-semibold">
                      {TRAJECTORY_NAMES[event.trajectory] ?? event.trajectory}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    VERIFIED RECORD
                  </span>

                  <span className="text-[11px] font-mono text-[var(--muted-foreground)] ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {hasExactTime ? event.time.value : "Time: Not documented in verified sources."}
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold mb-1.5 group-hover:text-[var(--primary)] transition-colors">
                  {event.title}
                </h3>

                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed mb-3">
                  {event.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                  {event.places && event.places.length > 0 && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--primary)]" />
                      {event.places.join(", ")}
                    </span>
                  )}

                  {event.people && event.people.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[var(--primary)]" />
                      {event.people.length} figures
                    </span>
                  )}

                  {event.relatedDocuments && event.relatedDocuments.length > 0 && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[var(--primary)]" />
                      {event.relatedDocuments.length} documents
                    </span>
                  )}

                  {event.evidence && event.evidence.length > 0 && (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      {event.evidence.length} claims
                    </span>
                  )}
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-[var(--muted-foreground)] self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 hidden sm:block" />
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center border border-[var(--border)] rounded bg-[var(--card)] text-sm text-[var(--muted-foreground)]">
            No events match the search query.
          </div>
        )}
      </div>
    </div>
  );
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id!),
    enabled: !!id,
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-8 bg-[var(--muted)] rounded w-1/3" />
        <div className="h-64 bg-[var(--muted)] rounded" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)] opacity-50" />
        <h2 className="font-display text-2xl font-bold">Event Not Found</h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-2">
          The requested event record "{id}" does not exist in the verified digital heritage archive.
        </p>
        <Link to="/events" className="mt-4 inline-block text-xs font-mono text-[var(--primary)] hover:underline">
          Return to All Historical Events ➔
        </Link>
      </div>
    );
  }

  const hasExactTime = event.time && event.time.value !== null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)]">
        <div className="flex items-center gap-2">
          <Link to="/timeline" className="hover:text-[var(--primary)] transition-colors">Timeline</Link>
          <span>/</span>
          <Link to="/events" className="hover:text-[var(--primary)] transition-colors">Events</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">{event.id}</span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] text-xs transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? "Link Copied" : "Share Event"}</span>
        </button>
      </div>

      {/* Main Historical Header */}
      <div className="border border-[var(--border)] rounded-md p-6 sm:p-8 bg-[var(--card)] space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--primary)] px-2.5 py-0.5 rounded bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            {event.eventType}
          </span>
          <span className="font-mono text-xs font-bold text-[var(--primary)] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {event.date} ({event.datePrecision.toUpperCase()} PRECISION)
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            {event.confidence.toUpperCase()} CONFIDENCE
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-[var(--foreground)]">
          {event.title}
        </h1>

        {/* Strict Time Standard Banner */}
        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-[var(--foreground)] font-mono">
          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span>
            <strong>Archival Time Status: </strong>
            <span className={hasExactTime ? "text-[var(--foreground)]" : "italic text-amber-700 dark:text-amber-400 font-semibold"}>
              {hasExactTime ? event.time.value : "Time: Not documented in verified sources."}
            </span>
          </span>
        </div>

        {/* Location & Map Coordinates */}
        {event.locationDetails && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded bg-[var(--muted)]/40 border border-[var(--border)]">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-[var(--foreground)]">
                  {event.locationDetails.siteName ? `${event.locationDetails.siteName}, ` : ""}
                  {event.locationDetails.name}, {event.locationDetails.country}
                </span>
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

        {/* Featured Image */}
        {event.image && (
          <div className="rounded-md overflow-hidden border border-[var(--border)] bg-black/5">
            <img src={event.image} alt={event.title} className="w-full max-h-96 object-cover" />
            {event.relatedImages.length > 0 && (
              <div className="p-3 text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/40 border-t border-[var(--border)] flex items-center justify-between">
                <span>{event.relatedImages[0].caption}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-[var(--card)] rounded uppercase">
                  {event.relatedImages[0].license}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Historical Account Description */}
        <div className="space-y-2 pt-2">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-bold">
            Historical Description
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-[var(--foreground)] whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Significance Statement */}
        <div className="p-4 rounded-md bg-[var(--primary)]/5 border-l-4 border-[var(--primary)] space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[var(--primary)] font-bold">
            <Award className="w-4 h-4" />
            Historical Significance
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[var(--foreground)]">
            {event.significance}
          </p>
        </div>
      </div>

      {/* People, Themes & Connected Historical Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Figures */}
        <div className="border border-[var(--border)] rounded-md p-5 bg-[var(--card)] space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-bold flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[var(--primary)]" />
            Documented Historical Figures
          </h3>
          <div className="space-y-2">
            {event.people.map((pId) => (
              <Link
                key={pId}
                to={`/people/${pId}`}
                className="p-2.5 rounded border border-[var(--border)] hover:border-[var(--primary)] flex items-center justify-between text-xs transition-colors group"
              >
                <span className="font-semibold group-hover:text-[var(--primary)]">
                  {pId === "P1" ? "Dr. B. R. Ambedkar" : pId === "P2" ? "Mahatma Gandhi" : pId === "P3" ? "Jawaharlal Nehru" : pId === "P5" ? "Ramabai Ambedkar" : pId === "P6" ? "Dr. Savita Ambedkar" : pId}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
              </Link>
            ))}
          </div>
        </div>

        {/* Themes */}
        <div className="border border-[var(--border)] rounded-md p-5 bg-[var(--card)] space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-bold flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[var(--primary)]" />
            Archival Themes
          </h3>
          <div className="flex flex-wrap gap-2">
            {event.themes.map((theme) => (
              <span
                key={theme}
                className="px-3 py-1 rounded text-xs bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] font-medium"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Connected Trajectories (Cross-Event Links) */}
      {event.relatedEvents && event.relatedEvents.length > 0 && (
        <div className="border border-[var(--border)] rounded-md p-6 bg-[var(--card)] space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--primary)] font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Connected Historical Trajectories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {event.relatedEvents.map((rel) => (
              <Link
                key={rel.eventId}
                to={`/events/${rel.eventId}`}
                className="p-3.5 rounded border border-[var(--border)] hover:border-[var(--primary)] bg-[var(--background)] group transition-all"
              >
                <span className="font-mono text-[10px] uppercase text-[var(--primary)] tracking-wider block mb-1">
                  {rel.relationType.replace(/_/g, " ")} {rel.year ? `(${rel.year})` : ""}
                </span>
                <span className="text-xs font-bold group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                  {rel.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CLAIM-LEVEL EVIDENCE SECTION */}
      {event.evidence && event.evidence.length > 0 && (
        <div className="border border-[var(--border)] rounded-md p-6 bg-[var(--card)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Claim-Level Provenance ({event.evidence.length} Statements)
            </h3>
            <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
              Auditable Archival Backing
            </span>
          </div>

          <div className="space-y-3">
            {event.evidence.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded border border-[var(--border)] bg-[var(--background)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[var(--primary)]">
                    STATEMENT #{ev.id}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    {ev.confidence.toUpperCase()} CONFIDENCE
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">
                  "{ev.claimStatement}"
                </p>

                {ev.quote && (
                  <blockquote className="text-xs italic text-[var(--muted-foreground)] border-l-2 border-[var(--primary)] pl-3 py-1 bg-[var(--muted)]/30 rounded-r">
                    "{ev.quote}"
                  </blockquote>
                )}

                <div className="pt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-between text-xs text-[var(--muted-foreground)] font-mono">
                  <span>Source: <strong>{ev.sourceTitle}</strong></span>
                  {ev.pageOrRef && <span>Citation: {ev.pageOrRef}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VERIFIED SOURCES SECTION */}
      {event.sources && event.sources.length > 0 && (
        <div className="border border-[var(--border)] rounded-md p-6 bg-[var(--card)] space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-bold flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[var(--primary)]" />
            Verified Source References (Prioritized Hierarchy)
          </h3>

          <div className="space-y-3">
            {event.sources.map((src) => {
              const badge = PRIORITY_BADGES[src.priority];
              return (
                <div
                  key={src.id}
                  className="p-4 rounded border border-[var(--border)] bg-[var(--background)] space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-mono text-[var(--muted-foreground)]">
                      {src.publicationDate ?? "Historical"}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-[var(--foreground)]">
                    {src.title}
                  </h4>

                  <div className="text-xs text-[var(--muted-foreground)] space-y-0.5 font-mono">
                    <p>Institution: {src.institution}</p>
                    <p>Provenance: {src.provenance}</p>
                    {src.pages && <p>Reference: {src.pages}</p>}
                  </div>

                  {src.url && (
                    <div className="pt-2">
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline font-mono"
                      >
                        <span>View Verified Official Archive</span>
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

      {/* Connected Archival Documents Shelf */}
      {event.relatedDocuments && event.relatedDocuments.length > 0 && (
        <div className="border border-[var(--border)] rounded-md p-6 bg-[var(--card)] space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-bold flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[var(--primary)]" />
            Primary Archival Documents
          </h3>

          <div className="space-y-2.5">
            {event.relatedDocuments.map((docId) => (
              <Link
                key={docId}
                to={`/documents/${docId}`}
                className="p-3.5 rounded border border-[var(--border)] hover:border-[var(--primary)] bg-[var(--background)] flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[var(--primary)]" />
                  <div>
                    <span className="text-xs font-bold group-hover:text-[var(--primary)] transition-colors">
                      {docId.replace(".pdf", "").replace(/-/g, " ")}
                    </span>
                    <span className="block text-[10px] font-mono text-[var(--muted-foreground)]">
                      Open full text reader & multilingual translations
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
