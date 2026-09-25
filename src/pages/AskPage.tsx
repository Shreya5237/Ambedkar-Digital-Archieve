import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Send,
  FileText,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Info,
  Sparkles,
  PlusCircle,
  Sprout,
  Clock,
  Microscope,
  BookMarked,
  PanelLeftClose,
  PanelLeft,
  Download,
  Share2,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Scale,
  Landmark,
  Coins,
  Compass,
} from "lucide-react";
import { askArchive, askArchiveResearch } from "@/services/api";
import {
  loadChatSessions,
  saveChatSessions,
  createNewChatSession,
  getInitialChatState,
  SAMPLE_CHAT_SESSIONS,
} from "@/data/sampleChatHistory";
import { exportDossierAsMarkdown, downloadFile } from "@/services/researchService";
import type {
  ChatMessage,
  ChatSession,
  AskMode,
  ResearchParameters,
  ResearchDossierItem,
} from "@/types/archive";
import SidePanel from "@/components/ask/SidePanel";
import ChatHistorySidebar from "@/components/ask/ChatHistorySidebar";
import ResearchParametersBar from "@/components/ask/ResearchParametersBar";
import ResearchDossierNotebook from "@/components/ask/ResearchDossierNotebook";
import ResearchMessageCard from "@/components/ask/ResearchMessageCard";

const EXAMPLE_QUESTIONS_STANDARD = [
  "What was the significance of the Mahad Satyagraha?",
  "What did Ambedkar say about democracy in his final speech?",
  "How did the Poona Pact affect Dalit political representation?",
  "Why did Ambedkar convert to Buddhism?",
];

const RESEARCH_LENSES = [
  {
    id: "constitutional",
    label: "Constitutional & Legal",
    icon: Scale,
    query: "How did Dr. Ambedkar formulate Article 17 and constitutional morality in the 1948 debates?",
  },
  {
    id: "civil-rights",
    label: "Civil Rights & Mahad",
    icon: Landmark,
    query: "Provide an archival dossier on the Mahad Satyagraha and Bombay High Court Appeal No. 252 of 1936.",
  },
  {
    id: "economics",
    label: "Currency & Monetary Policy",
    icon: Coins,
    query: "Analyze Dr. Ambedkar's critique of the Gold Exchange Standard in The Problem of the Rupee.",
  },
  {
    id: "navayana",
    label: "Navayana & Religious Philosophy",
    icon: Compass,
    query: "Examine the 21-year theological pathway between the 1935 Yeola speech and 1956 Deekshabhoomi conversion.",
  },
];

const CONFIDENCE_META: Record<
  string,
  { label: string; icon: any; color: string; bg: string }
> = {
  verified: {
    label: "Verified Primary Archival Record",
    icon: CheckCircle,
    color: "text-emerald-700 dark:text-emerald-400 font-bold",
    bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-800",
  },
  high: {
    label: "High Archival Confidence",
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  },
  medium: {
    label: "Medium Archival Confidence",
    icon: Info,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  },
  low: {
    label: "Low Archival Confidence",
    icon: AlertCircle,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  },
  insufficient: {
    label: "Insufficient Archival Evidence",
    icon: AlertCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  },
};

