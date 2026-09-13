import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Search, FileText, Users, Calendar, Tag, X, Filter, ArrowRight } from "lucide-react";
import { searchArchive } from "@/services/api";
import type { ContentType, Language } from "@/types/archive";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "speech", label: "Speech" },
  { value: "essay", label: "Essay" },
  { value: "letter", label: "Letter" },
  { value: "book", label: "Book" },
  { value: "article", label: "Article" },
  { value: "legal_document", label: "Legal Document" },
  { value: "manuscript", label: "Manuscript" },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "mr", label: "Marathi" },
  { value: "ta", label: "Tamil" },
];

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [contentType, setContentType] = useState<ContentType | "">(
    (searchParams.get("contentType") as ContentType) ?? ""
  );
  const [language, setLanguage] = useState<Language | "">(
    (searchParams.get("language") as Language) ?? ""
  );
  const [activeTab, setActiveTab] = useState<"documents" | "people" | "events" | "topics">("documents");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["search", query, contentType, language],
    queryFn: () =>
      searchArchive({
        query,
        contentType: contentType || undefined,
        language: language || undefined,
      }),
    staleTime: 30_000,
  });

  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (contentType) params.contentType = contentType;
    if (language) params.language = language;
    setSearchParams(params, { replace: true });
  }, [query, contentType, language]);

  const tabCounts = {
    documents: data?.documents.length ?? 0,
    people: data?.people.length ?? 0,
    events: data?.events.length ?? 0,
    topics: data?.topics.length ?? 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold mb-2">{t("search.title")}</h1>
        <p className="text-[var(--muted-foreground)] text-sm">Full-text search across documents, speeches, letters, and more</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the archive…"
            className="w-full pl-11 pr-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-sm text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--muted)] rounded-sm transition-colors"
            >
              <X className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            </button>
          )}
        </div>
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className={`flex items-center gap-2 px-4 py-3 border rounded-sm text-sm transition-colors ${
            filtersOpen || contentType || language
              ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
              : "bg-[var(--card)] border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {(contentType || language) && (
            <span className="w-4 h-4 rounded-full bg-white/30 text-[10px] flex items-center justify-center">
              {[contentType, language].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <div className="mb-6 p-5 border border-[var(--border)] rounded-sm bg-[var(--card)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] block mb-2">
                Document Type
              </label>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setContentType(contentType === value ? "" : value)}
                    className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                      contentType === value
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                        : "border-[var(--border)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] block mb-2">
                Language
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setLanguage(language === value ? "" : value)}
                    className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                      language === value
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                        : "border-[var(--border)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {(contentType || language) && (
            <button
              onClick={() => { setContentType(""); setLanguage(""); }}
              className="mt-4 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results summary */}
      {!isLoading && data && (
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          {data.total > 0 ? (
            <>
              {data.total} results{query ? <> for <strong className="text-[var(--foreground)]">"{query}"</strong></> : ""}
            </>
          ) : (
            "No results found"
          )}
        </p>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)] mb-6">
        {(["documents", "people", "events", "topics"] as const).map((tab) => {
          const icons = { documents: FileText, people: Users, events: Calendar, topics: Tag };
          const Icon = icons[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-[var(--primary)] text-[var(--primary)] font-medium"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="capitalize">{tab}</span>
              <span className="text-[10px] font-mono text-[var(--muted-foreground)] bg-[var(--muted)] px-1.5 py-0.5 rounded-sm">
                {tabCounts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-[var(--border)] rounded-sm p-5 animate-pulse">
              <div className="h-3 bg-[var(--muted)] rounded w-1/4 mb-3" />
              <div className="h-5 bg-[var(--muted)] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[var(--muted)] rounded w-full mb-1" />
              <div className="h-3 bg-[var(--muted)] rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Documents tab */}
      {!isLoading && activeTab === "documents" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.documents.map((doc) => (
            <Link
              key={doc.id}
              to={`/documents/${doc.id}`}
              className="group border border-[var(--border)] rounded-sm p-5 hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all flex gap-4"
            >
              {doc.thumbnailUrl && (
                <div className="w-16 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-[var(--muted)]">
                  <img src={doc.thumbnailUrl} alt={doc.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded-sm">
                    {doc.contentType.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] font-mono">{doc.year}</span>
                  <span className="text-xs text-[var(--muted-foreground)] uppercase font-mono">{doc.language}</span>
                </div>
                <h3 className="font-display text-base font-semibold leading-snug mb-1 group-hover:text-[var(--primary)] transition-colors">
                  {doc.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                  {doc.summary}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {doc.topicIds.slice(0, 2).map((id) => (
                    <span key={id} className="text-[10px] bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-sm">
                      {id.replace("t-", "")}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
          {data?.documents.length === 0 && (
            <div className="col-span-2 text-center py-16 text-[var(--muted-foreground)]">
              <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>No documents match your search</p>
            </div>
          )}
        </div>
      )}

      {/* People tab */}
      {!isLoading && activeTab === "people" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.people.map((person) => (
            <Link
              key={person.id}
              to={`/people/${person.id}`}
              className="group border border-[var(--border)] rounded-sm p-5 hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                {person.image ? (
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-12 h-12 rounded-sm object-cover bg-[var(--muted)]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-sm bg-[var(--muted)] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[var(--muted-foreground)]" />
                  </div>
                )}
                <div>
                  <h3 className="font-display font-semibold text-sm group-hover:text-[var(--primary)] transition-colors">
                    {person.name}
                  </h3>
                  {person.born && (
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">
                      {person.born.slice(0, 4)}
                      {person.died ? `–${person.died.slice(0, 4)}` : ""}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                {person.description}
              </p>
              <div className="mt-3 text-xs text-[var(--muted-foreground)]">
                {person.documentCount} documents
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Events tab */}
      {!isLoading && activeTab === "events" && (
        <div className="space-y-4">
          {data?.events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group flex gap-4 border border-[var(--border)] rounded-sm p-5 hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all"
            >
              {event.image && (
                <div className="w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-[var(--muted)]">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-[var(--primary)] mb-1">{event.date}</p>
                <h3 className="font-display font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] self-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {/* Topics tab */}
      {!isLoading && activeTab === "topics" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/search?topic=${topic.id}`}
              className="group border border-[var(--border)] rounded-sm p-5 hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all flex items-center gap-4"
            >
              <div
                className="w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: topic.color + "20", color: topic.color }}
              >
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-sm group-hover:text-[var(--primary)] transition-colors">
                  {topic.label}
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{topic.documentCount} documents</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
