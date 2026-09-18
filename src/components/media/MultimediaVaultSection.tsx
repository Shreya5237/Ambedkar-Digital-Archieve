import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Radio,
  Film,
  Image as ImageIcon,
  BookOpen,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Download,
  CheckCircle2,
  HelpCircle,
  Eye,
  Search,
  Languages,
  Filter,
} from "lucide-react";
import {
  englishVolumesCatalog,
  hindiVolumesCatalog,
  allArchivalVolumes,
  historicalAudios,
  historicalVideos,
  historicalPhotoGallery,
  volumeQADatabase,
} from "@/data/multimediaData";
import ArchivalAudioPlayer from "./ArchivalAudioPlayer";
import ArchivalVideoPlayer from "./ArchivalVideoPlayer";
import VolumeCitationCard from "./VolumeCitationCard";
import { imageCategories } from "@/data/historicalImagesData";

type MediaVaultTab = "english" | "hindi" | "audio" | "video" | "photos";

export default function MultimediaVaultSection() {
  const [activeTab, setActiveTab] = useState<MediaVaultTab>("english");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof historicalPhotoGallery)[0] | null>(null);
  const [photoCategory, setPhotoCategory] = useState<string>("All");

  // Filter volumes based on search
  const filteredEnglish = useMemo(() => {
    if (!searchQuery.trim()) return englishVolumesCatalog;
    const q = searchQuery.toLowerCase();
    return englishVolumesCatalog.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.summary.toLowerCase().includes(q) ||
        v.keyTexts?.some((k) => k.toLowerCase().includes(q)) ||
        `volume ${v.volumeNumber}`.includes(q)
    );
  }, [searchQuery]);

  const filteredHindi = useMemo(() => {
    if (!searchQuery.trim()) return hindiVolumesCatalog;
    const q = searchQuery.toLowerCase();
    return hindiVolumesCatalog.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.summary.toLowerCase().includes(q) ||
        v.keyTexts?.some((k) => k.toLowerCase().includes(q)) ||
        `खंड ${v.volumeNumber}`.includes(q) ||
        `volume ${v.volumeNumber}`.includes(q)
    );
  }, [searchQuery]);

  return (
    <section className="py-12 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--primary)] text-[var(--primary-foreground)] uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Archival Heritage Media Vault
              </span>
              <span className="text-xs font-mono text-[var(--muted-foreground)]">
                60 Primary Volumes (English & Hindi) • Sound Archives • Motion Pictures
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--foreground)] tracking-tight">
              Primary Volumes, Historic Voices & Motion Pictures
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl">
              Access the complete 20 English BAWS volumes, all 40 Hindi volumes of Dr. Ambedkar Sampurna Vangmaya, rare BBC voice broadcasts, Constituent Assembly audio, and 35mm Films Division newsreels.
            </p>
          </div>

          {/* Tab navigation pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[var(--muted)]/60 border border-[var(--border)] rounded-md flex-shrink-0 overflow-x-auto max-w-full">
            <button
              onClick={() => {
                setActiveTab("english");
                setSearchQuery("");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors whitespace-nowrap ${
                activeTab === "english"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm font-bold border border-[var(--border)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>English Volumes ({englishVolumesCatalog.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("hindi");
                setSearchQuery("");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors whitespace-nowrap ${
                activeTab === "hindi"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm font-bold border border-[var(--border)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-orange-500" />
              <span>हिंदी संपूर्ण वाङ्मय ({hindiVolumesCatalog.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("audio")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors whitespace-nowrap ${
                activeTab === "audio"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm font-bold border border-[var(--border)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-500" />
              <span>Voice & Radio ({historicalAudios.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors whitespace-nowrap ${
                activeTab === "video"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm font-bold border border-[var(--border)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <Film className="w-3.5 h-3.5 text-emerald-500" />
              <span>Film Newsreels ({historicalVideos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("photos")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors whitespace-nowrap ${
                activeTab === "photos"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm font-bold border border-[var(--border)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
              <span>Photographs ({historicalPhotoGallery.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ENGLISH OFFICIAL VOLUMES */}
        {activeTab === "english" && (
          <div className="space-y-6 animate-fade-in">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search English volumes, e.g. Annihilation, 13, Economics..."
                  className="w-full pl-9 pr-3 py-1.5 rounded text-xs bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
              <span className="text-xs font-mono text-[var(--muted-foreground)]">
                Showing {filteredEnglish.length} of {englishVolumesCatalog.length} Volumes in <code>data/English_doc/</code>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[850px] overflow-y-auto pr-1">
              {filteredEnglish.map((vol) => (
                <div
                  key={vol.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm hover:border-[var(--primary)]/60 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30 uppercase flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        BAWS Volume {vol.volumeNumber}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                        {vol.pageCount} pp • English
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {vol.title}
                      </h3>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2 leading-relaxed">
                        {vol.summary}
                      </p>
                    </div>

                    {vol.keyTexts && vol.keyTexts.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {vol.keyTexts.map((txt) => (
                          <span
                            key={txt}
                            className="px-2 py-0.5 rounded text-[10px] bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]"
                          >
                            {txt}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="p-2.5 rounded bg-[var(--muted)]/40 border border-[var(--border)] text-[10px] font-mono text-[var(--muted-foreground)] space-y-0.5">
                      <p><strong>Institution:</strong> {vol.sourceInstitution}</p>
                      <p><strong>Source File:</strong> <code>data/English_doc/{vol.id}</code></p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
                    <a
                      href={vol.fileUrl}
                      download
                      className="inline-flex items-center gap-1 text-xs font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>

                    <Link
                      to={`/documents/${vol.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
                    >
                      <span>Read & Inspect Volume</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Ground-truth QA component linking data.json */}
            <div className="pt-2">
              <VolumeCitationCard />
            </div>
          </div>
        )}

        {/* TAB 2: HINDI VOLUMES / संपूर्ण वाङ्मय */}
        {activeTab === "hindi" && (
          <div className="space-y-6 animate-fade-in">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="खोजें: खंड 1, जाति, बुद्ध, संविधान, 40..."
                  className="w-full pl-9 pr-3 py-1.5 rounded text-xs bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
              <span className="text-xs font-mono text-[var(--muted-foreground)]">
                Showing {filteredHindi.length} of {hindiVolumesCatalog.length} Volumes in <code>data/hindi_doc/</code>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[850px] overflow-y-auto pr-1">
              {filteredHindi.map((vol) => (
                <div
                  key={vol.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm hover:border-[var(--primary)]/60 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/30 uppercase flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        संपूर्ण वाङ्मय — खंड {vol.volumeNumber}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                        {vol.pageCount} पृष्ठ • हिंदी
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {vol.title}
                      </h3>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2 leading-relaxed">
                        {vol.summary}
                      </p>
                    </div>

                    {vol.keyTexts && vol.keyTexts.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {vol.keyTexts.map((txt) => (
                          <span
                            key={txt}
                            className="px-2 py-0.5 rounded text-[10px] bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]"
                          >
                            {txt}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="p-2.5 rounded bg-[var(--muted)]/40 border border-[var(--border)] text-[10px] font-mono text-[var(--muted-foreground)] space-y-0.5">
                      <p><strong>प्रकाशक:</strong> {vol.sourceInstitution}</p>
                      <p><strong>अभिलेख फ़ाइल:</strong> <code>data/hindi_doc/{vol.id}</code></p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
                    <a
                      href={vol.fileUrl}
                      download
                      className="inline-flex items-center gap-1 text-xs font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF डाउनलोड करें</span>
                    </a>

                    <Link
                      to={`/documents/${vol.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
                    >
                      <span>वाचन एवं अवलोकन</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Ground-truth QA component linking data.json */}
            <div className="pt-2">
              <VolumeCitationCard />
            </div>
          </div>
        )}

        {/* TAB 3: VOICE & RADIO BROADCASTS */}
        {activeTab === "audio" && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-md bg-amber-500/5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <Radio className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentic Archival Sound Masters</p>
                <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
                  These restored voice recordings preserve Dr. B. R. Ambedkar's landmark addresses to the BBC World Service, the Constituent Assembly of India, and historic mass congregations. Includes synchronized transcripts and acoustic provenance notes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {historicalAudios.map((audio) => (
                <ArchivalAudioPlayer key={audio.id} audio={audio} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FILM NEWSREELS & MOTION PICTURES */}
        {activeTab === "video" && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <Film className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Preserved 35mm Archival Motion Picture Newsreels</p>
                <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
                  Archival documentary footage restored from the Films Division of India and the British Pathé collection, documenting the drafting and enactment of the Constitution, the London Round Table Conferences, and the 1956 mass conversion.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {historicalVideos.map((video) => (
                <ArchivalVideoPlayer key={video.id} video={video} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PHOTOGRAPHIC ARCHIVE */}
        {activeTab === "photos" && (
          <div className="space-y-6 animate-fade-in">
            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2">
              {(["All", ...imageCategories] as string[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPhotoCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
                    photoCategory === cat
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {(() => {
              const filtered = photoCategory === "All"
                ? historicalPhotoGallery
                : historicalPhotoGallery.filter((p) => (p as any).category === photoCategory);
              return (
                <>
                  <div className="text-xs font-mono text-[var(--muted-foreground)] -mt-2">
                    Showing {filtered.length} of {historicalPhotoGallery.length} archival photographs
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm hover:border-[var(--primary)]/60 cursor-pointer group transition-all flex flex-col justify-between"
                      >
                        <div className="relative aspect-[4/3] bg-[var(--muted)] overflow-hidden">
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23374151' width='400' height='300'/%3E%3Ctext fill='%239CA3AF' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E📷 Archive Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-mono">
                            <Eye className="w-4 h-4" />
                            <span>View Archival Record</span>
                          </div>
                          {(photo as any).category && (
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[9px] font-mono text-white backdrop-blur-sm">
                              {(photo as any).category}
                            </div>
                          )}
                        </div>

                        <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted-foreground)] mb-1">
                              <span>{photo.date || "Historical"}</span>
                              <span className="px-1.5 py-0.2 rounded bg-[var(--muted)] uppercase">
                                {photo.license.includes("Public Domain") ? "Public Domain" : "Verified"}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                              {photo.title}
                            </h4>
                            <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-2 mt-1">
                              {photo.caption}
                            </p>
                          </div>

                          <div className="pt-2 mt-2 border-t border-[var(--border)] text-[10px] font-mono text-[var(--muted-foreground)] truncate">
                            {photo.sourceInstitution}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}


            {/* Lightbox modal for selected photograph */}
            {selectedPhoto && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={() => setSelectedPhoto(null)}
              >
                <div
                  className="relative max-w-3xl w-full bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl space-y-4 p-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative aspect-video max-h-[60vh] bg-black rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedPhoto.url}
                      alt={selectedPhoto.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)]">
                      <div className="flex items-center gap-2">
                        <span>{selectedPhoto.date}</span>
                        {(selectedPhoto as any).category && (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-[10px]">
                            {(selectedPhoto as any).category}
                          </span>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--foreground)]">
                        {selectedPhoto.license}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--foreground)]">
                      {selectedPhoto.title}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {selectedPhoto.caption}
                    </p>
                    <div className="p-3 rounded bg-[var(--muted)]/50 border border-[var(--border)] text-xs font-mono text-[var(--muted-foreground)] space-y-0.5">
                      <p><strong>Institution:</strong> {selectedPhoto.sourceInstitution}</p>
                      <p><strong>Provenance:</strong> {selectedPhoto.provenance}</p>
                      {(selectedPhoto as any).confidence && (
                        <p><strong>Confidence:</strong>{" "}
                          <span className={(selectedPhoto as any).confidence === "verified" ? "text-green-400" : "text-yellow-400"}>
                            {(selectedPhoto as any).confidence}
                          </span>
                        </p>
                      )}
                      {(selectedPhoto as any).relatedVolumes?.length > 0 && (
                        <p><strong>Related Volumes:</strong> {(selectedPhoto as any).relatedVolumes.join(", ")}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex justify-end">
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="px-4 py-2 rounded bg-[var(--muted)] hover:bg-[var(--border)] text-xs font-mono transition-colors"
                    >
                      Close Lightbox
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
