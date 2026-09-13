import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Send, FileText, AlertCircle, CheckCircle, MessageSquare, Info, Sparkles } from "lucide-react";
import { askArchive } from "@/services/api";
import type { ChatMessage } from "@/types/archive";

const EXAMPLE_QUESTIONS = [
  "What was the significance of the Mahad Satyagraha?",
  "What did Ambedkar say about democracy in his final speech?",
  "How did the Poona Pact affect Dalit political representation?",
  "Why did Ambedkar convert to Buddhism?",
];

const CONFIDENCE_META = {
  high: {
    label: "High archival confidence",
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  },
  medium: {
    label: "Medium archival confidence",
    icon: Info,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  },
  low: {
    label: "Low archival confidence",
    icon: AlertCircle,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  },
  insufficient: {
    label: "Insufficient archival evidence",
    icon: AlertCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  },
};

export default function AskPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (question: string) => {
    const q = question.trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: q,
      timestamp: new Date().toISOString(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await askArchive(q);
      setMessages((m) => [...m, response]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-5 h-5 text-[var(--primary)]" />
          <h1 className="font-display text-3xl font-semibold">{t("ask.title")}</h1>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">{t("ask.subtitle")}</p>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 p-4 border border-[var(--border)] rounded-sm bg-[var(--muted)] flex gap-3">
        <Info className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          {t("ask.disclaimer")} Each response indicates its confidence level and cites archival sources.
          Where evidence is insufficient, the system explicitly states this rather than speculating.
        </p>
      </div>

      {/* Chat area */}
      <div className="min-h-[400px] mb-4 space-y-4">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto mb-4 rounded-sm bg-[var(--primary)]/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">Ask the Archive</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
              Ask questions about Dr. Ambedkar's life, work, speeches, and legacy. All answers are grounded
              in the archival record.
            </p>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-[var(--muted-foreground)] font-mono uppercase tracking-widest mb-2">
                Example questions
              </p>
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-sm text-left px-4 py-2.5 border border-[var(--border)] rounded-sm hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all max-w-md w-full"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "user" ? (
                <div className="max-w-[80%] bg-[var(--primary)] text-[var(--primary-foreground)] rounded-sm px-4 py-3">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              ) : (
                <div className="max-w-[90%] space-y-3">
                  {/* Confidence badge */}
                  {msg.confidence && (
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm border ${
                        CONFIDENCE_META[msg.confidence].bg
                      }`}
                    >
                      {(() => {
                        const Icon = CONFIDENCE_META[msg.confidence].icon;
                        return <Icon className={`w-3.5 h-3.5 ${CONFIDENCE_META[msg.confidence].color}`} />;
                      })()}
                      <span className={CONFIDENCE_META[msg.confidence].color}>
                        {CONFIDENCE_META[msg.confidence].label}
                      </span>
                    </div>
                  )}

                  {/* Answer */}
                  <div className="border border-[var(--border)] rounded-sm p-4 bg-[var(--card)]">
                    <p className="text-sm leading-relaxed text-[var(--foreground)]">{msg.content}</p>
                  </div>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
                        Archival sources
                      </p>
                      {msg.sources.map((src, i) => (
                        <div
                          key={i}
                          className="border border-[var(--border)] rounded-sm p-3 bg-[var(--muted)]"
                        >
                          <div className="flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/documents/${src.documentId}`}
                                className="text-xs font-medium text-[var(--primary)] hover:underline"
                              >
                                {src.title}
                              </Link>
                              {src.page && (
                                <span className="text-[10px] font-mono text-[var(--muted-foreground)] ml-2">
                                  p. {src.page}
                                </span>
                              )}
                              <blockquote className="mt-1.5 text-xs text-[var(--muted-foreground)] italic border-l border-[var(--primary)]/40 pl-2 leading-relaxed">
                                "{src.excerpt}"
                              </blockquote>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Insufficient evidence notice */}
                  {msg.confidence === "insufficient" && (
                    <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5 px-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      The archive does not contain sufficient evidence to answer this question with confidence.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="border border-[var(--border)] rounded-sm p-4 bg-[var(--card)]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-[var(--muted-foreground)]">Searching the archive…</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("ask.placeholder")}
          disabled={loading}
          className="flex-1 px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-sm text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium">{t("ask.send")}</span>
        </button>
      </form>

      {messages.length > 0 && (
        <button
          onClick={() => setMessages([])}
          className="mt-3 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          Clear conversation
        </button>
      )}
    </div>
  );
}
