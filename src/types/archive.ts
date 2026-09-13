export type ContentType =
  | "speech"
  | "essay"
  | "letter"
  | "book"
  | "article"
  | "legal_document"
  | "photograph"
  | "manuscript"
  | "interview"
  | "telegram";

export type Language = "en" | "hi" | "mr" | "ta";

export type EntityType = "PERSON" | "DOCUMENT" | "EVENT" | "TOPIC" | "PLACE" | "PUBLICATION";

export interface Person {
  id: string;
  name: string;
  born?: string;
  died?: string;
  description: string;
  roles: string[];
  image?: string;
  documentCount: number;
  relatedPeople?: string[];
}

export interface Place {
  id: string;
  name: string;
  region: string;
  country: string;
  description: string;
  coordinates?: { lat: number; lng: number };
}

export interface Publication {
  id: string;
  name: string;
  type: "journal" | "newspaper" | "book_series" | "government";
  years?: string;
  description: string;
}

export interface Topic {
  id: string;
  label: string;
  description: string;
  documentCount: number;
  color: string;
}

export interface ArchiveEvent {
  id: string;
  title: string;
  date: string;
  year: number;
  description: string;
  significance: string;
  people: string[];
  places: string[];
  documents: string[];
  topics: string[];
  image?: string;
}

export interface ArchiveItem {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  date: string;
  year: number;
  language: Language;
  contentType: ContentType;
  sourceInstitution: string;
  sourceReference: string;
  publication?: string;
  publicationId?: string;
  volume?: string;
  pages?: string;
  topics: string[];
  topicIds: string[];
  people: string[];
  personIds: string[];
  places: string[];
  placeIds: string[];
  events: string[];
  eventIds: string[];
  summary: string;
  transcript?: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  rights: string;
  provenance: string;
  pageCount?: number;
  /** Primary media type for multimodal evidence rendering */
  mediaType?: "image" | "audio" | "video";
  caption?: string;
  country?: string;
  state?: string;
  city?: string;
  decade?: number;
  hasAudioDescription?: boolean;
  hasCaptions?: boolean;
}

export interface GraphNode {
  id: string;
  type: EntityType;
  label: string;
  description?: string;
  year?: number;
  metadata?: Record<string, string>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SearchFilters {
  query?: string;
  dateFrom?: string;
  dateTo?: string;
  language?: Language;
  contentType?: ContentType;
  personId?: string;
  eventId?: string;
  topicId?: string;
  placeId?: string;
  // Extended Knowledge Garden filters
  yearFrom?: number;
  yearTo?: number;
  country?: string;
  state?: string;
  city?: string;
  decade?: string;
  todayInHistory?: boolean;
  historicalPeriod?: string;
  mediaType?: "image" | "audio" | "video";
  hasAudioDescription?: boolean;
  hasCaptions?: boolean;
  keywords?: string;
  theme?: string;
}

export interface FilterObject {
  contentTypes: string[];
  languages: string[];
  yearFrom: string;
  yearTo: string;
  decade: string;
  historicalPeriod: string;
  todayInHistory: boolean;
  country: string;
  state: string;
  city: string;
  topicIds: string[];
  personIds: string[];
  keywords: string;
  theme: string;
  hasAudioDescription: boolean;
  hasCaptions: boolean;
  highContrast: boolean;
}

export type SortOption = "relevance" | "date-asc" | "date-desc" | "title-asc";

export interface SearchResults {
  documents: ArchiveItem[];
  people: Person[];
  events: ArchiveEvent[];
  topics: Topic[];
  total: number;
}

export interface TimelineEntry {
  id: string;
  year: number;
  date: string;
  title: string;
  description: string;
  eventType: "life" | "political" | "legal" | "publication" | "constitutional";
  documentIds: string[];
  image?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: SourceCitation[];
  confidence?: "high" | "medium" | "low" | "insufficient";
}

export interface SourceCitation {
  documentId: string;
  title: string;
  page?: string;
  excerpt: string;
  url?: string;
}
