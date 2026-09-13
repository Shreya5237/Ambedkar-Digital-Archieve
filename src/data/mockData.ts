import type { Topic, TimelineEntry, Person, ArchiveItem, ArchiveEvent, GraphData } from "@/types/archive";

export const topics: Topic[] = [
  { id: "1", label: "Constitution", description: "Drafting of the Indian Constitution", documentCount: 42, color: "#4F46E5" },
  { id: "2", label: "Social Justice", description: "Movements for equality and civil rights", documentCount: 56, color: "#E11D48" },
  { id: "3", label: "Economics", description: "Economic thought and policy", documentCount: 24, color: "#16A34A" },
];

export const timeline: TimelineEntry[] = [
  { id: "1", year: 1891, date: "April 14", title: "Birth", description: "Born in Mhow", eventType: "life", documentIds: [] },
  { id: "2", year: 1956, date: "December 6", title: "Mahaparinirvan", description: "Passed away in Delhi", eventType: "life", documentIds: [] }
];

export const people: Person[] = [
  { id: "1", name: "B.R. Ambedkar", description: "Architect of the Indian Constitution", roles: ["Leader", "Scholar"], documentCount: 100 }
];

export const documents: ArchiveItem[] = [
  {
    id: "1", title: "Annihilation of Caste", author: "B.R. Ambedkar", date: "1936-05-15", year: 1936,
    language: "en", contentType: "book", sourceInstitution: "Self-Published", sourceReference: "AOC-1",
    topics: ["Social Justice"], topicIds: ["2"], people: ["B.R. Ambedkar"], personIds: ["1"],
    places: [], placeIds: [], events: [], eventIds: [], summary: "A critique of the caste system.",
    rights: "Public Domain", provenance: "Archive"
  }
];

export const events: ArchiveEvent[] = [
  { id: "1", title: "Mahad Satyagraha", date: "1927-03-20", year: 1927, description: "Led by Dr. Ambedkar to allow untouchables to use water in a public tank.", significance: "Major movement for Dalit rights.", people: ["1"], places: [], documents: [], topics: ["2"] }
];

export const graphData: GraphData = {
  nodes: [
    { id: "1", type: "PERSON", label: "B.R. Ambedkar" }
  ],
  edges: []
};
