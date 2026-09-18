import React, { useState } from "react";
import {
  ShieldCheck,
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Tag,
  BookOpen,
  Check,
  AlertCircle,
  Search,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { completeHistoricalEvents, historicalSources } from "@/data/historicalData";
import type { HistoricalEvent, SourcePriority, DatePrecision, TimePrecision, ConfidenceLevel } from "@/types/archive";

export default function HistoricalCurationTab() {
  const [eventsList, setEventsList] = useState<HistoricalEvent[]>(completeHistoricalEvents);
  const [searchFilter, setSearchFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Event Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [year, setYear] = useState(1930);
  const [datePrecision, setDatePrecision] = useState<DatePrecision>("day");
  const [exactTime, setExactTime] = useState("");
  const [hasVerifiedTime, setHasVerifiedTime] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [description, setDescription] = useState("");
  const [significance, setSignificance] = useState("");
  const [people, setPeople] = useState("Dr. B. R. Ambedkar");
  const [themes, setThemes] = useState("Social Justice, Civil Rights");
  const [confidence, setConfidence] = useState<ConfidenceLevel>("verified");
  const [claimStatement, setClaimStatement] = useState("");
  const [claimSourceTitle, setClaimSourceTitle] = useState("Dr. Babasaheb Ambedkar: Writings and Speeches (BAWS)");
  const [sourcePriority, setSourcePriority] = useState<SourcePriority>(1);
  const [sourceInstitution, setSourceInstitution] = useState("Dr. Ambedkar Foundation / Ministry of Social Justice");

  const filteredEvents = eventsList.filter((e) =>
    [e.title, e.description, ...(e.places ?? [])].join(" ").toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    const newId = `EV-${year}-${title.slice(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, "-")}`;
    const newEvent: HistoricalEvent = {
      id: newId,
      event_id: newId,
      title: title.trim(),
      startDate: date,
      date: date,
      year: Number(year),
      datePrecision,
      time: {
        value: hasVerifiedTime && exactTime.trim() ? exactTime.trim() : null,
        precision: hasVerifiedTime ? "exact" : "unknown",
        note: hasVerifiedTime ? undefined : "Time: Not documented in verified sources.",
      },
      description: description.trim(),
      significance: significance.trim(),
      places: [locationName || "India"],
      locationDetails: {
        id: `LOC-${newId}`,
        name: locationName || "India",
        siteName: siteName || undefined,
        country: "India",
      },
      people: people.split(",").map((p) => p.trim()),
      themes: themes.split(",").map((t) => t.trim()),
      topics: ["T1", "T2"],
      relatedDocuments: [],
      documents: [],
      relatedImages: [],
      relatedEvents: [],
      evidence: claimStatement.trim()
        ? [
            {
              id: `EVID-${newId}`,
              claimStatement: claimStatement.trim(),
              sourceId: `SRC-${newId}`,
              sourceTitle: claimSourceTitle,
              confidence,
            },
          ]
        : [],
      sources: [
        {
          id: `SRC-${newId}`,
          title: claimSourceTitle,
          sourceType: "official_archive",
          institution: sourceInstitution,
          confidence,
          provenance: "Curated submission through Institution Portal",
          priority: sourcePriority,
        },
      ],
      confidence,
      eventType: "political",
      trajectory: "general",
    };

    setEventsList([newEvent, ...eventsList]);
    setShowAddForm(false);
    setSuccessMessage(`Event "${title}" successfully curated into digital heritage archive!`);
    setTimeout(() => setSuccessMessage(null), 4000);

    // Reset Form
    setTitle("");
    setDate("");
    setDescription("");
    setSignificance("");
    setClaimStatement("");
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--primary)] font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Verified Curator Console
          </div>
          <h2 className="text-xl font-display font-bold">Historical Heritage & Evidence Curation</h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Audit, curate, and append historical events, claim-level provenance, and prioritized primary institutional citations.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded text-xs font-mono font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? "Close Form" : "Curate New Event"}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* New Event Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddEvent}
          className="p-6 bg-[var(--card)] border border-[var(--primary)]/40 rounded-md space-y-5 shadow-md animate-fadeIn"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="font-display font-bold text-base text-[var(--foreground)]">
              Curate Historical Event & Claim-Level Provenance
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-mono font-bold text-[var(--muted-foreground)]">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mahad Satyagraha / Chavdar Tank action"
                className="w-full px-3 py-2 text-xs bg-[var(--background)] border border-[var(--border)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[var(--muted-foreground)]">
                Year *
              </label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={1891}
                max={1956}
                className="w-full px-3 py-2 text-xs bg-[var(--background)] border border-[var(--border)] rounded font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[var(--muted-foreground)]">
                Date String (Formatted) *
              </label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. 20 Mar 1927 or Nov 1900"
                className="w-full px-3 py-2 text-xs bg-[var(--background)] border border-[var(--border)] rounded font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[var(--muted-foreground)]">
                Date Precision
              </label>
              <select
                value={datePrecision}
                onChange={(e) => setDatePrecision(e.target.value as DatePrecision)}
                className="w-full px-3 py-2 text-xs bg-[var(--background)] border border-[var(--border)] rounded font-mono"
              >
                <option value="day">Day (Exact day verified)</option>
                <option value="month">Month (Month & Year)</option>
                <option value="year">Year (Year only)</option>
                <option value="approximate">Approximate</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[var(--muted-foreground)]">
                Confidence Rating
              </label>
              <select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value as ConfidenceLevel)}
                className="w-full px-3 py-2 text-xs bg-[var(--background)] border border-[var(--border)] rounded font-mono"
              >
                <option value="verified">Verified Archival Record</option>
                <option value="high">High Confidence</option>
                <option value="medium">Medium Confidence</option>
              </select>
            </div>
          </div>

          {/* Time Precision Checkbox */}
          <div className="p-3 bg-[var(--muted)]/40 border border-[var(--border)] rounded space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasVerifiedTime"
                checked={hasVerifiedTime}
                onChange={(e) => setHasVerifiedTime(e.target.checked)}
                className="rounded text-[var(--primary)]"
              />
              <label htmlFor="hasVerifiedTime" className="text-xs font-semibold cursor-pointer">
                Does this event have an exact verified clock time in primary records?
              </label>
            </div>

            {hasVerifiedTime ? (
              <div className="pt-2">
                <input
                  type="text"
                  value={exactTime}
                  onChange={(e) => setExactTime(e.target.value)}
                  placeholder="e.g. 11:30 AM IST"
                  className="w-full sm:w-64 px-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--border)] rounded font-mono"
                />
              </div>
            ) : (
              <p className="text-[11px] text-[var(--muted-foreground)] italic">
                Platform Standard applied: Time will be recorded as null and displayed as: <strong>"Time: Not documented in verified sources."</strong>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[var(--muted-foreground)]">
                Location Name (City / Region)
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Mahad, Maharashtra"
                className="w-full px-3 py-2 text-xs bg-[var(--background)] border border-[var(--border)] rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[var(--muted-foreground)]">
                Specific Landmark / Site
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="e.g. Chavdar Public Tank"
                className="w-full px-3 py-2 text-xs bg-[var(--background)] border border-[var(--border)] rounded"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--muted-foreground)]">
              Historical Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Factual historical description grounded in archival evidence..."
              className="w-full px-3 py-2 text-xs bg-[var(--background)] border border-[var(--border)] rounded leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--muted-foreground)]">
              Historical Significance
            </label>
            <textarea
              rows={2}
              value={significance}
              onChange={(e) => setSignificance(e.target.value)}
              placeholder="Constitutional, legal, or social significance of this milestone..."
              className="w-full px-3 py-2 text-xs bg-[var(--background)] border border-[var(--border)] rounded text-xs"
            />
          </div>

          {/* Claim-Level Evidence */}
          <div className="p-4 bg-[var(--muted)]/40 border border-[var(--border)] rounded space-y-3">
            <div className="font-mono text-xs uppercase font-bold text-[var(--primary)] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Claim-Level Provenance & Source Hierarchy
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-[var(--muted-foreground)]">
                Specific Claim Statement to Verify
              </label>
              <input
                type="text"
                value={claimStatement}
                onChange={(e) => setClaimStatement(e.target.value)}
                placeholder="e.g. On 20 March 1927 Ambedkar drew water from Chavdar Tank affirming civil rights."
                className="w-full px-3 py-2 text-xs bg-[var(--background)] border border-[var(--border)] rounded"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-mono text-[var(--muted-foreground)]">
                  Primary Source Title & Volume
                </label>
                <input
                  type="text"
                  value={claimSourceTitle}
                  onChange={(e) => setClaimSourceTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--border)] rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[var(--muted-foreground)]">
                  Source Priority
                </label>
                <select
                  value={sourcePriority}
                  onChange={(e) => setSourcePriority(Number(e.target.value) as SourcePriority)}
                  className="w-full px-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--border)] rounded font-mono"
                >
                  <option value={1}>1 - Dr. Ambedkar Foundation / BAWS</option>
                  <option value={2}>2 - Constitution Primary Records</option>
                  <option value={3}>3 - Court & Parliament Archives</option>
                  <option value={4}>4 - Columbia / LSE Archives</option>
                  <option value={5}>5 - Deekshabhoomi Records</option>
                  <option value={6}>6 - Wikimedia Commons</option>
                  <option value={7}>7 - Secondary Source</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded text-xs font-mono border border-[var(--border)] hover:bg-[var(--muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded text-xs font-mono font-bold bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
            >
              Submit to Verified Corpus
            </button>
          </div>
        </form>
      )}

      {/* Existing Curated Events Table */}
      <div className="border border-[var(--border)] rounded-md bg-[var(--card)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--muted)]/30">
          <div className="font-display font-bold text-sm">
            Curated Historical Records Repository ({filteredEvents.length} Events)
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter repository…"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--border)] rounded"
            />
          </div>
        </div>

        <div className="divide-y divide-[var(--border)] max-h-96 overflow-y-auto">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 hover:bg-[var(--muted)]/40 transition-colors flex items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[var(--primary)]">
                    {event.date}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-[var(--muted)] rounded border border-[var(--border)]">
                    {event.eventType}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    {event.confidence.toUpperCase()}
                  </span>
                  {event.time.value === null && (
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 italic">
                      Time: unrecorded
                    </span>
                  )}
                </div>
                <div className="font-semibold text-xs text-[var(--foreground)] truncate">
                  {event.title}
                </div>
                <div className="text-[11px] text-[var(--muted-foreground)] truncate">
                  {event.places.join(", ")} • {event.sources.length} sources • {event.evidence.length} claims
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] font-bold">
                  {event.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
