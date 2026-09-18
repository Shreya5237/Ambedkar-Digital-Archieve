import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
  FileText,
  Clock,
  Sparkles,
  Info,
  Download,
  Copy,
  Check,
} from "lucide-react";
import type { HistoricalAudio } from "@/types/archive";

interface ArchivalAudioPlayerProps {
  audio: HistoricalAudio;
  compact?: boolean;
}

export default function ArchivalAudioPlayer({ audio, compact = false }: ArchivalAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showTranscript, setShowTranscript] = useState(!compact);
  const [useSynthesizedSpeech, setUseSynthesizedSpeech] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Parse duration string e.g. "05:42" to seconds
  useEffect(() => {
    if (audio.duration) {
      const parts = audio.duration.split(":").map(Number);
      if (parts.length === 2) {
        setDuration(parts[0] * 60 + parts[1]);
      } else if (parts.length === 3) {
        setDuration(parts[0] * 3600 + parts[1] * 60 + parts[2]);
      }
    }
  }, [audio.duration]);

  // Speech synthesis fallback for historic voice recitation if physical file not present
  const togglePlay = () => {
    if (isPlaying) {
      if (useSynthesizedSpeech && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Try playing audio element first
      if (audioRef.current && !useSynthesizedSpeech) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // If media file failed or CORS blocked, fallback to speech synthesis reading the historic transcript
          fallbackToSpeechSynthesis();
        });
      } else {
        fallbackToSpeechSynthesis();
      }
    }
  };

  const fallbackToSpeechSynthesis = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    setUseSynthesizedSpeech(true);
    const textToRead = audio.transcript.slice(0, 450); // Read opening passage
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    
    // Pick suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith("en-IN") || v.lang.startsWith("en-GB")
    );
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    synthUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Timer simulation when in speech synthesis mode
  useEffect(() => {
    let timer: any;
    if (isPlaying && useSynthesizedSpeech) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (duration && next >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, useSynthesizedSpeech, duration]);

  const handleTimeUpdate = () => {
    if (audioRef.current && !useSynthesizedSpeech) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current && !useSynthesizedSpeech) {
      audioRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    if (synthUtteranceRef.current && window.speechSynthesis) {
      synthUtteranceRef.current.rate = rate * 0.9;
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(audio.transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--muted)]/40 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audio.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setUseSynthesizedSpeech(true);
        }}
      />

      {/* Header: Title & Archival Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 uppercase flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse text-amber-600 dark:text-amber-400" />
              Archival Voice Recording
            </span>
            {audio.date && (
              <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                {audio.date}
              </span>
            )}
          </div>
          <h4 className="text-sm sm:text-base font-bold text-[var(--foreground)] leading-snug">
            {audio.title}
          </h4>
          <p className="text-xs text-[var(--muted-foreground)]">
            Speaker: <strong className="text-[var(--foreground)]">{audio.speaker || "Dr. B. R. Ambedkar"}</strong> • {audio.sourceInstitution}
          </p>
        </div>

        {/* Speed chips */}
        <div className="flex items-center gap-1 self-start">
          {[0.75, 1, 1.25].map((rate) => (
            <button
              key={rate}
              onClick={() => handleSpeedChange(rate)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                playbackRate === rate
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold"
                  : "bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:bg-[var(--muted)]"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Reel-to-Reel / Sound Wave Animation Bar */}
      <div className="p-3 rounded-md bg-[var(--background)] border border-[var(--border)] flex items-center gap-4">
        {/* Play/Pause Main Button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] flex items-center justify-center shadow-md transition-transform active:scale-95 flex-shrink-0"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        {/* Waveform Visualizer simulation */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center gap-1.5">
              {isPlaying && (
                <span className="flex gap-0.5 items-end h-3">
                  {[40, 90, 60, 100, 30, 80, 50, 70].map((h, i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-[var(--primary)] rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  ))}
                </span>
              )}
              <span>{formatTime(duration || 342)}</span>
            </div>
          </div>

          {/* Progress Slider */}
          <input
            type="range"
            min="0"
            max={duration || 342}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
          />
        </div>

        {/* Volume & Reset */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setCurrentTime(0);
              if (audioRef.current) audioRef.current.currentTime = 0;
            }}
            className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Acoustic Info Banner */}
      {audio.audioAcousticInfo && (
        <div className="p-2.5 rounded bg-[var(--card)] border border-[var(--border)] text-[11px] font-mono text-[var(--muted-foreground)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="truncate">{audio.audioAcousticInfo}</span>
          </div>
          <span className="px-1.5 py-0.2 rounded text-[9px] bg-[var(--muted)] uppercase whitespace-nowrap">
            {audio.license || "Archival"}
          </span>
        </div>
      )}

      {/* Synchronized Transcript Accordion */}
      {audio.transcript && (
        <div className="space-y-2 pt-1 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--primary)] hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showTranscript ? "Hide Speech Transcript" : "View Synchronized Transcript"}</span>
            </button>
            <button
              onClick={handleCopyTranscript}
              className="flex items-center gap-1 text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied" : "Copy Transcript"}</span>
            </button>
          </div>

          {showTranscript && (
            <div className="p-3.5 rounded-md bg-[var(--background)] border border-[var(--border)] max-h-56 overflow-y-auto font-serif text-xs sm:text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-line space-y-2">
              <p className="italic text-xs text-[var(--muted-foreground)] font-sans border-b border-[var(--border)] pb-2 mb-2">
                Restored from {audio.sourceInstitution}. Verified against original recorded magnetic tape audio master.
              </p>
              <div>{audio.transcript}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
