import { useState } from "react";
import { SlidersHorizontal, ShieldCheck, BookOpen, Clock, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import type { ResearchParameters } from "@/types/archive";

interface ResearchParametersBarProps {
  parameters: ResearchParameters;
  onChange: (params: ResearchParameters) => void;
}

const HISTORICAL_ERAS = [
  { value: "all", label: "All Eras (1891–1956)" },
  { value: "1913-1923", label: "1913–1923: Columbia & LSE Scholarship" },
  { value: "1924-1935", label: "1924–1935: Mahad Satyagraha & Civil Rights" },
  { value: "1930-1932", label: "1930–1932: Round Table Conferences & Poona Pact" },
  { value: "1942-1946", label: "1942–1946: Labour Ministry & Reconstruction" },
  { value: "1946-1950", label: "1946–1950: Constituent Assembly & Law Ministry" },
  { value: "1950-1951", label: "1950–1951: Hindu Code Bill & Resignation" },
  { value: "1951-1956", label: "1951–1956: Buddhist Emancipation & Deekshabhoomi" },
];

const BAWS_VOLUMES = [
  { value: "all", label: "All BAWS Volumes (Vols 1–22)" },
  { value: "Vol 1", label: "Vol 1: Annihilation of Caste, Castes in India" },
  { value: "Vol 6", label: "Vol 6: The Problem of the Rupee, Finance" },
  { value: "Vol 7", label: "Vol 7: Who Were the Shudras?, Untouchables" },
  { value: "Vol 11", label: "Vol 11: The Buddha and His Dhamma" },
  { value: "Vol 13", label: "Vol 13: Constitution of India & Drafting Minutes" },
  { value: "Vol 14", label: "Vol 14: Hindu Code Bill & Resignation" },
  { value: "Vol 17", label: "Vol 17: Speeches, Letters & Mahad Proceedings" },
];

export default function ResearchParametersBar({
  parameters,
  onChange,
}: ResearchParametersBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = (partial: Partial<ResearchParameters>) => {
    onChange({
      ...parameters,
      ...partial,
    });
  };

  const handleReset = () => {
    onChange({
      era: "all",
      strictPrimaryOnly: true,
      synthesisFormat: "synthesis",
      bawsVolumeFilter: "all",
    });
  };

  const hasNonDefault =
    parameters.era !== "all" ||
    parameters.strictPrimaryOnly !== true ||
    parameters.synthesisFormat !== "synthesis" ||
    parameters.bawsVolumeFilter !== "all";

  return (
    <div className="mb-4 border border-amber-500/30 rounded-sm bg-amber-500/5 transition-all">
      {/* Bar Header */}
      <div className="px-3.5 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-mono font-semibold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[11px]">Research Scope:</span>
          </div>

          {/* Quick Active Indicators */}
          <span className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] text-[11px] font-mono text-[var(--foreground)]">
            Era: {HISTORICAL_ERAS.find((e) => e.value === (parameters.era || "all"))?.label.split(":")[0]}
          </span>

          <span
            className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
              parameters.strictPrimaryOnly
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                : "bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)]"
            }`}
          >
            {parameters.strictPrimaryOnly ? "Strict Primary (Rank 1-2)" : "Comprehensive Records"}
          </span>

          {parameters.bawsVolumeFilter && parameters.bawsVolumeFilter !== "all" && (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-800 dark:text-amber-300">
              {parameters.bawsVolumeFilter}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {hasNonDefault && (
            <button
              onClick={handleReset}
              className="text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors"
              title="Reset parameters to standard defaults"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 hover:underline px-1.5 py-0.5 rounded"
          >
            <span>{isExpanded ? "Collapse" : "Adjust Parameters"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Controls Drawer */}
      {isExpanded && (
        <div className="px-4 py-3 border-t border-amber-500/20 bg-[var(--card)]/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Era Filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
              Historical Era
            </label>
            <select
              value={parameters.era || "all"}
              onChange={(e) => handleUpdate({ era: e.target.value })}
              className="w-full px-2 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded text-xs focus:ring-1 focus:ring-[var(--ring)] focus:outline-none"
            >
              {HISTORICAL_ERAS.map((era) => (
                <option key={era.value} value={era.value}>
                  {era.label}
                </option>
              ))}
            </select>
          </div>

          {/* BAWS Volume Filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
              Primary Corpus Edition
            </label>
            <select
              value={parameters.bawsVolumeFilter || "all"}
              onChange={(e) => handleUpdate({ bawsVolumeFilter: e.target.value })}
              className="w-full px-2 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded text-xs focus:ring-1 focus:ring-[var(--ring)] focus:outline-none"
            >
              {BAWS_VOLUMES.map((vol) => (
                <option key={vol.value} value={vol.value}>
                  {vol.label}
                </option>
              ))}
            </select>
          </div>

          {/* Output Format */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
              Scholarly Synthesis Style
            </label>
            <select
              value={parameters.synthesisFormat || "synthesis"}
              onChange={(e) =>
                handleUpdate({
                  synthesisFormat: e.target.value as "synthesis" | "matrix" | "bibliography",
                })
              }
              className="w-full px-2 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded text-xs focus:ring-1 focus:ring-[var(--ring)] focus:outline-none"
            >
              <option value="synthesis">Historiographical Synthesis</option>
              <option value="matrix">Claim-Corroboration Matrix</option>
              <option value="bibliography">Annotated Archival Bibliography</option>
            </select>
          </div>

          {/* Strict Primary Filter */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer py-1.5 px-2 bg-[var(--background)] border border-[var(--border)] rounded">
              <input
                type="checkbox"
                checked={parameters.strictPrimaryOnly !== false}
                onChange={(e) => handleUpdate({ strictPrimaryOnly: e.target.checked })}
                className="w-3.5 h-3.5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
              />
              <span className="text-[11px] font-mono text-[var(--foreground)]">
                Strict Tier 1–2 Archives Only
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
