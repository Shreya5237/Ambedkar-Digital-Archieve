import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  FileText,
  ChevronRight,
  X,
} from "lucide-react";
import { getTimeline } from "@/services/api";
import type { TimelineEntry, EventCategory, HistoricalEvent } from "@/types/archive";
import EventDetailModal from "@/components/timeline/EventDetailModal";
import { completeHistoricalEvents } from "@/data/historicalData";
import { allLocalHistoricalImages } from "@/data/historicalImagesData";

// ── Category metadata ────────────────────────────────────────────────────────
const EVENT_TYPE_META: Record<
  EventCategory,
  { label: string; color: string; bg: string }
> = {
  life: { label: "Life & Personal", color: "#c8621a", bg: "#c8621a15" },
  education: { label: "Education", color: "#0284c7", bg: "#0284c715" },
  political: { label: "Political", color: "#1b4f72", bg: "#1b4f7215" },
  legal: { label: "Legal", color: "#2d6a4f", bg: "#2d6a4f15" },
  publication: { label: "Publication", color: "#7d3c98", bg: "#7d3c9815" },
  constitutional: { label: "Constitutional", color: "#c0392b", bg: "#c0392b15" },
  religious: { label: "Religious", color: "#d97706", bg: "#d9770615" },
  labour: { label: "Labour", color: "#059669", bg: "#05966915" },
};

// ── Era ranges ───────────────────────────────────────────────────────────────
const ERAS = [
  { id: "all", label: "All Eras", startYear: 1891, endYear: 1956 },
  { id: "era-1", label: "1891–1912: Birth & Early Life", startYear: 1891, endYear: 1912 },
  { id: "era-2", label: "1913–1923: Columbia & LSE", startYear: 1913, endYear: 1923 },
  { id: "era-3", label: "1924–1932: Movements & Pact", startYear: 1924, endYear: 1932 },
  { id: "era-4", label: "1933–1945: Labour & Politics", startYear: 1933, endYear: 1945 },
  { id: "era-5", label: "1946–1950: Constitution", startYear: 1946, endYear: 1950 },
  { id: "era-6", label: "1951–1956: Final Years", startYear: 1951, endYear: 1956 },
];

// ── Build a lookup: event-id → best local image URL ──────────────────────────
const eventImageMap: Record<string, string> = {};
for (const img of allLocalHistoricalImages) {
  if (img.eventId && !eventImageMap[img.eventId]) {
    eventImageMap[img.eventId] = img.url;
  }
}

// Helper: resolve the best image for an entry
function resolveImage(entry: TimelineEntry): string | undefined {
  // 1. If local image matches by event id, use it
  if (eventImageMap[entry.id]) return eventImageMap[entry.id];
  if (entry.event_id && eventImageMap[entry.event_id]) return eventImageMap[entry.event_id];
  // 2. Fall back to whatever is already on the entry (may be a wikimedia URL)
  return entry.image ?? undefined;
}

