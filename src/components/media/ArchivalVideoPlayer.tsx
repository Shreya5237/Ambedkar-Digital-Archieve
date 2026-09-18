import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  Film,
  Sparkles,
  Award,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";
import type { HistoricalVideo } from "@/types/archive";

interface ArchivalVideoPlayerProps {
  video: HistoricalVideo;
}

export default function ArchivalVideoPlayer({ video }: ArchivalVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [filmVintageFilter, setFilmVintageFilter] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm space-y-3">
      {/* Video Container with Archival Film Effect */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.posterUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          muted={isMuted}
          className={`w-full h-full object-cover transition-all duration-300 ${
            filmVintageFilter
              ? "grayscale contrast-125 sepia-[0.25] brightness-95"
              : "filter-none"
          }`}
          playsInline
        />

        {/* Vintage Film Projector Noise & Vignette Overlay */}
        {filmVintageFilter && (
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.65)_100%)] mix-blend-multiply opacity-80" />
        )}

        {/* Newsreel Title Overlay Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/75 text-amber-300 border border-amber-500/40 uppercase backdrop-blur-sm flex items-center gap-1.5">
            <Film className="w-3 h-3" />
            35mm Archival Motion Picture Newsreel
          </span>
          {video.duration && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/75 text-white backdrop-blur-sm">
              {video.duration}
            </span>
          )}
        </div>

        {/* Center Play Button Overlay */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute z-20 w-16 h-16 rounded-full bg-amber-500/90 hover:bg-amber-500 text-black flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95"
            aria-label="Play video"
          >
            <Play className="w-7 h-7 ml-1 fill-black" />
          </button>
        )}

        {/* Bottom Video Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 flex flex-col gap-2">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/30 rounded appearance-none cursor-pointer accent-amber-400"
          />

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="hover:text-amber-300 transition-colors">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (videoRef.current) videoRef.current.muted = !isMuted;
                }}
                className="hover:text-amber-300 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="font-mono text-[11px] text-white/80">
                {formatTime(currentTime)} / {formatTime(duration || 360)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilmVintageFilter(!filmVintageFilter)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                  filmVintageFilter
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-white/10 text-white/70 border-white/20"
                }`}
                title="Toggle 1950s 35mm film grain & sepia filter"
              >
                <Layers className="w-3 h-3 inline mr-1" />
                {filmVintageFilter ? "Vintage 35mm" : "Modern"}
              </button>
              <button onClick={toggleFullScreen} className="hover:text-amber-300 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Details & Archival Provenance */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap text-xs text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--foreground)]">{video.sourceInstitution}</span>
            {video.date && <span>• {video.date}</span>}
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[var(--muted)] uppercase">
              {video.license}
            </span>
          </div>
          <h4 className="text-sm font-bold text-[var(--foreground)]">{video.title}</h4>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{video.description}</p>
        </div>

        {/* Provenance Banner */}
        <div className="p-2.5 rounded bg-[var(--muted)]/50 border border-[var(--border)] text-[11px] font-mono text-[var(--muted-foreground)] space-y-1">
          <p><strong>Film Preservation:</strong> {video.provenance}</p>
        </div>

        {/* Transcript toggle */}
        {video.transcript && (
          <div>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--primary)] hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showTranscript ? "Hide Newsreel Commentary" : "View Newsreel Commentary & Visual Notes"}</span>
            </button>
            {showTranscript && (
              <div className="mt-2 p-3 rounded bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] leading-relaxed italic">
                {video.transcript}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
