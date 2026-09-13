import { topics, timeline, people, documents, events, graphData } from "@/data/mockData";
import type { SearchFilters, SearchResults, Topic, TimelineEntry, Person, ArchiveItem, ArchiveEvent, GraphData, ChatMessage } from "@/types/archive";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllTopics(): Promise<Topic[]> {
  await delay(500);
  return topics;
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  await delay(500);
  return timeline;
}

export async function searchArchive(filters: SearchFilters): Promise<SearchResults> {
  await delay(500);
  return {
    documents,
    people,
    events,
    topics,
    total: documents.length + people.length + events.length
  };
}

export async function getAllPeople(): Promise<Person[]> {
  await delay(500);
  return people;
}

export async function getPerson(id: string): Promise<Person | undefined> {
  await delay(500);
  return people.find(p => p.id === id);
}

export async function getFeaturedDocuments(): Promise<ArchiveItem[]> {
  await delay(500);
  return documents;
}

export async function getGraph(): Promise<GraphData> {
  await delay(500);
  return graphData;
}

export async function getFeaturedEvents(): Promise<ArchiveEvent[]> {
  await delay(500);
  return events;
}

export async function getEvent(id: string): Promise<ArchiveEvent | undefined> {
  await delay(500);
  return events.find(e => e.id === id);
}

export async function getDocument(id: string): Promise<ArchiveItem | undefined> {
  await delay(500);
  return documents.find(d => d.id === id);
}

export async function askArchive(query: string): Promise<ChatMessage> {
  await delay(1000);
  return {
    id: Date.now().toString(),
    role: "assistant",
    content: `This is a mock response to your query: "${query}"`,
    timestamp: new Date().toISOString()
  };
}