export default function TimelinePage() {
  const [selectedEra, setSelectedEra] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModalEvent, setSelectedModalEvent] = useState<HistoricalEvent | null>(null);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["timeline"],
    queryFn: getTimeline,
  });

  // Extract unique locations from all entries for the dropdown
  const locationOptions = useMemo(() => {
    if (!entries) return [];
    const locs = new Set<string>();
    entries.forEach((e) => e.places?.forEach((p) => locs.add(p)));
    return [...locs].sort();
  }, [entries]);

  // ── Filtering logic ──────────────────────────────────────────────────────
  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    return entries.filter((entry) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = [
          entry.title,
          entry.description,
          entry.significance ?? "",
          ...(entry.places ?? []),
          ...(entry.themes ?? []),
          String(entry.year),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Era
      if (selectedEra !== "all") {
        const era = ERAS.find((e) => e.id === selectedEra);
        if (era && (entry.year < era.startYear || entry.year > era.endYear)) return false;
      }
      // Category
      if (selectedCategory !== "all") {
        if (entry.eventType !== selectedCategory) return false;
      }
      // Location
      if (selectedLocation !== "all") {
        if (!entry.places?.includes(selectedLocation)) return false;
      }
      return true;
    });
  }, [entries, searchQuery, selectedEra, selectedCategory, selectedLocation]);

  const decades = useMemo(() => {
    return [...new Set(filteredEntries.map((e) => Math.floor(e.year / 10) * 10))].sort();
  }, [filteredEntries]);

  const openEventModal = (eventId: string) => {
    const fullEvent = completeHistoricalEvents.find(
      (e) => e.id === eventId || e.event_id === eventId
    );
    if (fullEvent) {
      const matchingLocal = allLocalHistoricalImages.filter(
        (img) => img.eventId && (img.eventId === fullEvent.id || img.eventId === fullEvent.event_id)
      );
      const enrichedEvent: HistoricalEvent = {
        ...fullEvent,
        image:
          fullEvent.image ||
          eventImageMap[fullEvent.id] ||
          (matchingLocal[0] ? matchingLocal[0].url : undefined),
        relatedImages:
          fullEvent.relatedImages && fullEvent.relatedImages.length > 0
            ? fullEvent.relatedImages
            : matchingLocal,
      };
      setSelectedModalEvent(enrichedEvent);
    }
  };

  const hasActiveFilters =
    selectedEra !== "all" ||
    selectedCategory !== "all" ||
    selectedLocation !== "all" ||
    searchQuery.trim() !== "";

  const clearAllFilters = () => {
    setSelectedEra("all");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ── Page Heading ────────────────────────────────────────────────── */}
        <div className="space-y-1">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)]">
            Historical Timeline of Dr. B. R. Ambedkar
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {filteredEntries.length} events
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events…"
              className="w-full pl-9 pr-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Era */}
          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className="py-2 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] sm:w-52"
          >
            {ERAS.map((era) => (
              <option key={era.id} value={era.id}>
                {era.label}
              </option>
            ))}
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as EventCategory | "all")}
            className="py-2 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] sm:w-44"
          >
            <option value="all">All Categories</option>
            {Object.entries(EVENT_TYPE_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>

          {/* Location */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="py-2 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] sm:w-44"
          >
            <option value="all">All Locations</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="py-2 px-3 text-xs font-medium rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ── Loading skeleton ────────────────────────────────────────────── */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-[var(--muted)] rounded-md" />
            ))}
          </div>
        )}

        {/* ── Timeline ────────────────────────────────────────────────────── */}
        {!isLoading && (
          <div className="relative">
            {/* Vertical spine */}
            <div className="absolute left-5 sm:left-20 top-0 bottom-0 w-px bg-[var(--border)]" />

            {decades.map((decade) => {
              const decadeEntries = filteredEntries.filter(
                (e) => Math.floor(e.year / 10) * 10 === decade
              );

              return (
                <div key={decade} className="mb-12 relative">
                  {/* Decade marker */}
                  <div className="flex items-center gap-3 mb-6 sticky top-16 z-20 bg-[var(--background)]/95 backdrop-blur-sm py-2">
                    <div className="w-10 sm:w-20 text-right font-display text-xl sm:text-2xl font-bold text-[var(--primary)]">
                      {decade}s
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[var(--primary)] border-[3px] border-[var(--background)] relative z-10" />
                    <div className="h-px flex-1 bg-[var(--border)]" />
                  </div>

                  {/* Event cards */}
                  <div className="space-y-4 pl-7 sm:pl-24">
                    {decadeEntries.map((entry) => {
                      const meta = EVENT_TYPE_META[entry.eventType] ?? EVENT_TYPE_META.life;
                      const imageUrl = resolveImage(entry);

                      return (
                        <div
                          key={entry.id}
                          className="group border border-[var(--border)] rounded-lg bg-[var(--card)] hover:border-[var(--primary)]/40 hover:shadow-sm transition-all"
                        >
                          <div className="p-4 sm:p-5">
                            {/* Top: date + category badge */}
                            <div className="flex items-center gap-2 mb-2 text-xs">
                              <span className="font-mono text-[var(--primary)] font-semibold flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {entry.date}
                              </span>
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                                style={{
                                  borderColor: meta.color + "40",
                                  backgroundColor: meta.bg,
                                  color: meta.color,
                                }}
                              >
                                {meta.label}
                              </span>
                            </div>

                            {/* Title + image row */}
                            <div className="flex gap-4 items-start">
                              <div className="flex-1 min-w-0">
                                <h3
                                  onClick={() => openEventModal(entry.id)}
                                  className="font-display text-base sm:text-lg font-bold leading-snug group-hover:text-[var(--primary)] transition-colors cursor-pointer"
                                >
                                  {entry.title}
                                </h3>
                                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-1.5 line-clamp-2">
                                  {entry.description}
                                </p>
                              </div>

                              {imageUrl && (
                                <div
                                  onClick={() => openEventModal(entry.id)}
                                  className="hidden sm:block w-28 h-20 rounded-md overflow-hidden bg-[var(--muted)] flex-shrink-0 cursor-pointer border border-[var(--border)]"
                                >
                                  <img
                                    src={imageUrl}
                                    alt={entry.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Footer: location, people, docs, action */}
                            <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted-foreground)]">
                              <div className="flex flex-wrap items-center gap-3">
                                {entry.places && entry.places.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                                    {entry.places.join(", ")}
                                  </span>
                                )}
                                {entry.people && entry.people.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
                                    {entry.people.length} People
                                  </span>
                                )}
                                {entry.documentIds && entry.documentIds.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5 text-[var(--primary)]" />
                                    {entry.documentIds.length} Sources
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => openEventModal(entry.id)}
                                className="px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                              >
                                View Details
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {filteredEntries.length === 0 && (
              <div className="text-center py-20 bg-[var(--card)] border border-[var(--border)] rounded-lg">
                <Calendar className="w-10 h-10 mx-auto mb-3 text-[var(--muted-foreground)] opacity-40" />
                <h3 className="font-display text-lg font-bold">No events match your filters</h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 rounded-md text-sm font-medium bg-[var(--primary)] text-[var(--primary-foreground)]"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Event Detail Modal ──────────────────────────────────────────── */}
      {selectedModalEvent && (
        <EventDetailModal
          event={selectedModalEvent}
          onClose={() => setSelectedModalEvent(null)}
          onSelectRelatedEvent={(relId) => openEventModal(relId)}
        />
      )}
    </div>
  );
}
