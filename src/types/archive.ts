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

export type EntityType = "PERSON" | "DOCUMENT" | "EVENT" | "TOPIC" | "PLACE" | "PUBLICATION" | "SOURCE";

export type ConfidenceLevel = "verified" | "high" | "medium" | "low" | "insufficient" | "probable";

export type DatePrecision = "day" | "month" | "year" | "approximate";

export type TimePrecision = "exact" | "approximate" | "unknown";

export interface HistoricalTime {
  value: string | null;
  precision: TimePrecision;
  note?: string;
}

export type SourceType =
  | "official_archive"
  | "constitutional_record"
  | "institutional_archive"
  | "university_archive"
  | "academic_edition"
  | "wikimedia_commons"
  | "secondary";

export type SourcePriority = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Source {
  id: string;
  title: string;
  url?: string;
  sourceType: SourceType;
  institution: string;
  publicationDate?: string;
  volume?: string;
  pages?: string;
  confidence: ConfidenceLevel;
  provenance: string;
  priority: SourcePriority;
}

export interface Evidence {
  id: string;
  claimStatement: string;
  sourceId: string;
  sourceTitle: string;
  pageOrRef?: string;
  quote?: string;
  confidence: ConfidenceLevel;
}

export interface HistoricalImage {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  caption: string;
  date?: string;
  eventId?: string;
  personIds?: string[];
  locationId?: string;
  sourceInstitution: string;
  sourceUrl?: string;
  provenance: string;
  license: string;
  confidence: ConfidenceLevel;
}

export interface HistoricalAudio {
  id: string;
  title: string;
  audioUrl: string;
  duration?: string;
  speaker?: string;
  date?: string;
  eventId?: string;
  language?: string;
  sourceInstitution: string;
  sourceUrl?: string;
  provenance: string;
  transcript: string;
  audioAcousticInfo?: string;
  license: string;
  confidence: ConfidenceLevel;
}

export interface HistoricalVideo {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl?: string;
  duration?: string;
  date?: string;
  eventId?: string;
  sourceInstitution: string;
  sourceUrl?: string;
  provenance: string;
  description: string;
  transcript?: string;
  license: string;
  confidence: ConfidenceLevel;
}

export interface Location {
  id: string;
  name: string;
  siteName?: string;
  region?: string;
  state?: string;
  country: string;
  coordinates?: { lat: number; lng: number };
  description?: string;
  historicalNote?: string;
}

export type Place = Location;

export interface Person {
  id: string;
  name: string;
  nativeName?: string;
  born?: string;
  died?: string;
  description: string;
  roles: string[];
  image?: string;
  documentCount: number;
  relatedPeople?: string[];
  associations?: string[];
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
  eventCount?: number;
}

export type EventCategory =
  | "life"
  | "education"
  | "political"
  | "legal"
  | "publication"
  | "constitutional"
  | "religious"
  | "labour";

export type HistoricalTrajectory =
  | "mahad_movement"
  | "constitutional_journey"
  | "religious_liberation"
  | "gender_equality"
  | "education_early_life"
  | "labour_reforms"
  | "general";

export interface RelatedEventLink {
  eventId: string;
  title: string;
  year?: number;
  relationType:
    | "precursor_to"
    | "led_to"
    | "part_of_movement"
    | "culmination_of"
    | "parallel_to"
    | "legal_outcome_of"
    | "response_to"
    | "related_to";
  description?: string;
}

export interface HistoricalEvent {
  id: string;
  event_id?: string;
  title: string;
  startDate: string;
  endDate?: string;
  date: string; // Formatted date e.g. "20 Mar 1927"
  year: number;
  datePrecision: DatePrecision;
  time: HistoricalTime;
  description: string;
  significance: string;
  locationDetails?: Location;
  places: string[];
  people: string[];
  personDetails?: Person[];
  themes: string[];
  topics: string[];
  relatedDocuments: string[];
  documents: string[]; // backward compatibility
  relatedImages: HistoricalImage[];
  relatedAudios?: HistoricalAudio[];
  relatedVideos?: HistoricalVideo[];
  image?: string;
  relatedEvents: RelatedEventLink[];
  evidence: Evidence[];
  sources: Source[];
  confidence: ConfidenceLevel;
  eventType: EventCategory;
  trajectory?: HistoricalTrajectory;
}

