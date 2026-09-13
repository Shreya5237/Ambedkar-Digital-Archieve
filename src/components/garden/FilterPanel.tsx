import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import type { FilterObject } from "@/types/archive";
import { topics as allTopics } from "@/data/mockData";

interface FilterPanelProps {
  filters: FilterObject;
  onChange: (filters: FilterObject) => void;
  onReset: () => void;
  resultCount: number;
}

const CONTENT_TYPES = [
  { value: "book", label: "Book" },
  { value: "speech", label: "Speech" },
  { value: "essay", label: "Essay" },
  { value: "article", label: "Article" },
  { value: "letter", label: "Letter" },
  { value: "legal_document", label: "Legal Document" },
  { value: "photograph", label: "Photograph" },
  { value: "manuscript", label: "Manuscript" },
  { value: "interview", label: "Interview" },
  { value: "telegram", label: "Telegram" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "mr", label: "Marathi" },
  { value: "ta", label: "Tamil" },
];

const DECADES = [
  { value: "1900", label: "1900s" },
  { value: "1910", label: "1910s" },
  { value: "1920", label: "1920s" },
  { value: "1930", label: "1930s" },
  { value: "1940", label: "1940s" },
  { value: "1950", label: "1950s" },
  { value: "1960", label: "1960s" },
];

const HISTORICAL_PERIODS = [
  { value: "colonial", label: "Colonial Era (pre-1947)" },
  { value: "independence", label: "Independence Era (1947–1956)" },
  { value: "posthumous", label: "Posthumous Works" },
];

const THEMES = [
  { value: "democracy", label: "Democracy" },
  { value: "caste", label: "Caste System" },
  { value: "constitution", label: "Constitutional Law" },
  { value: "buddhism", label: "Buddhism" },
  { value: "women", label: "Women's Rights" },
  { value: "labour", label: "Labour Rights" },
  { value: "education", label: "Education" },
];

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}
function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="kg-filter-section">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-2 text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