export default function AskPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Sessions state: initialize with guaranteed empty fresh session at start
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    return getInitialChatState().sessions;
  });
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return getInitialChatState().activeSessionId;
  });

  // UI Drawer states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const autoSubmittedRef = useRef(false);

  // Active session helper
  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || sessions[0] || createNewChatSession();
  }, [sessions, activeSessionId]);

  const messages = activeSession.messages;
  const currentMode = activeSession.mode;

  // Persist sessions whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      saveChatSessions(sessions);
    }
  }, [sessions]);

  // Scroll to bottom on message change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-submit question from URL ?q= param
  useEffect(() => {
    if (autoSubmittedRef.current) return;
    const q = searchParams.get("q");
    if (q) {
      autoSubmittedRef.current = true;
      handleSend(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update session helper
  const updateActiveSession = (updater: (prev: ChatSession) => ChatSession) => {
    setSessions((prevList) => {
      return prevList.map((s) => {
        if (s.id === activeSession.id) {
          return updater(s);
        }
        return s;
      });
    });
  };

  // Toggle Mode for current session
  const handleToggleMode = (newMode: AskMode) => {
    updateActiveSession((prev) => ({
      ...prev,
      mode: newMode,
      updatedAt: new Date().toISOString(),
      tags:
        newMode === "research"
          ? Array.from(new Set([...(prev.tags || []), "Research Mode"]))
          : prev.tags?.filter((t) => t !== "Research Mode"),
    }));
  };

  // Create new session (starts completely empty)
  const handleCreateSession = (mode: AskMode = "standard") => {
    const newSession = createNewChatSession(
      mode,
      mode === "research" ? "New Archival Research Session" : "New Conversation"
    );
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput("");
  };

  // Delete session
  const handleDeleteSession = (id: string) => {
    const nextSessions = sessions.filter((s) => s.id !== id);
    if (nextSessions.length === 0) {
      const fallback = createNewChatSession();
      setSessions([fallback]);
      setActiveSessionId(fallback.id);
    } else {
      setSessions(nextSessions);
      if (activeSessionId === id) {
        setActiveSessionId(nextSessions[0].id);
      }
    }
  };

  // Rename session
  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle, updatedAt: new Date().toISOString() } : s))
    );
  };

  // Reset to default sample data
  const handleResetToSampleData = () => {
    if (confirm("Reset to default historical research archives? Custom chats in this browser will be replaced.")) {
      const freshEmpty = createNewChatSession("standard");
      const fullList = [freshEmpty, ...SAMPLE_CHAT_SESSIONS];
      setSessions(fullList);
      setActiveSessionId(freshEmpty.id);
      saveChatSessions(fullList);
    }
  };

  // Pin a quote or note into the active session notebook
  const handlePinNote = (noteData: Omit<ResearchDossierItem, "id" | "addedAt">) => {
    const newNote: ResearchDossierItem = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sessionId: activeSession.id,
      addedAt: new Date().toISOString(),
      ...noteData,
    };

    updateActiveSession((prev) => ({
      ...prev,
      researchNotes: [newNote, ...(prev.researchNotes || [])],
      updatedAt: new Date().toISOString(),
    }));
  };

  // Delete note from notebook
  const handleDeleteNote = (noteId: string) => {
    updateActiveSession((prev) => ({
      ...prev,
      researchNotes: (prev.researchNotes || []).filter((n) => n.id !== noteId),
      updatedAt: new Date().toISOString(),
    }));
  };

  // Handle send message
  const handleSend = async (question: string) => {
    const q = question.trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: q,
      timestamp: new Date().toISOString(),
      mode: currentMode,
    };

    // Determine smart title if first message
    const isFirst = messages.length === 0;
    const smartTitle = isFirst ? (q.length > 42 ? q.slice(0, 42) + "…" : q) : activeSession.title;

    // Append user message immediately
    updateActiveSession((prev) => ({
      ...prev,
      title: smartTitle,
      messages: [...prev.messages, userMsg],
      updatedAt: new Date().toISOString(),
    }));

    setInput("");
    setLoading(true);

    try {
      let response: ChatMessage;
      if (currentMode === "research") {
        response = await askArchiveResearch(q, activeSession.researchParameters);
      } else {
        response = await askArchive(q);
      }

      updateActiveSession((prev) => ({
        ...prev,
        messages: [...prev.messages, response],
        updatedAt: new Date().toISOString(),
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleExportActiveSession = () => {
    const md = exportDossierAsMarkdown(activeSession);
    downloadFile(
      `${activeSession.title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 30)}_dossier.md`,
      md
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[var(--background)]">
      {/* 1. Left Drawer: Chat History Sidebar */}
      <ChatHistorySidebar
        sessions={sessions}
        activeSessionId={activeSession.id}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        onSelectSession={(id) => setActiveSessionId(id)}
        onCreateSession={(mode) => handleCreateSession(mode)}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onResetToSampleData={handleResetToSampleData}
      />

      {/* 2. Main Center Chat & Research Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Workspace Top Bar */}
        <header className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Toggle sidebar button */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-1.5 rounded border border-[var(--border)] hover:bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              title={sidebarOpen ? "Hide conversations history" : "Show conversations history"}
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>

            {/* Title & Mode indicator */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-semibold text-base sm:text-lg text-[var(--foreground)] truncate">
                  {activeSession.title}
                </h1>
                {currentMode === "research" ? (
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-600/15 border border-amber-600/30 text-amber-900 dark:text-amber-200 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                    RESEARCH WORKBENCH
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                    Standard Grounded Q&A
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mode Switcher & Tools */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mode Toggle Switcher Pill */}
            <div className="flex items-center p-0.5 bg-[var(--background)] border border-[var(--border)] rounded-sm text-xs font-mono shadow-xs">
              <button
                onClick={() => handleToggleMode("standard")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                  currentMode === "standard"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
                title="Conversational ground truth mode"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Standard</span>
              </button>

              <button
                onClick={() => handleToggleMode("research")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                  currentMode === "research"
                    ? "bg-amber-600 text-white font-bold shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-amber-600"
                }`}
                title="Academic synthesis, multi-source matrix, and citation generator mode"
              >
                <Microscope className="w-3.5 h-3.5" />
                <span>Research Mode</span>
              </button>
            </div>

            {/* Research Dossier Notebook Toggle */}
            <button
              onClick={() => setNotebookOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs border transition-colors ${
                notebookOpen || (activeSession.researchNotes && activeSession.researchNotes.length > 0)
                  ? "border-amber-600/50 bg-amber-600/10 text-amber-900 dark:text-amber-200 font-semibold"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
              title="Open Research Dossier & Pinned Citations Notebook"
            >
              <BookMarked className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Notebook</span>
              {activeSession.researchNotes && activeSession.researchNotes.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                  {activeSession.researchNotes.length}
                </span>
              )}
            </button>

            {/* Export Session Dossier */}
            <button
              onClick={handleExportActiveSession}
              className="p-1.5 rounded border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 transition-colors"
              title="Export conversation as Markdown dossier"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Explore Archive Link */}
            <Link
              to="/garden"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs border border-[var(--border)] rounded hover:border-[var(--primary)]/50 hover:text-[var(--primary)] transition-colors"
              title="Explore the Knowledge Garden"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Garden</span>
            </Link>
          </div>
        </header>

        {/* Ambient Scholarly Research Banner (When in Research Mode) */}
        {currentMode === "research" && (
          <div className="bg-amber-600/10 border-b border-amber-600/25 px-4 py-2.5 flex items-center justify-between text-xs text-amber-950 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="text-[11px] leading-tight">
                <strong>Scholarly Research Laboratory Active:</strong> Grounded in 22 BAWS volumes, Constituent Assembly proceedings, and High Court archives. Every inquiry yields an interactive 4-tab dossier (Synthesis, Corroboration Matrix, Verbatim Quotes, and APA/BibTeX Citation Studio).
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-amber-900 dark:text-amber-300">
              <span className="px-2 py-0.5 rounded bg-amber-600/15 font-semibold">Strict Zero-Hallucination</span>
            </div>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
          <div className="max-w-4xl mx-auto space-y-5">
            {/* Research Parameters Bar (if research mode is active) */}
            {currentMode === "research" && (
              <ResearchParametersBar
                parameters={
                  activeSession.researchParameters || {
                    era: "all",
                    strictPrimaryOnly: true,
                    synthesisFormat: "synthesis",
                    bawsVolumeFilter: "all",
                  }
                }
                onChange={(newParams) => {
                  updateActiveSession((prev) => ({
                    ...prev,
                    researchParameters: newParams,
                    updatedAt: new Date().toISOString(),
                  }));
                }}
              />
            )}

            {/* Archival Disclaimer */}
            <div className="p-3 rounded border border-[var(--border)] bg-[var(--muted)]/50 flex gap-2.5 text-xs text-[var(--muted-foreground)]">
              <Info className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {t("ask.disclaimer")} Every statement indicates confidence tiers and primary institutional provenance. Where primary records do not document clock-time or specific details, the system explicitly disclaims rather than extrapolating.
              </p>
            </div>

            {/* Empty State: DISPLAYED AT STARTING POINT */}
            {messages.length === 0 ? (
              currentMode === "research" ? (
                /* RESEARCH MODE EMPTY STATE */
                <div className="py-8 sm:py-12 space-y-6">
                  <div className="text-center space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-full bg-amber-600/15 text-amber-600 flex items-center justify-center shadow-xs">
                      <Microscope className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                        Historiographical Research Studio
                      </h2>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed mt-1">
                        Formulate academic research inquiries across the complete 22-volume corpus of Dr. B. R. Ambedkar, Parliamentary debates, and judicial records.
                      </p>
                    </div>
                  </div>

                  {/* Dedicated Research Lens Selection Deck */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]">
                      <span>Select a Research Lens & Primary Investigation:</span>
                      <span className="text-amber-600 font-bold">4 Specialized Historical Domains</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {RESEARCH_LENSES.map((lens) => {
                        const Icon = lens.icon;
                        return (
                          <button
                            key={lens.id}
                            onClick={() => handleSend(lens.query)}
                            className="p-4 rounded-sm border-2 border-amber-600/20 hover:border-amber-600 bg-[var(--card)] hover:bg-amber-500/5 transition-all text-left group shadow-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-amber-600/15 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-mono text-xs font-bold text-amber-900 dark:text-amber-200">
                                  {lens.label}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                Investigate →
                              </span>
                            </div>
                            <p className="text-xs text-[var(--foreground)] font-serif italic leading-relaxed line-clamp-2">
                              "{lens.query}"
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* STANDARD MODE EMPTY STATE */
                <div className="text-center py-12 sm:py-16 space-y-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                    <MessageSquare className="w-7 h-7" />
                  </div>

                  <div>
                    <h2 className="font-display text-2xl font-semibold mb-2 text-[var(--foreground)]">
                      Ask the Ambedkar Archive
                    </h2>
                    <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed">
                      Ask direct questions about Dr. Ambedkar's life, work, speeches, and legacy. Answers are grounded in the verified archival record.
                    </p>
                  </div>

                  {/* Standard Questions */}
                  <div className="max-w-xl mx-auto space-y-2 text-left">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] text-center mb-2">
                      Example Inquiries
                    </p>
                    {EXAMPLE_QUESTIONS_STANDARD.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="w-full text-xs sm:text-sm p-3 border border-[var(--border)] rounded bg-[var(--card)] hover:border-[var(--primary)] hover:bg-[var(--background)] transition-all flex items-center justify-between group"
                      >
                        <span className="text-[var(--foreground)]">{q}</span>
                        <Send className="w-3.5 h-3.5 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )
            ) : (
              /* Message List */
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "user" ? (
                    <div className="max-w-[85%] sm:max-w-[80%] bg-[var(--primary)] text-[var(--primary-foreground)] rounded-sm px-4 py-3 shadow-xs">
                      <p className="text-xs sm:text-sm leading-relaxed">{msg.content}</p>
                      <span className="block text-[9px] font-mono text-[var(--primary-foreground)]/70 text-right mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ) : msg.mode === "research" || msg.researchData ? (
                    /* Scholarly Research Mode Assistant Message */
                    <div className="w-full max-w-4xl">
                      <ResearchMessageCard
                        message={msg}
                        onPinQuote={handlePinNote}
                      />
                    </div>
                  ) : (
                    /* Standard Grounded Assistant Message */
                    <div className="max-w-[90%] sm:max-w-[85%] space-y-3">
                      {/* Extracted Entities Tag Bar */}
                      {msg.extractedEntities && (
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-[var(--muted-foreground)] bg-[var(--muted)]/40 p-2 rounded border border-[var(--border)]">
                          <span className="text-[var(--primary)] font-bold">Intent:</span>
                          {msg.extractedEntities.events?.map((ev) => (
                            <span
                              key={ev}
                              className="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]"
                            >
                              Event: {ev}
                            </span>
                          ))}
                          {msg.extractedEntities.people?.map((p) => (
                            <span
                              key={p}
                              className="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]"
                            >
                              Figure: {p}
                            </span>
                          ))}
                          {msg.extractedEntities.topics?.map((top) => (
                            <span
                              key={top}
                              className="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]"
                            >
                              Topic: {top}
                            </span>
                          ))}
                          {msg.extractedEntities.locations?.map((loc) => (
                            <span
                              key={loc}
                              className="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]"
                            >
                              Place: {loc}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Archival Time Warning */}
                      {msg.timeWarning && (
                        <div className="p-3 rounded border border-amber-500/30 bg-amber-500/10 text-xs font-mono text-amber-800 dark:text-amber-300 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                          <span>{msg.timeWarning}</span>
                        </div>
                      )}

                      {/* Confidence badge */}
                      {msg.confidence && (
                        <div
                          className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm border ${
                            CONFIDENCE_META[msg.confidence]?.bg ?? CONFIDENCE_META.medium.bg
                          }`}
                        >
                          {(() => {
                            const Icon = CONFIDENCE_META[msg.confidence]?.icon ?? Info;
                            return (
                              <Icon
                                className={`w-3.5 h-3.5 ${
                                  CONFIDENCE_META[msg.confidence]?.color ?? "text-amber-500"
                                }`}
                              />
                            );
                          })()}
                          <span
                            className={
                              CONFIDENCE_META[msg.confidence]?.color ?? "text-amber-500"
                            }
                          >
                            {CONFIDENCE_META[msg.confidence]?.label ?? "Archival Confidence"}
                          </span>
                        </div>
                      )}

                      {/* Answer Content */}
                      <div className="border border-[var(--border)] rounded-sm p-4 bg-[var(--card)] shadow-xs">
                        <p className="text-xs sm:text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-line">
                          {msg.content}
                        </p>
                      </div>

                      {/* Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-1">
                            <FileText className="w-3 h-3 text-[var(--primary)]" />
                            Archival Sources (Prioritized Institutional Hierarchy)
                          </p>
                          {msg.sources.map((src, i) => (
                            <div
                              key={i}
                              className="border border-[var(--border)] rounded-sm p-3 bg-[var(--muted)] space-y-1"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2">
                                  <FileText className="w-3.5 h-3.5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    {src.documentId ? (
                                      <Link
                                        to={`/documents/${src.documentId}`}
                                        className="text-xs font-semibold text-[var(--primary)] hover:underline"
                                      >
                                        {src.title}
                                      </Link>
                                    ) : (
                                      <span className="text-xs font-semibold text-[var(--foreground)]">
                                        {src.title}
                                      </span>
                                    )}
                                    {src.page && (
                                      <span className="text-[10px] font-mono text-[var(--muted-foreground)] ml-2">
                                        ({src.page})
                                      </span>
                                    )}
                                    <blockquote className="mt-1 text-xs text-[var(--muted-foreground)] italic border-l border-[var(--primary)]/40 pl-2 leading-relaxed">
                                      "{src.excerpt}"
                                    </blockquote>
                                  </div>
                                </div>
                                {src.priority && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] font-bold whitespace-nowrap">
                                    Priority #{src.priority}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="border border-[var(--border)] rounded-sm p-4 bg-[var(--card)] shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 rounded-full animate-bounce ${
                            currentMode === "research" ? "bg-amber-600" : "bg-[var(--primary)]"
                          }`}
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono text-[var(--muted-foreground)]">
                      {currentMode === "research"
                        ? "Traversing knowledge graph & multi-source verification…"
                        : "Querying grounded archival record…"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Bar Footer */}
        <div className="p-3 sm:p-4 border-t border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-xs flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    currentMode === "research"
                      ? "Enter scholarly research query (e.g. Mahad legal trajectory, Article 17 debates, currency reform)…"
                      : t("ask.placeholder")
                  }
                  disabled={loading}
                  className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-sm text-xs sm:text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`px-5 py-3 rounded-sm transition-all disabled:opacity-40 flex items-center gap-2 text-xs sm:text-sm font-medium ${
                  currentMode === "research"
                    ? "bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                    : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
                }`}
              >
                {currentMode === "research" ? (
                  <Microscope className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {currentMode === "research" ? "Run Research" : t("ask.send")}
                </span>
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--muted-foreground)] px-1">
              <span className="font-mono">
                {currentMode === "research"
                  ? "Mode: Historiographical Research Laboratory (Tier-1 Primary Verified)"
                  : "Mode: Evidence-Grounded Conversational Archive"}
              </span>
              <button
                onClick={() => handleCreateSession(currentMode)}
                className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1 font-mono text-[10px]"
              >
                <PlusCircle className="w-3 h-3" />
                <span>+ Blank Session</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Right Drawers / Panels */}
      {/* A: Sources SidePanel (for conversation-wide source browsing) */}
      <SidePanel messages={messages} />

      {/* B: Research Dossier Notebook */}
      <ResearchDossierNotebook
        session={activeSession}
        isOpen={notebookOpen}
        onClose={() => setNotebookOpen(false)}
        onAddNote={handlePinNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}
