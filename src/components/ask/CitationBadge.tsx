import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import type { SourceCitation } from "@/types/archive";

interface CitationBadgeProps {
  source: SourceCitation;
  index?: number;
}

export default function CitationBadge({ source, index }: CitationBadgeProps) {
  return (
    <Link
      to={`/documents/${source.documentId}`}
      className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 border border-[var(--primary)]/30 bg-[var(--primary)]/8 text-[var(--primary)] rounded-sm hover:bg-[var(--primary)]/15 transition-colors whitespace-nowrap"
      title={source.excerpt}
    >
      <FileText className="w-3 h-3 flex-shrink-0" />
      {index !== undefined && <span className="font-bold">[{index + 1}]</span>}
      <span className="truncate max-w-[12rem]">{source.title}</span>
      {source.page && <span className="text-[var(--muted-foreground)]">p.{source.page}</span>}
    </Link>
  );
}
