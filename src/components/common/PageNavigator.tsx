import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PageNavigatorProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  compact?: boolean;
}

export default function PageNavigator({
  page,
  totalPages,
  onPageChange,
  compact = false,
}: PageNavigatorProps) {
  const [inputVal, setInputVal] = useState<string>(page.toString());

  useEffect(() => {
    setInputVal(page.toString());
  }, [page]);

  const commitPage = () => {
    const val = parseInt(inputVal, 10);
    if (isNaN(val)) {
      setInputVal(page.toString());
      return;
    }
    const clamped = Math.max(1, Math.min(totalPages, val));
    setInputVal(clamped.toString());
    if (clamped !== page) {
      onPageChange(clamped);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitPage();
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 select-none">
      {/* First Page */}
      {!compact && (
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="p-1.5 rounded border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          title="Jump to First Page (Page 1)"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Prev Page */}
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-1.5 rounded border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 text-xs font-medium"
        title="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
        {!compact && <span className="hidden sm:inline">Prev</span>}
      </button>

      {/* Page Number Field */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--muted)] border border-[var(--border)] text-xs font-mono">
        <span className="text-[var(--muted-foreground)]">Page</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitPage}
          className="w-12 sm:w-16 px-1.5 py-0.5 text-center font-bold font-mono bg-[var(--card)] border border-[var(--border)] rounded text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-xs"
          aria-label="Enter Page Number"
        />
        <span className="text-[var(--muted-foreground)]">of {totalPages}</span>
      </div>

      {/* Next Page */}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-1.5 rounded border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 text-xs font-medium"
        title="Next Page"
      >
        {!compact && <span className="hidden sm:inline">Next</span>}
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Last Page */}
      {!compact && (
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="p-1.5 rounded border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          title={`Jump to Last Page (Page ${totalPages})`}
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
