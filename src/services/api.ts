import {
  topics,
  timeline,
  people,
  documents,
  events,
  graphData,
  historicalSources,
  historicalLocations,
  completeHistoricalEvents,
} from "@/data/mockData";
import type {
  SearchFilters,
  SearchResults,
  Topic,
  TimelineEntry,
  Person,
  ArchiveItem,
  ArchiveEvent,
  GraphData,
  ChatMessage,
  SortOption,
  Source,
  Location,
} from "@/types/archive";
import { executeGroundedRAG } from "./ragService";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────────────────────────────────────────────────────
// Topics / Timeline
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllTopics(): Promise<Topic[]> {
  await delay(200);
  return topics;
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  await delay(200);
  return timeline;
}

// ─────────────────────────────────────────────────────────────────────────────
// People
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllPeople(): Promise<Person[]> {
  await delay(200);
  return people;
}

export async function getPerson(id: string): Promise<Person | undefined> {
  await delay(200);
  return people.find((p) => p.id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Documents
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllDocuments(): Promise<ArchiveItem[]> {
  await delay(200);
  return documents;
}

export async function getFeaturedDocuments(): Promise<ArchiveItem[]> {
  await delay(200);
  return documents.slice(0, 6);
}

export async function getDocument(id: string): Promise<ArchiveItem | undefined> {
  await delay(200);
  return documents.find((d) => d.id === id);
}

export async function getItemById(id: string): Promise<ArchiveItem | undefined> {
  await delay(150);
  return documents.find((d) => d.id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────────────────────────────────────

export async function getFeaturedEvents(): Promise<ArchiveEvent[]> {
  await delay(200);
  // Return unique events (excluding duplicate legacy aliases for the list)
  return events.filter((e) => !["E1", "E2", "E3", "E4"].includes(e.id));
}

export async function getEvent(id: string): Promise<ArchiveEvent | undefined> {
  await delay(200);
  return events.find((e) => e.id === id || e.event_id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sources & Locations
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllSources(): Promise<Source[]> {
  await delay(200);
  return historicalSources;
}

export async function getSource(id: string): Promise<Source | undefined> {
  await delay(150);
  return historicalSources.find((s) => s.id === id);
}

export async function getAllLocations(): Promise<Location[]> {
  await delay(200);
  return historicalLocations;
}

export async function getLocation(id: string): Promise<Location | undefined> {
  await delay(150);
  return historicalLocations.find((l) => l.id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Knowledge Graph
// ─────────────────────────────────────────────────────────────────────────────

export async function getGraph(): Promise<GraphData> {
  await delay(300);
  return graphData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Search  –  Multimodal Historical Archive Search
// ─────────────────────────────────────────────────────────────────────────────

export async function searchArchive(
  filters: SearchFilters,
  sort: SortOption = "relevance"
): Promise<SearchResults> {
  await delay(300);

  const q = (filters.query ?? filters.keywords ?? "").toLowerCase().trim();
  const today = new Date();
  const todayMD = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  // 1. Filter Documents
  let filteredDocs = documents.filter((doc) => {
    if (q) {
      const haystack = [
        doc.title,
        doc.author,
        doc.summary,
        doc.transcript ?? "",
        ...(doc.topics ?? []),
        ...(doc.people ?? []),
        ...(doc.places ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters.contentType && doc.contentType !== filters.contentType) return false;
    if (filters.language && doc.language !== filters.language) return false;
    if (filters.topicId && !doc.topicIds.includes(filters.topicId)) return false;
    if (filters.personId && !doc.personIds.includes(filters.personId)) return false;
    if (filters.eventId && !doc.eventIds.includes(filters.eventId)) return false;
    if (filters.yearFrom && doc.year < filters.yearFrom) return false;
    if (filters.yearTo && doc.year > filters.yearTo) return false;
    if (filters.dateFrom && doc.date < filters.dateFrom) return false;
    if (filters.dateTo && doc.date > filters.dateTo) return false;

    if (filters.decade) {
      const d = Number(filters.decade);
      if (!isNaN(d) && doc.decade !== d) return false;
    }

    if (filters.country && doc.country?.toLowerCase() !== filters.country.toLowerCase()) return false;
    if (filters.state && doc.state?.toLowerCase() !== filters.state.toLowerCase()) return false;
    if (filters.city && doc.city?.toLowerCase() !== filters.city.toLowerCase()) return false;

    if (filters.mediaType && doc.mediaType !== filters.mediaType) return false;
    if (filters.hasAudioDescription && !doc.hasAudioDescription) return false;
    if (filters.hasCaptions && !doc.hasCaptions) return false;

    if (filters.todayInHistory) {
      const docMD = doc.date.slice(5);
      if (docMD !== todayMD) return false;
    }

    return true;
  });

  // Sort Documents
  switch (sort) {
    case "date-asc":
      filteredDocs = [...filteredDocs].sort((a, b) => a.year - b.year);
      break;
    case "date-desc":
      filteredDocs = [...filteredDocs].sort((a, b) => b.year - a.year);
      break;
    case "title-asc":
      filteredDocs = [...filteredDocs].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "relevance":
    default:
      break;
  }

  // 2. Filter People
  const filteredPeople = q
    ? people.filter((p) =>
        [p.name, p.nativeName ?? "", p.description, ...(p.roles ?? []), ...(p.associations ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
    : people;

  // 3. Filter Events (searching complete historical record, avoiding legacy duplicates)
  const uniqueEvents = events.filter((e) => !["E1", "E2", "E3", "E4"].includes(e.id));
  let filteredEvents = uniqueEvents.filter((e) => {
    if (q) {
      const haystack = [
        e.title,
        e.description,
        e.significance,
        ...(e.themes ?? []),
        ...(e.topics ?? []),
        ...(e.places ?? []),
        ...(e.people ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters.personId && !e.people.includes(filters.personId)) return false;
    if (filters.yearFrom && e.year < filters.yearFrom) return false;
    if (filters.yearTo && e.year > filters.yearTo) return false;
    if (filters.confidence && e.confidence !== filters.confidence) return false;
    if (filters.trajectory && e.trajectory !== filters.trajectory) return false;
    if (filters.theme && !e.themes.some((t) => t.toLowerCase().includes(filters.theme!.toLowerCase()))) return false;
    if (filters.location && !e.places.some((p) => p.toLowerCase().includes(filters.location!.toLowerCase()))) return false;

    if (filters.decade) {
      const d = Number(filters.decade);
      if (!isNaN(d) && Math.floor(e.year / 10) * 10 !== d) return false;
    }

    if (filters.todayInHistory && e.startDate) {
      const eMD = e.startDate.slice(5);
      if (eMD !== todayMD) return false;
    }

    return true;
  });

  // Sort Events
  if (sort === "date-asc") {
    filteredEvents = [...filteredEvents].sort((a, b) => a.year - b.year);
  } else if (sort === "date-desc") {
    filteredEvents = [...filteredEvents].sort((a, b) => b.year - a.year);
  } else if (sort === "title-asc") {
    filteredEvents = [...filteredEvents].sort((a, b) => a.title.localeCompare(b.title));
  }

  // 4. Filter Topics
  const filteredTopics = q
    ? topics.filter((t) => [t.label, t.description].join(" ").toLowerCase().includes(q))
    : topics;

  // 5. Filter Sources
  const filteredSources = q
    ? historicalSources.filter((s) =>
        [s.title, s.institution, s.provenance, s.volume ?? ""].join(" ").toLowerCase().includes(q)
      )
    : historicalSources;

  return {
    documents: filteredDocs,
    people: filteredPeople,
    events: filteredEvents,
    topics: filteredTopics,
    sources: filteredSources,
    total: filteredDocs.length + filteredPeople.length + filteredEvents.length + filteredSources.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Ask / Chat  –  Grounded RAG Pipeline
// ─────────────────────────────────────────────────────────────────────────────

export async function askArchive(query: string): Promise<ChatMessage> {
  await delay(600);
  return executeGroundedRAG(query);
}