export default function FilterPanel({ filters, onChange, onReset, resultCount }: FilterPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = <K extends keyof FilterObject>(
    key: K,
    value: FilterObject[K] extends string[] ? string : never
  ) => {
    const arr = (filters[key] as string[]) ?? [];
    onChange({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  const set = <K extends keyof FilterObject>(key: K, value: FilterObject[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const activeCount = [
    filters.contentTypes.length > 0,
    filters.languages.length > 0,
    filters.yearFrom !== "",
    filters.yearTo !== "",
    filters.decade !== "",
    filters.historicalPeriod !== "",
    filters.todayInHistory,
    filters.country !== "",
    filters.topicIds.length > 0,
    filters.personIds.length > 0,
    filters.keywords !== "",
    filters.theme !== "",
    filters.hasAudioDescription,
    filters.hasCaptions,
  ].filter(Boolean).length;

  const panelContent = (
    <div className="space-y-0.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--primary)]" />
          <span className="font-display font-semibold text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="kg-badge">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <div className="text-[10px] font-mono text-[var(--muted-foreground)] mb-4">
        {resultCount} result{resultCount !== 1 ? "s" : ""} found
      </div>

      {/* Keyword */}
      <Section title="Keywords" defaultOpen>
        <input
          type="text"
          placeholder="Search within results…"
          value={filters.keywords}
          onChange={(e) => set("keywords", e.target.value)}
          className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
        />
      </Section>

      <div className="rule my-1" />

      {/* Content Type */}
      <Section title="Content Type">
        <div className="grid grid-cols-1 gap-1">
          {CONTENT_TYPES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.contentTypes.includes(value)}
                onChange={() => toggle("contentTypes", value)}
                className="w-3.5 h-3.5 accent-[var(--primary)]"
              />
              <span className="text-xs text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <div className="rule my-1" />

      {/* Language */}
      <Section title="Language">
        <div className="flex flex-wrap gap-1.5">
          {LANGUAGES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggle("languages", value)}
              className={`kg-chip ${filters.languages.includes(value) ? "kg-chip--active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      <div className="rule my-1" />

      {/* Year range */}
      <Section title="Year Range">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="From"
            value={filters.yearFrom}
            min={1891}
            max={1960}
            onChange={(e) => set("yearFrom", e.target.value)}
            className="w-full px-2 py-1.5 text-xs bg-[var(--card)] border border-[var(--border)] rounded-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
          <span className="text-[var(--muted-foreground)] text-xs">–</span>
          <input
            type="number"
            placeholder="To"
            value={filters.yearTo}
            min={1891}
            max={1960}
            onChange={(e) => set("yearTo", e.target.value)}
            className="w-full px-2 py-1.5 text-xs bg-[var(--card)] border border-[var(--border)] rounded-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
        </div>
      </Section>

      <div className="rule my-1" />

      {/* Decade */}
      <Section title="Decade" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {DECADES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => set("decade", filters.decade === value ? "" : value)}
              className={`kg-chip ${filters.decade === value ? "kg-chip--active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      <div className="rule my-1" />

      {/* Historical Period */}
      <Section title="Historical Period" defaultOpen={false}>
        <div className="flex flex-col gap-1.5">
          {HISTORICAL_PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => set("historicalPeriod", filters.historicalPeriod === value ? "" : value)}
              className={`kg-chip text-left ${filters.historicalPeriod === value ? "kg-chip--active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      <div className="rule my-1" />

      {/* Today in History */}
      <Section title="Special Filters" defaultOpen={false}>
        <label className="flex items-center gap-2 cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={filters.todayInHistory}
            onChange={(e) => set("todayInHistory", e.target.checked)}
            className="w-3.5 h-3.5 accent-[var(--primary)]"
          />
          <span className="text-xs">Today in History</span>
        </label>
        <div className="flex flex-col gap-1 mt-2">
          {(["image", "audio", "video"] as const).map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.contentTypes.includes(m)}
                onChange={() => toggle("contentTypes", m)}
                className="w-3.5 h-3.5 accent-[var(--primary)]"
              />
              <span className="text-xs capitalize">{m} media only</span>
            </label>
          ))}
        </div>
      </Section>

      <div className="rule my-1" />

      {/* Topics */}
      <Section title="Topics">
        <div className="flex flex-col gap-1">
          {allTopics.map((topic) => (
            <label key={topic.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.topicIds.includes(topic.id)}
                onChange={() => toggle("topicIds", topic.id)}
                className="w-3.5 h-3.5 accent-[var(--primary)]"
              />
              <span
                className="text-xs transition-colors group-hover:text-[var(--primary)]"
                style={{ color: filters.topicIds.includes(topic.id) ? topic.color : undefined }}
              >
                {topic.label}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <div className="rule my-1" />

      {/* Theme */}
      <Section title="Theme" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {THEMES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => set("theme", filters.theme === value ? "" : value)}
              className={`kg-chip ${filters.theme === value ? "kg-chip--active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      <div className="rule my-1" />

      {/* Accessibility */}
      <Section title="Accessibility" defaultOpen={false}>
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasAudioDescription}
              onChange={(e) => set("hasAudioDescription", e.target.checked)}
              className="w-3.5 h-3.5 accent-[var(--primary)]"
            />
            <span className="text-xs">Has audio description</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasCaptions}
              onChange={(e) => set("hasCaptions", e.target.checked)}
              className="w-3.5 h-3.5 accent-[var(--primary)]"
            />
            <span className="text-xs">Has captions / transcript</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.highContrast}
              onChange={(e) => set("highContrast", e.target.checked)}
              className="w-3.5 h-3.5 accent-[var(--primary)]"
            />
            <span className="text-xs">High-contrast mode</span>
          </label>
        </div>
      </Section>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] rounded-sm text-sm bg-[var(--card)] hover:border-[var(--primary)]/50 transition-colors w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--primary)]" />
            Filters
            {activeCount > 0 && <span className="kg-badge">{activeCount}</span>}
          </span>
          {mobileOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {mobileOpen && (
          <div className="mt-2 p-4 border border-[var(--border)] rounded-sm bg-[var(--card)]">
            {panelContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 p-4 border border-[var(--border)] rounded-sm bg-[var(--card)] max-h-[calc(100vh-7rem)] overflow-y-auto">
          {panelContent}
        </div>
      </aside>
    </>
  );
}
