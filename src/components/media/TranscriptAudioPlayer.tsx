import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  FastForward,
  Headphones,
  SkipForward,
  Sparkles,
  Check,
  Globe,
} from "lucide-react";

interface TranscriptAudioPlayerProps {
  text: string;
  title: string;
  language?: string; // 'en' | 'hi' | 'mr' etc.
  pageNumber: number;
  totalPages: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onPageSelect?: (page: number) => void;
}

export default function TranscriptAudioPlayer({
  text,
  title,
  language = "en",
  pageNumber,
  totalPages,
  onNextPage,
  onPrevPage,
  onPageSelect,
}: TranscriptAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize SpeechSynthesis and Voice List
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      // Auto-pick best matching voice
      const targetLang = language.toLowerCase();
      const matched = voices.find((v) => {
        const vLang = v.lang.toLowerCase();
        if (targetLang === "hi" && (vLang.includes("hi") || vLang.includes("hindi"))) return true;
        if (targetLang === "mr" && (vLang.includes("mr") || vLang.includes("marathi") || vLang.includes("hi"))) return true;
        if (targetLang === "en" && (vLang.includes("en-in") || vLang.includes("en-us") || vLang.includes("en-gb"))) return true;
        return false;
      });

      if (matched) {
        setSelectedVoice(matched);
      } else if (voices.length > 0) {
        setSelectedVoice(voices[0]);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  // Clean text for speech synthesis (strip markdown or HTML tags)
  const getCleanSpeechText = (rawText: string) => {
    if (!rawText) return "";
    return rawText
      .replace(/<[^>]*>?/gm, "") // remove HTML tags
      .replace(/\[Page\s*\d+\]/gi, "") // remove [Page X] tags
      .replace(/---+/g, "")
      .trim();
  };

  const speakCurrentPage = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel(); // stop existing speech

    const cleanText = getCleanSpeechText(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = speechRate;
    utterance.volume = isMuted ? 0 : 1;

    // Set utterance language
    if (language === "hi") utterance.lang = "hi-IN";
    else if (language === "mr") utterance.lang = "mr-IN";
    else utterance.lang = "en-US";

    let wordCount = cleanText.split(/\s+/).length;
    let spokenWords = 0;

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        spokenWords++;
        const percent = Math.min(100, Math.round((spokenWords / wordCount) * 100));
        setProgressPercent(percent);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgressPercent(100);

      // Auto-advance to next page if enabled
      if (autoAdvance && pageNumber < totalPages && onNextPage) {
        setTimeout(() => {
          onNextPage();
        }, 800);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    synth.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
    setProgressPercent(0);
  };

  // If text or page changes while playing, auto-read new page if playing
  useEffect(() => {
    if (isPlaying && !isPaused) {
      speakCurrentPage();
    } else {
      setProgressPercent(0);
    }
  }, [pageNumber, text]);

  const togglePlayPause = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    } else {
      speakCurrentPage();
    }
  };

  const handleStop = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgressPercent(0);
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    if (isPlaying && utteranceRef.current) {
      speakCurrentPage();
    }
  };

  return (
    <div className="rounded-xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--card)] via-[var(--card)] to-[var(--primary)]/5 p-4 shadow-md space-y-3">
      {/* Top row: Title + Equalizer visualizer */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--foreground)]">
                Audiobook Transcript Reader
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--primary)]/15 text-[var(--primary)] font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                AI Voice Synthesis
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Listening to <span className="font-semibold text-[var(--foreground)]">Page {pageNumber}</span> of {totalPages}
            </p>
          </div>
        </div>

        {/* Animated Equalizer Waveform when playing */}
        {isPlaying && !isPaused && (
          <div className="flex items-end gap-0.5 h-4 px-2 py-1 rounded bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            <span className="w-1 bg-[var(--primary)] rounded-full animate-bounce h-2" style={{ animationDelay: "0ms" }} />
            <span className="w-1 bg-[var(--primary)] rounded-full animate-bounce h-4" style={{ animationDelay: "150ms" }} />
            <span className="w-1 bg-[var(--primary)] rounded-full animate-bounce h-3" style={{ animationDelay: "300ms" }} />
            <span className="w-1 bg-[var(--primary)] rounded-full animate-bounce h-4" style={{ animationDelay: "450ms" }} />
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isPlaying && (
        <div className="space-y-1">
          <div className="w-full bg-[var(--muted)] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[var(--primary)] h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted-foreground)]">
            <span>Progress: {progressPercent}%</span>
            <span>{isPaused ? "Paused" : "Reading page..."}</span>
          </div>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[var(--border)]/60">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlayPause}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer ${
              isPlaying && !isPaused
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)]"
            }`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : isPaused ? (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Listen Page {pageNumber}</span>
              </>
            )}
          </button>

          {isPlaying && (
            <button
              type="button"
              onClick={handleStop}
              className="p-2 rounded-lg border border-[var(--border)] hover:bg-red-500/10 hover:text-red-600 text-[var(--muted-foreground)] transition-colors cursor-pointer"
              title="Stop Audio"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          )}

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-[var(--muted)] p-1 rounded-lg border border-[var(--border)] text-xs font-mono">
            <FastForward className="w-3 h-3 text-[var(--muted-foreground)] ml-1" />
            {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleRateChange(rate)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                  speechRate === rate
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Voice & Auto Advance Options */}
        <div className="flex items-center gap-3 text-xs">
          {/* Auto Advance Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none font-mono text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
              className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span>Auto-next page</span>
          </label>

          {/* Voice Selector */}
          {availableVoices.length > 0 && (
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 absolute left-2 text-[var(--muted-foreground)] pointer-events-none" />
              <select
                value={selectedVoice?.name || ""}
                onChange={(e) => {
                  const v = availableVoices.find((voice) => voice.name === e.target.value);
                  if (v) {
                    setSelectedVoice(v);
                    if (isPlaying) speakCurrentPage();
                  }
                }}
                className="pl-7 pr-3 py-1 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[10px] font-mono text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] max-w-[150px] truncate"
              >
                {availableVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
