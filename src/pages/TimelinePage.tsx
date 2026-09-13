import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Clock, FileText, ChevronRight, Calendar } from "lucide-react";
import { getTimeline } from "@/services/api";
import type { TimelineEntry } from "@/types/archive";

const EVENT_TYPE_META: Record<
  TimelineEntry["eventType"],
  { label: string; color: string; bg: string }
> = {
  life: { label: "Life", color: "#c8621a", bg: "#c8621a15" },
  political: { label: "Political", color: "#1b4f72", bg: "#1b4f7215" },
  legal: { label: "Legal", color: "#2d6a4f", bg: "#2d6a4f15" },
  publication: { label: "Publication", color: "#7d3c98", bg: "#7d3c9815" },
  constitutional: { label: "Constitutional", color: "#c0392b", bg: "#c0392b15" },
};

export default function TimelinePage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<TimelineEntry["eventType"] | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["timeline"],
    queryFn: getTimeline,
  });

  const filtered = entries?.filter((e) => activeFilter === "all" || e.eventType === activeFilter) ?? [];

  const decades = [...new Set(filtered.map((e) => Math.floor(e.year / 10) * 10))].sort();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-5 h-5 text-[var(--primary)]" />
          <h1 className="font-display text-3xl font-semibold">{t("timeline.title")}</h1>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">{t("timeline.subtitle")}</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-10">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
            activeFilter === "all"
              ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
              : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
          }`}
        >
          All events
        </button>
        {Object.entries(EVENT_TYPE_META).map(([type, meta]) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type as TimelineEntry["eventType"])}
            className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
              activeFilter === type ? "font-medium" : "opacity-60 hover:opacity-100"
            }`}
            style={
              activeFilter === type
                ? { borderColor: meta.color, backgroundColor: meta.bg, color: meta.color }
                : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
            }
          >
            {meta.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[var(--muted)] rounded-sm" />
          ))}
        </div>
      )}

      {/* Timeline by decade */}
      {!isLoading && (
        <div className="relative">
          {/* Spine */}
          <div className="absolute left-[88px] top-0 bottom-0 w-px bg-[var(--border)]" />

          {decades.map((decade) => {
            const decadeEntries = filtered.filter(
              (e) => Math.floor(e.year / 10) * 10 === decade
            );
            return (
              <div key={decade} className="mb-12">
                {/* Decade label */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-display text-2xl font-semibold text-[var(--muted-foreground)] w-20 text-right flex-shrink-0">
                    {decade}s
                  </span>
                  <div className="w-3 h-3 rounded-full bg-[var(--border)] border-2 border-[var(--background)] relative z-10 flex-shrink-0" />
                  <div className="h-px flex-1 bg-[var(--border)]" />
                </div>

                <div className="space-y-4 pl-4">
                  {decadeEntries.map((entry) => {
                    const meta = EVENT_TYPE_META[entry.eventType];
                    const isExpanded = expandedId === entry.id;
                    return (
                      <div key={entry.id} className="flex gap-3">
                        {/* Year marker */}
                        <div className="flex flex-col items-end w-20 flex-shrink-0 pt-3">
                          <span className="font-mono text-xs text-[var(--muted-foreground)]">{entry.year}</span>
                        </div>

                        {/* Dot */}
                        <div className="flex-shrink-0 flex flex-col items-center pt-4">
                          <div
                            className="w-3 h-3 rounded-full border-2 border-[var(--background)] z-10 flex-shrink-0"
                            style={{ backgroundColor: meta.color }}
                          />
                        </div>

                        {/* Card */}
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                            className="w-full text-left"
                          >
                            <div
                              className={`border border-[var(--border)] rounded-sm p-4 hover:border-[var(--primary)]/40 transition-all ${
                                isExpanded ? "bg-[var(--card)]" : "hover:bg-[var(--card)]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span
                                      className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm"
                                      style={{ backgroundColor: meta.bg, color: meta.color }}
                                    >
                                      {meta.label}
                                    </span>
                                    <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
                                      {entry.date}
                                    </span>
                                  </div>
                                  <h3 className="font-display font-semibold text-base leading-snug">
                                    {entry.title}
                                  </h3>
                                </div>
                                <ChevronRight
                                  className={`w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0 transition-transform ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                />
                              </div>

                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                                  <p className="text-sm text-[var(--foreground)] leading-relaxed mb-3">
                                    {entry.description}
                                  </p>

                                  {entry.image && (
                                    <img
                                      src={entry.image}
                                      alt={entry.title}
                                      className="w-full h-40 object-cover rounded-sm mb-3"
                                    />
                                  )}

                                  {entry.documentIds.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
                                        Related documents:
                                      </span>
                                      {entry.documentIds.map((docId) => (
                                        <Link
                                          key={docId}
                                          to={`/documents/${docId}`}
                                          className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <FileText className="w-3 h-3" />
                                          {docId.replace("doc-", "").replace(/-/g, " ")}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[var(--muted-foreground)]">
              <Calendar className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>No events match this filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
