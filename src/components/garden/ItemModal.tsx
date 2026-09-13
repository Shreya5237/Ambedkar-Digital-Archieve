import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  X,
  FileText,
  Mic,
  Video,
  Image,
  Calendar,
  MapPin,
  Tag,
  Users,
  BookOpen,
  ExternalLink,
  Volume2,
  Captions,
} from "lucide-react";
import type { ArchiveItem } from "@/types/archive";
import { topics as allTopics, people as allPeople } from "@/data/mockData";

interface ItemModalProps {
  item: ArchiveItem | null;
  onClose: () => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  ta: "Tamil",
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  book: "Book",
  speech: "Speech",
  essay: "Essay",
  article: "Article",
  letter: "Letter",
  legal_document: "Legal Document",
  photograph: "Photograph",
  manuscript: "Manuscript",
  interview: "Interview",
  telegram: "Telegram",
};

const MEDIA_ICONS = { audio: Mic, video: Video, image: Image };

export default function ItemModal({ item, onClose }: ItemModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Trap focus / close on Escape
  useEffect(() => {
    if (!item) return;
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [item, onClose]);

  // Prevent scroll on body while open
  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  if (!item) return null;

  const itemTopics = allTopics.filter((t) => item.topicIds.includes(t.id));
  const itemPeople = allPeople.filter((p) => item.personIds.includes(p.id));
  const MediaIcon = item.mediaType ? MEDIA_ICONS[item.mediaType] : FileText;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative z-10 w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] bg-[var(--background)] border border-[var(--border)] rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-modal-in">
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-sm hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header image */}
        {item.thumbnailUrl && (
          <div className="relative h-44 flex-shrink-0 bg-[var(--muted)]">
            <img
              src={item.thumbnailUrl}
              alt={item.caption ?? item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent" />
            {item.caption && (
              <p className="absolute bottom-2 left-4 right-10 text-[10px] text-[var(--muted-foreground)] italic">
                {item.caption}
              </p>
            )}
          </div>
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
          {/* Content type + language pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-[var(--primary)] border border-[var(--primary)]/30 px-2 py-0.5 rounded-sm">
              <MediaIcon className="w-3 h-3" />
              {CONTENT_TYPE_LABELS[item.contentType] ?? item.contentType}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] border border-[var(--border)] px-2 py-0.5 rounded-sm">
              {LANGUAGE_LABELS[item.language] ?? item.language}
            </span>
            {item.hasCaptions && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--muted-foreground)] border border-[var(--border)] px-2 py-0.5 rounded-sm">
                <Captions className="w-3 h-3" />
                Captions
              </span>
            )}
            {item.hasAudioDescription && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--muted-foreground)] border border-[var(--border)] px-2 py-0.5 rounded-sm">
                <Volume2 className="w-3 h-3" />
                Audio Desc
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold leading-snug text-[var(--foreground)] mb-1">
              {item.title}
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">{item.author}</p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
            <div className="flex items-start gap-2">
              <Calendar className="w-3.5 h-3.5 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]">Date</p>
                <p>{item.date}</p>
              </div>
            </div>
            {(item.city || item.country) && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]">Location</p>
                  <p>{[item.city, item.state, item.country].filter(Boolean).join(", ")}</p>
                </div>
              </div>
            )}
            {item.sourceInstitution && (
              <div className="flex items-start gap-2 col-span-2">
                <BookOpen className="w-3.5 h-3.5 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]">Source</p>
                  <p>{item.sourceInstitution}</p>
                </div>
              </div>
            )}
            {item.pageCount && (
              <div className="flex items-start gap-2">
                <FileText className="w-3.5 h-3.5 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]">Pages</p>
                  <p>{item.pageCount}</p>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Summary</p>
            <p className="text-sm leading-relaxed text-[var(--foreground)]">{item.summary}</p>
          </div>

          {/* Transcript excerpt */}
          {item.transcript && (
            <div className="border-l-2 border-[var(--primary)]/40 pl-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">Transcript excerpt</p>
              <blockquote className="text-sm italic text-[var(--muted-foreground)] leading-relaxed">
                "{item.transcript.slice(0, 300)}{item.transcript.length > 300 ? "…" : ""}"
              </blockquote>
            </div>
          )}

          {/* Topics */}
          {itemTopics.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Tag className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]">Topics</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {itemTopics.map((topic) => (
                  <span
                    key={topic.id}
                    className="text-xs px-2 py-1 rounded-sm border"
                    style={{
                      color: topic.color,
                      borderColor: topic.color + "40",
                      backgroundColor: topic.color + "12",
                    }}
                  >
                    {topic.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* People */}
          {itemPeople.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Users className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]">People</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {itemPeople.map((person) => (
                  <Link
                    key={person.id}
                    to={`/people/${person.id}`}
                    onClick={onClose}
                    className="text-xs px-2 py-1 border border-[var(--border)] rounded-sm hover:border-[var(--primary)]/50 hover:text-[var(--primary)] transition-colors"
                  >
                    {person.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Provenance */}
          {item.provenance && (
            <div className="text-[10px] text-[var(--muted-foreground)] border-t border-[var(--border)] pt-3">
              <span className="font-mono uppercase tracking-widest">Provenance: </span>
              {item.provenance}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="flex-shrink-0 border-t border-[var(--border)] px-5 py-3 flex items-center justify-between bg-[var(--card)]">
          <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{item.rights}</span>
          <Link
            to={`/documents/${item.id}`}
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open full record
          </Link>
        </div>
      </div>
    </div>
  );
}
