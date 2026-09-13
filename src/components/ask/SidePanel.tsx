import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, ChevronLeft, FileText, ExternalLink } from "lucide-react";
import type { ChatMessage, SourceCitation } from "@/types/archive";
import CitationBadge from "./CitationBadge";

interface SidePanelProps {
  messages: ChatMessage[];
}

export default function SidePanel({ messages }: SidePanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Collect all unique sources across the conversation
  const allSourcesMap = new Map<string, SourceCitation>();
  for (const msg of messages) {
    for (const src of msg.sources ?? []) {
      if (!allSourcesMap.has(src.documentId)) {
        allSourcesMap.set(src.documentId, src);
      }
    }
  }
  const allSources = Array.from(allSourcesMap.values());

  if (allSources.length === 0) return null;

  return (
    <div
      className={`hidden xl:flex flex-col border-l border-[var(--border)] bg-[var(--card)] transition-all duration-300 ${
        collapsed ? "w-10" : "w-64"
      } flex-shrink-0`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center gap-2 p-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors border-b border-[var(--border)]"
        title={collapsed ? "Expand sources panel" : "Collapse sources panel"}
      >
        {collapsed ? (
          <ChevronLeft className="w-4 h-4 flex-shrink-0" />
        ) : (
          <>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-mono uppercase tracking-widest whitespace-nowrap">
              Sources ({allSources.length})
            </span>
          </>
        )}
      </button>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed">
            All archival sources cited in this conversation.
          </p>

          {allSources.map((src, i) => (
            <div
              key={src.documentId}
              className="border border-[var(--border)] rounded-sm p-2.5 bg-[var(--background)] space-y-1.5"
            >
              {/* Badge number */}
              <div className="flex items-start gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[var(--primary)] flex-shrink-0 mt-0.5">
                  [{i + 1}]
                </span>
                <Link
                  to={`/documents/${src.documentId}`}
                  className="text-xs font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors leading-snug"
                >
                  {src.title}
                </Link>
              </div>

              {/* Excerpt */}
              <blockquote className="text-[10px] italic text-[var(--muted-foreground)] border-l border-[var(--primary)]/30 pl-2 leading-relaxed">
                "{src.excerpt.slice(0, 120)}{src.excerpt.length > 120 ? "…" : ""}"
              </blockquote>

              {/* Link */}
              <Link
                to={`/documents/${src.documentId}`}
                className="flex items-center gap-1 text-[10px] text-[var(--primary)] hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Open record
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
