import React, { useState } from "react";
import {
  FileText,
  FileCode,
  Image as ImageIcon,
  Music,
  Video,
  CheckCircle2,
  AlertTriangle,
  Database,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import type { FileType } from "@/types/institution";
import { useInstitution } from "@/context/InstitutionContext";

const FORMAT_ICONS: Record<FileType, React.ReactNode> = {
  PDF: <FileText className="w-4 h-4 text-red-500" />,
  DOCX: <FileCode className="w-4 h-4 text-blue-500" />,
  IMAGE: <ImageIcon className="w-4 h-4 text-emerald-500" />,
  AUDIO: <Music className="w-4 h-4 text-amber-500" />,
  VIDEO: <Video className="w-4 h-4 text-purple-500" />,
};

export default function UploadHistory({ onNavigateToArchive }: { onNavigateToArchive: () => void }) {
  const { files, updateVectorStatus, pendingVectorCount, indexedVectorCount } = useInstitution();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "updated">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.sourceInstitution.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === "pending") return matchesSearch && file.vectorStatus === "not_updated";
    if (filterStatus === "updated") return matchesSearch && file.vectorStatus === "updated";
    return matchesSearch;
  });

  const handleUpdateSingle = async (id: string) => {
    setUpdatingId(id);
    await new Promise((res) => setTimeout(res, 1200));
    updateVectorStatus(id, "updated");
    setUpdatingId(null);
  };

  const handleUpdateAllPending = async () => {
    const pendingIds = files.filter((f) => f.vectorStatus === "not_updated").map((f) => f.id);
    if (pendingIds.length === 0) return;

    setUpdatingId("ALL");
    await new Promise((res) => setTimeout(res, 2000));
    updateVectorStatus(pendingIds, "updated");
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded border border-[var(--border)] bg-[var(--card)] shadow-xs">
          <div className="text-xs font-mono text-[var(--muted-foreground)] uppercase">Total Uploaded Files</div>
          <div className="text-2xl font-display font-bold text-[var(--foreground)] mt-1">{files.length}</div>
        </div>

        <div className="p-4 rounded border border-[var(--border)] bg-[var(--card)] shadow-xs">
          <div className="text-xs font-mono text-[var(--muted-foreground)] uppercase">Processing Status</div>
          <div className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" />
            <span>100% Ready</span>
          </div>
        </div>

        <div className="p-4 rounded border border-[var(--border)] bg-[var(--card)] shadow-xs">
          <div className="text-xs font-mono text-[var(--muted-foreground)] uppercase">Vector DB Indexed</div>
          <div className="text-2xl font-display font-bold text-[var(--primary)] mt-1 flex items-center gap-1.5">
            <Database className="w-5 h-5" />
            <span>{indexedVectorCount} Files</span>
          </div>
        </div>

        <div className="p-4 rounded border border-[var(--border)] bg-[var(--card)] shadow-xs">
          <div className="text-xs font-mono text-[var(--muted-foreground)] uppercase">Vector DB Pending</div>
          <div className="text-2xl font-display font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
            <AlertTriangle className="w-5 h-5" />
            <span>{pendingVectorCount} Files</span>
          </div>
        </div>
      </div>

      {/* Main Upload History Table Container */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-md shadow-xs overflow-hidden">
        {/* Controls Header */}
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-semibold">Upload History & Pipeline Logs</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Review processing results, attribute mapping verification, and vector database synchronization status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pendingVectorCount > 0 && (
              <button
                type="button"
                disabled={updatingId !== null}
                onClick={handleUpdateAllPending}
                className="px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {updatingId === "ALL" ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating Pending ({pendingVectorCount})...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>[ Update All Pending ({pendingVectorCount}) ]</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-[var(--background)]/60 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by filename, category, or source..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <span className="text-[var(--muted-foreground)]">Filter:</span>
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-2 py-1 rounded cursor-pointer ${filterStatus === "all" ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold" : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)]"}`}
            >
              All ({files.length})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-2 py-1 rounded cursor-pointer ${filterStatus === "pending" ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold" : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)]"}`}
            >
              Pending ({pendingVectorCount})
            </button>
            <button
              onClick={() => setFilterStatus("updated")}
              className={`px-2 py-1 rounded cursor-pointer ${filterStatus === "updated" ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold" : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)]"}`}
            >
              Updated ({indexedVectorCount})
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--muted)]/50 border-b border-[var(--border)] text-[var(--muted-foreground)] font-mono uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Source Institution</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4">Processing</th>
                <th className="py-3 px-4">Vector DB</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[var(--muted-foreground)] font-mono">
                    No files found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-[var(--muted)]/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                        {FORMAT_ICONS[file.fileType]}
                        <span className="font-mono text-xs">{file.filename}</span>
                        <span className="text-[10px] font-mono px-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">
                          {file.fileType}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans text-[var(--foreground)]">{file.category}</td>
                    <td className="py-3 px-4 font-sans text-[var(--muted-foreground)]">{file.sourceInstitution}</td>
                    <td className="py-3 px-4 font-mono text-[var(--muted-foreground)]">{file.uploadDate}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {file.vectorStatus === "updated" ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          ✓ Updated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          ⚠ Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {file.vectorStatus === "not_updated" ? (
                        <button
                          type="button"
                          disabled={updatingId !== null}
                          onClick={() => handleUpdateSingle(file.id)}
                          className="px-2.5 py-1 rounded text-[11px] font-mono font-semibold uppercase bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          {updatingId === file.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Indexing...</span>
                            </>
                          ) : (
                            <>
                              <Database className="w-3 h-3" />
                              <span>[ UPDATE ]</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onNavigateToArchive}
                          className="px-2.5 py-1 rounded text-[11px] font-mono text-[var(--primary)] hover:underline cursor-pointer"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
