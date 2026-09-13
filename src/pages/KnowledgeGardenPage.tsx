import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  Sprout,
  ArrowUpDown,
  Grid3X3,
  List,
  X,
  Loader2,
  AlertCircle,
  BookOpen,
  Search,
  MessageSquare,
} from "lucide-react";
import { searchArchive } from "@/services/api";
import type { ArchiveItem, FilterObject, SortOption } from "@/types/archive";
import FilterPanel from "@/components/garden/FilterPanel";
import ResultCard from "@/components/garden/ResultCard";
import ItemModal from "@/components/garden/ItemModal";
import { topics as allTopics } from "@/data/mockData";

const DEFAULT_FILTERS: FilterObject = {
  contentTypes: [],
  languages: [],
  yearFrom: "",
  yearTo: "",
  decade: "",
  historicalPeriod: "",
  todayInHistory: false,
  country: "",
  state: "",
  city: "",
  topicIds: [],
  personIds: [],
  keywords: "",
  theme: "",
  hasAudioDescription: false,
  hasCaptions: false,
  highContrast: false,
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "title-asc", label: "Title A–Z" },
];

// Convert FilterObject → SearchFilters for the API
function toSearchFilters(f: FilterObject) {
  return {
    keywords: f.keywords || undefined,
    query: f.keywords || undefined,
    language: f.languages.length === 1 ? (f.languages[0] as any) : undefined,
    contentType: f.contentTypes.length === 1 ? (f.contentTypes[0] as any) : undefined,
    topicId: f.topicIds.length === 1 ? f.topicIds[0] : undefined,
    yearFrom: f.yearFrom ? Number(f.yearFrom) : undefined,
    yearTo: f.yearTo ? Number(f.yearTo) : undefined,
    decade: f.decade || undefined,
    todayInHistory: f.todayInHistory || undefined,
    country: f.country || undefined,
    state: f.state || undefined,
    city: f.city || undefined,
    hasAudioDescription: f.hasAudioDescription || undefined,
    hasCaptions: f.hasCaptions || undefined,
  };
}

// Active filter chip label helpers
function activeFilterChips(f: FilterObject): { key: string; label: string }[] {
  const chips: { key: string; label: string }[] = [];
  if (f.keywords) chips.push({ key: "keywords", label: `"${f.keywords}"` });
  f.contentTypes.forEach((ct) => chips.push({ key: `ct:${ct}`, label: ct }));
  f.languages.forEach((l) => chips.push({ key: `lang:${l}`, label: l.toUpperCase() }));
  if (f.yearFrom) chips.push({ key: "yearFrom", label: `From ${f.yearFrom}` });
  if (f.yearTo) chips.push({ key: "yearTo", label: `To ${f.yearTo}` });
  if (f.decade) chips.push({ key: "decade", label: `${f.decade}s` });
  if (f.historicalPeriod) chips.push({ key: "period", label: f.historicalPeriod });
  if (f.todayInHistory) chips.push({ key: "today", label: "Today in History" });
  if (f.country) chips.push({ key: "country", label: f.country });
  f.topicIds.forEach((tid) => {
    const t = allTopics.find((t) => t.id === tid);
    if (t) chips.push({ key: `topic:${tid}`, label: t.label });
  });
  if (f.theme) chips.push({ key: "theme", label: f.theme });
  if (f.hasAudioDescription) chips.push({ key: "audioDesc", label: "Audio Description" });
  if (f.hasCaptions) chips.push({ key: "captions", label: "Captions" });
  return chips;
}

