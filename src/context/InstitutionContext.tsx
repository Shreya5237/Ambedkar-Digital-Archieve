import React, { createContext, useContext, useState, useEffect } from "react";
import type { ArchiveFile, VectorStatus } from "@/types/institution";
import { INITIAL_INSTITUTION_FILES } from "@/data/institutionMockData";

interface InstitutionContextType {
  files: ArchiveFile[];
  addBatchFiles: (newFiles: ArchiveFile[]) => void;
  updateVectorStatus: (fileIds: string | string[], status: VectorStatus) => void;
  getFileById: (id: string) => ArchiveFile | undefined;
  pendingVectorCount: number;
  indexedVectorCount: number;
  resetToInitial: () => void;
}

const STORAGE_KEY = "ambedkar_archive_institution_files_v1";

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<ArchiveFile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as ArchiveFile[];
      }
    } catch (e) {
      console.error("Failed to parse institution files state", e);
    }
    return INITIAL_INSTITUTION_FILES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch (e) {
      console.error("Failed to save institution files state", e);
    }
  }, [files]);

  const addBatchFiles = (newFiles: ArchiveFile[]) => {
    setFiles((prev) => [...newFiles, ...prev]);
  };

  const updateVectorStatus = (fileIds: string | string[], status: VectorStatus) => {
    const ids = Array.isArray(fileIds) ? fileIds : [fileIds];
    setFiles((prev) =>
      prev.map((f) => (ids.includes(f.id) ? { ...f, vectorStatus: status } : f))
    );
  };

  const getFileById = (id: string) => {
    return files.find((f) => f.id === id);
  };

  const resetToInitial = () => {
    setFiles(INITIAL_INSTITUTION_FILES);
    localStorage.removeItem(STORAGE_KEY);
  };

  const pendingVectorCount = files.filter((f) => f.vectorStatus === "not_updated").length;
  const indexedVectorCount = files.filter((f) => f.vectorStatus === "updated").length;

  return (
    <InstitutionContext.Provider
      value={{
        files,
        addBatchFiles,
        updateVectorStatus,
        getFileById,
        pendingVectorCount,
        indexedVectorCount,
        resetToInitial,
      }}
    >
      {children}
    </InstitutionContext.Provider>
  );
};

export const useInstitution = (): InstitutionContextType => {
  const context = useContext(InstitutionContext);
  if (!context) {
    throw new Error("useInstitution must be used within an InstitutionProvider");
  }
  return context;
};
