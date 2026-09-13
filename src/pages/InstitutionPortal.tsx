import React, { useState } from "react";
import {
  Building2,
  Upload,
  History,
  Archive,
  Sparkles,
  ShieldCheck,
  Database,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useInstitution } from "@/context/InstitutionContext";
import NewContentIngestion from "@/components/institution/NewContentIngestion";
import UploadHistory from "@/components/institution/UploadHistory";
import InstitutionArchive from "@/components/institution/InstitutionArchive";

export type InstitutionTab = "new-content" | "history" | "archive";

export default function InstitutionPortal() {
  const { user, isAuthenticated } = useAuth();
  const { pendingVectorCount, indexedVectorCount, files } = useInstitution();
  const [activeTab, setActiveTab] = useState<InstitutionTab>("new-content");

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 archival-texture">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Institution Portal Hero Banner */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-md p-6 shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center flex-shrink-0 shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-display font-bold tracking-tight text-[var(--foreground)]">
                    Institution Portal
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--primary)] text-[var(--primary-foreground)] uppercase">
                    PROTOTYPE
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Multi-Format Content Upload • Unified Attribute Extraction • Vector Database Indexing
                </p>
              </div>
            </div>

            {/* Logged in Institution Badge or Access Indicator */}
            <div className="flex items-center gap-3">
              <div className="bg-[var(--background)] border border-[var(--border)] px-3 py-2 rounded text-xs space-y-0.5">
                <div className="font-mono text-[10px] text-[var(--muted-foreground)] uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[var(--primary)]" />
                  <span>Logged In Institution</span>
                </div>
                <div className="font-semibold text-[var(--foreground)]">
                  {isAuthenticated && user ? user.name : "Dr. Ambedkar Institute of Technology (DAIT)"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Main Portal Section Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[var(--card)] p-1.5 rounded-md border border-[var(--border)] shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("new-content")}
            className={`py-3 px-4 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "new-content"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>1. NEW CONTENT</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`py-3 px-4 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
              activeTab === "history"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
            }`}
          >
            <History className="w-4 h-4" />
            <span>2. UPLOAD HISTORY</span>
            {pendingVectorCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500 text-black font-extrabold">
                {pendingVectorCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("archive")}
            className={`py-3 px-4 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "archive"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>3. ARCHIVE ({files.length})</span>
          </button>
        </div>

        {/* Tab Views */}
        <div>
          {activeTab === "new-content" && (
            <NewContentIngestion
              onNavigateToHistory={() => setActiveTab("history")}
              onNavigateToArchive={() => setActiveTab("archive")}
            />
          )}

          {activeTab === "history" && (
            <UploadHistory onNavigateToArchive={() => setActiveTab("archive")} />
          )}

          {activeTab === "archive" && <InstitutionArchive />}
        </div>
      </div>
    </div>
  );
}