export default function KnowledgeGardenPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterObject>(() => ({
    ...DEFAULT_FILTERS,
    // Hydrate keywords from ?q= URL param (forwarded from old /search links)
    keywords: searchParams.get("q") ?? "",
  }));
  const [sort, setSort] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  // Local search input state for the top search bar
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  // Hydrate from URL on mount only
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchInput(q);
      setFilters((prev) => ({ ...prev, keywords: q }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["garden-search", filters, sort],
    queryFn: () => searchArchive(toSearchFilters(filters), sort),
    staleTime: 30_000,
  });

  const handleFilterChange = useCallback((newFilters: FilterObject) => {
    setFilters(newFilters);
    // Keep search input in sync with filter keywords
    setSearchInput(newFilters.keywords);
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSort("relevance");
    setSearchInput("");
  }, []);

  // Submit from the top search bar
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, keywords: searchInput }));
  };

  const removeChip = (key: string) => {
    setFilters((prev) => {
      let next: FilterObject;
      if (key === "keywords") { next = { ...prev, keywords: "" }; setSearchInput(""); return next; }
      if (key.startsWith("ct:")) return { ...prev, contentTypes: prev.contentTypes.filter((c) => `ct:${c}` !== key) };
      if (key.startsWith("lang:")) return { ...prev, languages: prev.languages.filter((l) => `lang:${l}` !== key) };
      if (key === "yearFrom") return { ...prev, yearFrom: "" };
      if (key === "yearTo") return { ...prev, yearTo: "" };
      if (key === "decade") return { ...prev, decade: "" };
      if (key === "period") return { ...prev, historicalPeriod: "" };
      if (key === "today") return { ...prev, todayInHistory: false };
      if (key === "country") return { ...prev, country: "" };
      if (key.startsWith("topic:")) return { ...prev, topicIds: prev.topicIds.filter((t) => `topic:${t}` !== key) };
      if (key === "theme") return { ...prev, theme: "" };
      if (key === "audioDesc") return { ...prev, hasAudioDescription: false };
      if (key === "captions") return { ...prev, hasCaptions: false };
      return prev;
    });
  };

  const docs = data?.documents ?? [];
  const chips = activeFilterChips(filters);

  return (
    <div className={`max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${filters.highContrast ? "high-contrast" : ""}`}>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sprout className="w-5 h-5 text-[var(--primary)]" />
          <h1 className="font-display text-3xl font-semibold">Knowledge Garden</h1>
        </div>
        <p className="text-sm text-[var(--muted-foreground)] max-w-xl">
          Explore, filter and discover the full breadth of Dr. Ambedkar's writings, speeches,
          photographs, and historical records across the archive.
        </p>
      </div>

      {/* Prominent search bar */}
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              id="garden-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search documents, speeches, letters, photographs…"
              className="w-full pl-11 pr-10 py-3.5 bg-[var(--card)] border border-[var(--border)] rounded-sm text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(""); setFilters((prev) => ({ ...prev, keywords: "" })); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--muted)] rounded-sm transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium rounded-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
          {/* Ask the Archive CTA */}
          <Link
            to={searchInput ? `/ask?q=${encodeURIComponent(searchInput)}` : "/ask"}
            className="px-4 py-3.5 border border-[var(--primary)]/40 bg-[var(--primary)]/5 text-[var(--primary)] text-sm font-medium rounded-sm hover:bg-[var(--primary)]/10 transition-colors flex items-center gap-2 whitespace-nowrap"
            title="Ask the Archive with AI"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </Link>
        </form>
      </div>

      <div className="flex gap-6 items-start">
        {/* Filter panel */}
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          resultCount={docs.length}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Active filter chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 flex-1">
                {chips.map((chip) => (
                  <span
                    key={chip.key}
                    className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[var(--primary)] rounded-sm"
                  >
                    {chip.label}
                    <button onClick={() => removeChip(chip.key)} aria-label={`Remove ${chip.label} filter`}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleReset}
                  className="text-[10px] font-mono text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {/* Sort */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="text-xs bg-[var(--card)] border border-[var(--border)] rounded-sm px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* View toggle */}
              <div className="flex border border-[var(--border)] rounded-sm overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 ${viewMode === "grid" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"} transition-colors`}
                  title="Grid view"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 ${viewMode === "list" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"} transition-colors`}
                  title="List view"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin mr-3" />
              <span className="text-sm text-[var(--muted-foreground)]">Searching the archive…</span>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex items-center gap-3 py-12 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">Failed to load results. Please try again.</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && docs.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-10 h-10 mx-auto mb-4 text-[var(--border)]" />
              <h3 className="font-display text-lg font-semibold mb-2">No records found</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Try adjusting or removing some filters.
              </p>
              <button
                onClick={handleReset}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* Results */}
          {!isLoading && !isError && docs.length > 0 && (
            <>
              <p className="text-[11px] font-mono text-[var(--muted-foreground)] mb-4">
                {docs.length} record{docs.length !== 1 ? "s" : ""} found
              </p>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {docs.map((item) => (
                    <ResultCard
                      key={item.id}
                      item={item}
                      onClick={setSelectedItem}
                      highContrast={filters.highContrast}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {docs.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="w-full text-left border border-[var(--border)] rounded-sm p-4 bg-[var(--card)] hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        {item.thumbnailUrl && (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-sm flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-sm font-semibold group-hover:text-[var(--primary)] transition-colors mb-0.5 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[var(--muted-foreground)] mb-1">{item.author} · {item.year}</p>
                          <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">{item.summary}</p>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--primary)] border border-[var(--primary)]/30 px-1.5 py-0.5 rounded-sm flex-shrink-0">
                          {item.contentType.replace("_", " ")}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Footer link to Knowledge Explorer graph */}
              <div className="mt-8 pt-5 border-t border-[var(--border)] text-center">
                <p className="text-xs text-[var(--muted-foreground)] mb-2">
                  Want to explore connections between entities?
                </p>
                <Link
                  to="/knowledge-explorer"
                  className="text-sm text-[var(--primary)] hover:underline font-medium"
                >
                  Open Knowledge Graph Explorer →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Item modal */}
      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
