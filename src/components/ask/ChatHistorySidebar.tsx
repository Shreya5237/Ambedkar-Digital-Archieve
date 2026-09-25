import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Microscope,
  Trash2,
  Edit2,
  Check,
  X,
  Download,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Filter,
} from "lucide-react";
import type { ChatSession, AskMode } from "@/types/archive";
import { SAMPLE_CHAT_SESSIONS } from "@/data/sampleChatHistory";
import { exportDossierAsMarkdown, downloadFile } from "@/services/researchService";

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelectSession: (id: string) => void;
  onCreateSession: (mode: AskMode) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onResetToSampleData: () => void;
}

export default function ChatHistorySidebar({
  sessions,
  activeSessionId,
  isOpen,
  onToggle,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onRenameSession,
  onResetToSampleData,
}: ChatHistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | "research" | "standard">("all");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMode =
        modeFilter === "all" || s.mode === modeFilter;

      return matchesSearch && matchesMode;
    });
  }, [sessions, searchQuery, modeFilter]);

  const handleStartRename = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(s.id);
    setEditingTitle(s.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (editingTitle.trim()) {
      onRenameSession(id, editingTitle.trim());
    }
    setEditingSessionId(null);
  };

  const handleExport = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    const md = exportDossierAsMarkdown(s);
    downloadFile(
      `${s.title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 30)}_dossier.md`,
      md
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-10 bg-[var(--card)] border-r border-[var(--border)] transition-all duration-300 flex flex-col ${
          isOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden border-none"
        }`}
      >
        {isOpen && (
          <div className="flex flex-col h-full w-80">
            {/* Header */}
            <div className="p-3.5 border-b border-[var(--border)] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--foreground)]">
                  Archival Sessions
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">
                  {sessions.length}
                </span>
              </div>
              <button
                onClick={onToggle}
                className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* New Session Action Buttons */}
            <div className="p-3 border-b border-[var(--border)] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onCreateSession("research")}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 rounded-sm hover:bg-amber-500/25 transition-all shadow-xs"
                  title="Create new Scholarly Research Session"
                >
                  <Microscope className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>+ Research</span>
                </button>
                <button
                  onClick={() => onCreateSession("standard")}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-sm hover:opacity-90 transition-all shadow-xs"
                  title="Create new Standard Conversation"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>+ Standard</span>
                </button>
              </div>

              {/* Search & Mode Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search archives & topics…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--border)] rounded-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)] placeholder:text-[var(--muted-foreground)]"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1 pt-1">
                {(["all", "research", "standard"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setModeFilter(m)}
                    className={`flex-1 py-1 text-[10px] font-mono rounded capitalize transition-colors ${
                      modeFilter === m
                        ? "bg-[var(--foreground)] text-[var(--background)] font-bold"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    {m === "all" ? "All" : m === "research" ? "🔬 Research" : "💬 Standard"}
                  </button>
                ))}
              </div>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-8 px-4 text-xs text-[var(--muted-foreground)] space-y-2">
                  <p>No archival sessions found.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setModeFilter("all");
                    }}
                    className="text-[var(--primary)] underline text-[11px]"
                  >
                    Clear search filters
                  </button>
                </div>
              ) : (
                filteredSessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  const isEditing = editingSessionId === session.id;
                  const lastMessage = session.messages[session.messages.length - 1];

                  return (
                    <div
                      key={session.id}
                      onClick={() => onSelectSession(session.id)}
                      className={`group relative p-2.5 rounded-sm border cursor-pointer transition-all ${
                        isActive
                          ? "bg-[var(--background)] border-[var(--primary)] shadow-xs ring-1 ring-[var(--primary)]/30"
                          : "border-transparent hover:border-[var(--border)] hover:bg-[var(--muted)]/50"
                      }`}
                    >
                      {/* Title & Mode */}
                      <div className="flex items-start justify-between gap-1.5 mb-1">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {session.mode === "research" ? (
                            <span
                              className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"
                              title="Research Mode"
                            />
                          ) : (
                            <span
                              className="w-2 h-2 rounded-full bg-[var(--primary)] flex-shrink-0"
                              title="Standard Mode"
                            />
                          )}

                          {isEditing ? (
                            <form
                              onSubmit={(e) => handleSaveRename(session.id, e)}
                              className="flex items-center gap-1 w-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                autoFocus
                                className="flex-1 px-1.5 py-0.5 text-xs bg-[var(--card)] border border-[var(--primary)] rounded focus:outline-none"
                              />
                              <button
                                type="submit"
                                className="p-1 text-emerald-600 hover:text-emerald-700"
                                title="Save"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSessionId(null);
                                }}
                                className="p-1 text-red-500 hover:text-red-700"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          ) : (
                            <h3 className="text-xs font-medium text-[var(--foreground)] truncate leading-snug">
                              {session.title}
                            </h3>
                          )}
                        </div>

                        {/* Mode badge */}
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase flex-shrink-0 ${
                            session.mode === "research"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold"
                              : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                          }`}
                        >
                          {session.mode === "research" ? "Research" : "Chat"}
                        </span>
                      </div>

                      {/* Snippet */}
                      {lastMessage && (
                        <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-1 mb-1.5 pr-2">
                          {lastMessage.content.replace(/[#*`_]/g, "")}
                        </p>
                      )}

                      {/* Footer & Hover Actions */}
                      <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)] pt-0.5">
                        <span className="font-mono flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(session.updatedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>

                        {/* Action buttons */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            onClick={(e) => handleStartRename(session, e)}
                            className="p-1 hover:text-[var(--primary)] transition-colors"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleExport(session, e)}
                            className="p-1 hover:text-[var(--primary)] transition-colors"
                            title="Export as Markdown Dossier"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                          {sessions.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete session "${session.title}"?`)) {
                                  onDeleteSession(session.id);
                                }
                              }}
                              className="p-1 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Footer Actions */}
            <div className="p-3 border-t border-[var(--border)] bg-[var(--background)]/50 flex items-center justify-between text-xs">
              <button
                onClick={onResetToSampleData}
                className="flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                title="Restore default sample research archives"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Sample Archives</span>
              </button>
              <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                v2.0 Grounded
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
