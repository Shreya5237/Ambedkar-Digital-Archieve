import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowRight, FileText, Users, Calendar, Tag, MapPin, Network, Clock, MessageSquare } from "lucide-react";
import { getFeaturedDocuments, getFeaturedEvents, getAllTopics } from "@/services/api";
import type { ContentType } from "@/types/archive";

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  speech: "Speech",
  essay: "Essay",
  letter: "Letter",
  book: "Book",
  article: "Article",
  legal_document: "Legal Document",
  photograph: "Photograph",
  manuscript: "Manuscript",
  interview: "Interview",
  telegram: "Telegram",
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  life: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  political: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  legal: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  publication: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  constitutional: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const EXPLORE_SECTIONS = [
  { key: "documents", to: "/search?type=documents", icon: FileText, label: "Documents", count: "312" },
  { key: "people", to: "/people", icon: Users, label: "People", count: "48" },
  { key: "events", to: "/events", icon: Calendar, label: "Events", count: "156" },
  { key: "topics", to: "/topics", icon: Tag, label: "Topics", count: "24" },
  { key: "places", to: "/places", icon: MapPin, label: "Places", count: "38" },
];

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: documents } = useQuery({
    queryKey: ["featured-documents"],
    queryFn: getFeaturedDocuments,
  });

  const { data: events } = useQuery({
    queryKey: ["featured-events"],
    queryFn: getFeaturedEvents,
  });

  const { data: topics } = useQuery({
    queryKey: ["topics"],
    queryFn: getAllTopics,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[72vh] flex items-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--background) 0%, var(--secondary) 100%)",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Vertical rule accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            {/* Archive label */}
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[var(--primary)] mb-6 border border-[var(--primary)]/30 px-3 py-1.5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              National Digital Heritage Archive
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
              {t("home.hero_title")}
            </h1>

            <p className="text-lg text-[var(--muted-foreground)] leading-relaxed mb-10 max-w-2xl">
              {t("home.hero_subtitle")}
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("home.search_placeholder")}
                className="w-full pl-11 pr-32 py-3.5 bg-[var(--card)] border border-[var(--border)] rounded-sm text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </form>

            {/* Quick links */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["Annihilation of Caste", "Poona Pact", "Constitution Speech", "Mahad Satyagraha"].map((term) => (
                <button
                  key={term}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                  className="text-xs px-3 py-1.5 bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--muted-foreground)] rounded-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative year stamps */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-end gap-3 opacity-10 select-none">
          {["1891", "1927", "1932", "1936", "1949", "1956"].map((year) => (
            <span key={year} className="font-display text-6xl font-bold text-[var(--foreground)]">
              {year}
            </span>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-[var(--border)] bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-[var(--border)]">
            {[
              { label: "Archival Items", value: "312" },
              { label: "Historical Events", value: "156" },
              { label: "Languages", value: "4" },
              { label: "Source Institutions", value: "12" },
            ].map((stat) => (
              <div key={stat.label} className="pl-4 first:pl-0">
                <div className="font-display text-2xl font-semibold text-[var(--primary)]">{stat.value}</div>
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Documents */}
        <section className="py-16">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-semibold">Landmark Documents</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">Primary sources from the archival collection</p>
            </div>
            <Link
              to="/search"
              className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              {t("common.view_all")} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(documents ?? []).map((doc) => (
              <Link
                key={doc.id}
                to={`/documents/${doc.id}`}
                className="group border border-[var(--border)] rounded-sm hover:border-[var(--primary)]/50 hover:shadow-md transition-all overflow-hidden bg-[var(--card)]"
              >
                {doc.thumbnailUrl && (
                  <div className="h-40 overflow-hidden bg-[var(--muted)]">
                    <img
                      src={doc.thumbnailUrl}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-sm">
                      {CONTENT_TYPE_LABELS[doc.contentType]}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] font-mono">{doc.year}</span>
                  </div>
                  <h3 className="font-display text-base font-semibold leading-snug mb-2 group-hover:text-[var(--primary)] transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-3 leading-relaxed">
                    {doc.summary}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    <FileText className="w-3 h-3" />
                    <span>{doc.sourceInstitution}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-12 border-t border-[var(--border)]">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-semibold">{t("home.featured_events")}</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">Defining moments in the historical record</p>
            </div>
            <Link to="/timeline" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
              Full timeline <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {(events ?? []).slice(0, 4).map((event) => (
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
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs text-[var(--primary)]">{event.date}</span>
                    {event.topics.length > 0 && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-sm">
                        {event.topics[0]}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>

        {/* Explore */}
        <section className="py-12 border-t border-[var(--border)]">
          <h2 className="font-display text-2xl font-semibold mb-2">{t("home.explore_title")}</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-8">Navigate the archive by category</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {EXPLORE_SECTIONS.map(({ key, to, icon: Icon, label, count }) => (
              <Link
                key={key}
                to={to}
                className="group border border-[var(--border)] rounded-sm p-5 text-center hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all"
              >
                <Icon className="w-6 h-6 mx-auto mb-3 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                <div className="font-display text-lg font-semibold text-[var(--primary)]">{count}</div>
                <div className="text-sm font-medium mt-0.5">{label}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Topics */}
        <section className="py-12 border-t border-[var(--border)]">
          <h2 className="font-display text-2xl font-semibold mb-2">Browse by Topic</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-8">Explore themes across the archival record</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(topics ?? []).map((topic) => (
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
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm group-hover:text-[var(--primary)] transition-colors">
                    {topic.label}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-1">
                    {topic.documentCount} documents
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Cards */}
        <section className="py-12 border-t border-[var(--border)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/timeline"
              className="group p-6 border border-[var(--border)] rounded-sm hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all"
            >
              <Clock className="w-6 h-6 text-[var(--primary)] mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">Historical Timeline</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
                Follow Ambedkar's life chronologically — from Mhow (1891) to Nagpur (1956).
              </p>
              <span className="text-sm text-[var(--primary)] flex items-center gap-1 group-hover:gap-2 transition-all">
                Explore timeline <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              to="/explorer"
              className="group p-6 border border-[var(--border)] rounded-sm hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all"
            >
              <Network className="w-6 h-6 text-[var(--primary)] mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">Knowledge Graph</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
                Explore the network of people, documents, events, and ideas visually.
              </p>
              <span className="text-sm text-[var(--primary)] flex items-center gap-1 group-hover:gap-2 transition-all">
                Open explorer <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              to="/ask"
              className="group p-6 border border-[var(--primary)]/30 rounded-sm bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 transition-all"
            >
              <MessageSquare className="w-6 h-6 text-[var(--primary)] mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">Ask the Archive</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
                Ask research questions. Get evidence-grounded answers with source citations.
              </p>
              <span className="text-sm text-[var(--primary)] flex items-center gap-1 group-hover:gap-2 transition-all">
                Ask a question <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