export type ArchiveEvent = HistoricalEvent;

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
  mediaType?: "image" | "audio" | "video";
  caption?: string;
  country?: string;
  state?: string;
  city?: string;
  decade?: number;
  hasAudioDescription?: boolean;
  hasCaptions?: boolean;
  pagesList?: { pageNumber: number; content: string }[];
  translatedTranscripts?: Record<string, string>;
  sources?: Source[];
  evidence?: Evidence[];
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
  type?: string;
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
  location?: string;
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
  confidence?: ConfidenceLevel;
  sourceType?: SourceType;
  trajectory?: HistoricalTrajectory;
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
  confidence?: string;
  sourceType?: string;
  trajectory?: string;
}

export type SortOption = "relevance" | "date-asc" | "date-desc" | "title-asc";

export interface SearchResults {
  documents: ArchiveItem[];
  people: Person[];
  events: HistoricalEvent[];
  topics: Topic[];
  sources?: Source[];
  total: number;
}

export interface TimelineEntry {
  id: string;
  event_id?: string;
  year: number;
  date: string;
  startDate?: string;
  datePrecision?: DatePrecision;
  time?: HistoricalTime;
  title: string;
  description: string;
  significance?: string;
  eventType: EventCategory;
  documentIds: string[];
  relatedDocuments?: string[];
  image?: string;
  relatedImages?: HistoricalImage[];
  places?: string[];
  locationDetails?: Location;
  people?: string[];
  themes?: string[];
  relatedEvents?: RelatedEventLink[];
  evidence?: Evidence[];
  sources?: Source[];
  confidence?: ConfidenceLevel;
  trajectory?: HistoricalTrajectory;
}

export type AskMode = "standard" | "research";

export interface AcademicCitationSet {
  apa: string;
  chicago: string;
  mla: string;
  bibtex: string;
}

export interface VerbatimQuote {
  quote: string;
  speaker: string;
  source: string;
  folioOrPage?: string;
  year?: string;
  institutionalPriority?: number;
}

export interface CorroborationMatrixItem {
  sourceTitle: string;
  repository: string;
  tier: string;
  priority: number;
  consensusStatus:
    | "Independently Corroborated"
    | "Primary Official Record"
    | "Corroborated by Legislative Record"
    | "Secondary Historical Support";
}

export interface ResearchSynthesisData {
  executiveAbstract: string;
  historiographicalContext: string;
  verbatimQuotes: VerbatimQuote[];
  corroborationMatrix: CorroborationMatrixItem[];
  archivalLimitations: string;
  recommendedPrimaryReadings: Array<{
    title: string;
    documentId?: string;
    volume?: string;
    relevance: string;
  }>;
  academicCitations: AcademicCitationSet;
  appliedParameters?: ResearchParameters;
}

export interface ResearchParameters {
  era?: string;
  strictPrimaryOnly?: boolean;
  synthesisFormat?: "synthesis" | "matrix" | "bibliography";
  bawsVolumeFilter?: string;
}

export interface ResearchDossierItem {
  id: string;
  sessionId: string;
  type: "quote" | "citation" | "note" | "claim";
  title: string;
  content: string;
  sourceTitle?: string;
  authorOrSpeaker?: string;
  reference?: string;
  addedAt: string;
  tags?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  mode: AskMode;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  tags?: string[];
  researchNotes?: ResearchDossierItem[];
  researchParameters?: ResearchParameters;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: SourceCitation[];
  confidence?: ConfidenceLevel;
  extractedEntities?: {
    people?: string[];
    events?: string[];
    topics?: string[];
    dates?: string[];
    locations?: string[];
  };
  timeWarning?: string;
  mode?: AskMode;
  researchData?: ResearchSynthesisData;
}

export interface SourceCitation {
  documentId?: string;
  sourceId?: string;
  title: string;
  page?: string;
  excerpt: string;
  url?: string;
  institution?: string;
  priority?: SourcePriority;
  confidence?: ConfidenceLevel;
}

