import { useState } from "react";
import {
  BookMarked,
  X,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  FileText,
  Tag,
  Quote,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { ResearchDossierItem, ChatSession } from "@/types/archive";
import { exportDossierAsMarkdown, downloadFile } from "@/services/researchService";

interface ResearchDossierNotebookProps {
  session: ChatSession;
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (note: Omit<ResearchDossierItem, "id" | "addedAt">) => void;
  onDeleteNote: (noteId: string) => void;
}

export default function ResearchDossierNotebook({
  session,
  isOpen,
  onClose,
  onAddNote,
  onDeleteNote,
}: ResearchDossierNotebookProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const notes = session.researchNotes || [];

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onAddNote({
      sessionId: session.id,
      type: "note",
      title: newTitle.trim() || "Scholar Field Note",
      content: newContent.trim(),
      authorOrSpeaker: "Researcher Observation",
      tags: newTag.trim() ? [newTag.trim()] : ["Research Note"],
    });

    setNewTitle("");
    setNewContent("");
    setNewTag("");
  };

  const handleExport = () => {
    const md = exportDossierAsMarkdown(session);
    downloadFile(
      `${session.title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 30)}_dossier.md`,
      md
    );
  };

  const handleCopyAll = async () => {
    const md = exportDossierAsMarkdown(session);
    try {
      await navigator.clipboard.writeText(md);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Backdrop for small screens */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl flex flex-col animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="font-display font-semibold text-sm text-[var(--foreground)]">
              Research Dossier Notebook
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300">
              {notes.length} pinned
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-3 border-b border-[var(--border)] bg-[var(--background)]/50 flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] text-[var(--muted-foreground)] truncate">
            Session: {session.title}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handleCopyAll}
              className="p-1.5 border border-[var(--border)] rounded hover:bg-[var(--card)] text-[var(--foreground)] transition-colors flex items-center gap-1 text-[11px]"
              title="Copy formatted dossier to clipboard"
            >
              {copiedAll ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span className="hidden sm:inline">Copy All</span>
            </button>
            <button
              onClick={handleExport}
              className="px-2.5 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:opacity-90 transition-opacity flex items-center gap-1 text-[11px] font-medium"
              title="Download structured Markdown research report"
            >
              <Download className="w-3 h-3" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Notes & Pinned Excerpts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Add Quick Note Form */}
          <form
            onSubmit={handleCreateNote}
            className="p-3 rounded border border-amber-500/30 bg-amber-500/5 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Research Observation
              </span>
            </div>
            <input
              type="text"
              placeholder="Note title / hypothesis heading…"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded text-xs focus:ring-1 focus:ring-[var(--ring)] focus:outline-none"
            />
            <textarea
              placeholder="Record citation notes, historiographical arguments, or primary source cross-references…"
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded text-xs focus:ring-1 focus:ring-[var(--ring)] focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                placeholder="#Tag (e.g. #CAD, #Article17)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-1/2 px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[11px] focus:ring-1 focus:ring-[var(--ring)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newContent.trim()}
                className="px-3 py-1 bg-[var(--foreground)] text-[var(--background)] font-medium rounded text-xs hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                Pin Note
              </button>
            </div>
          </form>

          {/* List of Pinned Items */}
          {notes.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <Quote className="w-8 h-8 mx-auto text-[var(--muted-foreground)] opacity-40" />
              <p className="text-xs text-[var(--foreground)] font-medium">Notebook is empty</p>
              <p className="text-[11px] text-[var(--muted-foreground)] max-w-xs mx-auto leading-relaxed">
                Click "Pin to Dossier" on verbatim textual quotes or primary source citations in research answers to compile your scholarly evidence.
              </p>
            </div>
          ) : (
            notes.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-sm border border-[var(--border)] bg-[var(--background)] space-y-2 relative group hover:border-[var(--primary)]/50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <h4 className="text-xs font-semibold text-[var(--foreground)] truncate">
                      {item.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => onDeleteNote(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[var(--muted-foreground)] hover:text-red-500 transition-all"
                    title="Remove from notebook"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Content */}
                <blockquote className="text-xs text-[var(--foreground)] italic border-l-2 border-amber-500/40 pl-2 leading-relaxed">
                  "{item.content}"
                </blockquote>

                {/* Metadata */}
                <div className="pt-1 flex flex-wrap items-center justify-between text-[10px] text-[var(--muted-foreground)] font-mono gap-1">
                  <div className="truncate max-w-[200px]">
                    {item.authorOrSpeaker && <span className="font-bold">{item.authorOrSpeaker} · </span>}
                    {item.reference || item.sourceTitle}
                  </div>
                  {item.tags?.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.2 rounded bg-[var(--muted)] text-[var(--muted-foreground)]"
                    >
                      {t.startsWith("#") ? t : `#${t}`}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
