export type FileType = "PDF" | "DOCX" | "IMAGE" | "AUDIO" | "VIDEO";

export type ProcessingStatus = "idle" | "processing" | "completed" | "error";

export type VectorStatus = "not_updated" | "updating" | "updated";

export interface ExtractedRelationship {
  source: string;
  relation: string;
  target: string;
}

export interface UnifiedAttributes {
  persons: string[];
  documents: string[];
  events: string[];
  places: string[];
  dates: string[];
  topics: string[];
  publications: string[];
}

export interface ExtractedContent {
  title: string;
  text: string;
  translatedText?: string;
  language: string;
  summary: string;
  transcript?: string;
  visualInfo?: string;
  audioInfo?: string;
  pageCount?: number;
  duration?: string;
  resolution?: string;
}

export interface ArchiveFile {
  id: string;
  filename: string;
  fileType: FileType;
  fileSize: string;
  uploadDate: string;
  category: string;
  sourceInstitution: string;
  languages: string[];
  processingStatus: ProcessingStatus;
  vectorStatus: VectorStatus;
  extractedContent: ExtractedContent;
  attributes: UnifiedAttributes;
  relationships: ExtractedRelationship[];
}

export interface PipelineStageProgress {
  stage: "detection" | "extraction" | "attributes" | "ready";
  status: "idle" | "running" | "done" | "error";
  message: string;
}
