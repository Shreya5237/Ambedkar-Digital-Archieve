import { FileText, Mic, Video, Image, Calendar, MapPin, Tag, ExternalLink } from "lucide-react";
import type { ArchiveItem } from "@/types/archive";
import { topics as allTopics } from "@/data/mockData";

interface ResultCardProps {
  item: ArchiveItem;
  onClick: (item: ArchiveItem) => void;
  highContrast?: boolean;
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  book: "Book",
  speech: "Speech",
  essay: "Essay",
  article: "Article",
  letter: "Letter",
  legal_document: "Legal Doc",
  photograph: "Photograph",
  manuscript: "Manuscript",
  interview: "Interview",
  telegram: "Telegram",
};

const MEDIA_ICONS = {
  audio: Mic,
  video: Video,
  image: Image,
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: "EN",
  hi: "HI",
  mr: "MR",
  ta: "TA",
};

export default function ResultCard({ item, onClick, highContrast }: ResultCardProps) {
  const MediaIcon = item.mediaType ? MEDIA_ICONS[item.mediaType] : null;
  const itemTopics = allTopics.filter((t) => item.topicIds.includes(t.id));

  return (
    <article
      onClick={() => onClick(item)}
      className={`kg-card group cursor-pointer ${highContrast ? "kg-card--high-contrast" : ""}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(item)}
      aria-label={`View details for ${item.title}`}
    >
      {/* Thumbnail / media preview */}
      {item.thumbnailUrl ? (
        <div className="relative h-36 overflow-hidden rounded-sm mb-3 bg-[var(--muted)]">
          <img
            src={item.thumbnailUrl}
            alt={item.caption ?? item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Media type badge */}
          {MediaIcon && (
            <span className="absolute top-2 right-2 kg-badge flex items-center gap-1">
              <MediaIcon className="w-3 h-3" />
              {item.mediaType}
            </span>
          )}
        </div>
      ) : (
        <div className="h-20 mb-3 rounded-sm bg-[var(--muted)] flex items-center justify-center relative">
          <FileText className="w-8 h-8 text-[var(--border)]" />
          {MediaIcon && (
            <span className="absolute top-2 right-2 kg-badge flex items-center gap-1">
              <MediaIcon className="w-3 h-3" />
              {item.mediaType}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-1.5 flex-1">
        {/* Content type + language row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--primary)] border border-[var(--primary)]/30 px-1.5 py-0.5 rounded-sm">
            {CONTENT_TYPE_LABELS[item.contentType] ?? item.contentType}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] border border-[var(--border)] px-1.5 py-0.5 rounded-sm">
            {LANGUAGE_LABELS[item.language] ?? item.language}
          </span>
          {item.hasCaptions && (
            <span className="text-[10px] font-mono text-[var(--muted-foreground)] border border-[var(--border)] px-1.5 py-0.5 rounded-sm">
              CC
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-sm font-semibold leading-snug text-[var(--card-foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
          {item.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-[var(--muted-foreground)] truncate">{item.author}</p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-[var(--muted-foreground)] flex-wrap">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {item.year}
          </span>
          {item.city && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3" />
              {item.city}
            </span>
          )}
        </div>

        {/* Summary */}
        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed mt-0.5">
          {item.summary}
        </p>

        {/* Topic chips */}
        {itemTopics.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {itemTopics.slice(0, 2).map((topic) => (
              <span
                key={topic.id}
                className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-sm border"
                style={{
                  color: topic.color,
                  borderColor: topic.color + "40",
                  backgroundColor: topic.color + "12",
                }}
              >
                <Tag className="w-2.5 h-2.5" />
                {topic.label}
              </span>
            ))}
            {itemTopics.length > 2 && (
              <span className="text-[10px] text-[var(--muted-foreground)] px-1 py-0.5">
                +{itemTopics.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Hover link hint */}
        <div className="mt-auto pt-2 flex items-center gap-1 text-[10px] text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-3 h-3" />
          View full record
        </div>
      </div>
    </article>
  );
}
