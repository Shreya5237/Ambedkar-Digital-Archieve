import { topics, timeline, people, documents, events, graphData } from "@/data/mockData";
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
} from "@/types/archive";
import extractedData from "../../data/data.json";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────────────────────────────────────────────────────
// Topics / Timeline
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllTopics(): Promise<Topic[]> {
  await delay(300);
  return topics;
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  await delay(300);
  return timeline;
}

// ─────────────────────────────────────────────────────────────────────────────
// People
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllPeople(): Promise<Person[]> {
  await delay(300);
  return people;
}

export async function getPerson(id: string): Promise<Person | undefined> {
  await delay(300);
  return people.find((p) => p.id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Documents
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllDocuments(): Promise<ArchiveItem[]> {
  await delay(300);
  return documents;
}

export async function getFeaturedDocuments(): Promise<ArchiveItem[]> {
  await delay(300);
  return documents.slice(0, 6);
}

export async function getDocument(id: string): Promise<ArchiveItem | undefined> {
  await delay(300);
  return documents.find((d) => d.id === id);
}

export async function getItemById(id: string): Promise<ArchiveItem | undefined> {
  await delay(200);
  return documents.find((d) => d.id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────────────────────────────────────

export async function getFeaturedEvents(): Promise<ArchiveEvent[]> {
  await delay(300);
  return events;
}

export async function getEvent(id: string): Promise<ArchiveEvent | undefined> {
  await delay(300);
  return events.find((e) => e.id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Knowledge Graph
// ─────────────────────────────────────────────────────────────────────────────

export async function getGraph(): Promise<GraphData> {
  await delay(400);
  return graphData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Search  –  real client-side filtering
// ─────────────────────────────────────────────────────────────────────────────

export async function searchArchive(
  filters: SearchFilters,
  sort: SortOption = "relevance"
): Promise<SearchResults> {
  await delay(400);

  const q = (filters.query ?? filters.keywords ?? "").toLowerCase().trim();
  const today = new Date();
  const todayMD = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  let filteredDocs = documents.filter((doc) => {
    // Full-text / keyword
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

    // Content type
    if (filters.contentType && doc.contentType !== filters.contentType) return false;

    // Language
    if (filters.language && doc.language !== filters.language) return false;

    // Topic
    if (filters.topicId && !doc.topicIds.includes(filters.topicId)) return false;

    // Person
    if (filters.personId && !doc.personIds.includes(filters.personId)) return false;

    // Event
    if (filters.eventId && !doc.eventIds.includes(filters.eventId)) return false;

    // Year range (string form: "YYYY-MM-DD" vs numeric)
    if (filters.yearFrom && doc.year < filters.yearFrom) return false;
    if (filters.yearTo && doc.year > filters.yearTo) return false;

    // Date range (ISO strings)
    if (filters.dateFrom && doc.date < filters.dateFrom) return false;
    if (filters.dateTo && doc.date > filters.dateTo) return false;

    // Decade
    if (filters.decade) {
      const d = Number(filters.decade);
      if (!isNaN(d) && doc.decade !== d) return false;
    }

    // Geographic
    if (filters.country && doc.country?.toLowerCase() !== filters.country.toLowerCase()) return false;
    if (filters.state && doc.state?.toLowerCase() !== filters.state.toLowerCase()) return false;
    if (filters.city && doc.city?.toLowerCase() !== filters.city.toLowerCase()) return false;

    // Media type
    if (filters.mediaType && doc.mediaType !== filters.mediaType) return false;

    // Accessibility
    if (filters.hasAudioDescription && !doc.hasAudioDescription) return false;
    if (filters.hasCaptions && !doc.hasCaptions) return false;

    // Today in history (match month-day)
    if (filters.todayInHistory) {
      const docMD = doc.date.slice(5); // "MM-DD"
      if (docMD !== todayMD) return false;
    }

    return true;
  });

  // Sorting
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
      // Keep natural order (approximates relevance for mock data)
      break;
  }

  // Filter people by query
  const filteredPeople = q
    ? people.filter((p) =>
        [p.name, p.description, ...(p.roles ?? [])].join(" ").toLowerCase().includes(q)
      )
    : people;

  // Filter events by query
  const filteredEvents = q
    ? events.filter((e) =>
        [e.title, e.description, e.significance].join(" ").toLowerCase().includes(q)
      )
    : events;

  // Filter topics by query
  const filteredTopics = q
    ? topics.filter((t) => [t.label, t.description].join(" ").toLowerCase().includes(q))
    : topics;

  return {
    documents: filteredDocs,
    people: filteredPeople,
    events: filteredEvents,
    topics: filteredTopics,
    total: filteredDocs.length + filteredPeople.length + filteredEvents.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Ask / Chat
// ─────────────────────────────────────────────────────────────────────────────

export async function askArchive(query: string): Promise<ChatMessage> {
  await delay(900);

  const lowerQuery = query.toLowerCase();
  let content =
    "I can help you explore the Ambedkar Digital Archive. Try asking about the Poona Pact, Annihilation of Caste, the Mahad Satyagraha, or his educational milestones.";
  let sources: ChatMessage["sources"] = [];

  // 1. Check if the query matches anything in the extracted data.json
  const matchedExtracted = extractedData.find((item: any) => {
    // Simple heuristic: if a significant part of the question string is in the query or vice-versa
    const qLower = (item.question || "").toLowerCase();
    // removing punctuation for better match
    const cleanQ = qLower.replace(/[?.,]/g, '');
    const cleanUser = lowerQuery.replace(/[?.,]/g, '');
    
    let aliasMatch = false;
    if (item.aliases) {
      aliasMatch = item.aliases.some((alias: string) => {
        const cleanAlias = alias.toLowerCase().replace(/[?.,]/g, '');
        return cleanAlias.includes(cleanUser) || cleanUser.includes(cleanAlias);
      });
    }

    return cleanQ.includes(cleanUser) || cleanUser.includes(cleanQ) || aliasMatch;
  });

  if (matchedExtracted) {
    const isEnglishQuery = /^[a-zA-Z\s0-9?.,'":\-]*$/.test(lowerQuery);
    content = (isEnglishQuery && matchedExtracted.englishAnswer) ? matchedExtracted.englishAnswer : matchedExtracted.answer;
    sources = [
      {
        documentId: matchedExtracted.citation, // e.g. Volume1.pdf
        title: matchedExtracted.citation,
        excerpt: content,
      }
    ];
  } else if (lowerQuery.includes("annihilation") || lowerQuery.includes("caste")) {
    content =
      "Dr. Ambedkar's most comprehensive critique of the caste system is his undelivered 1936 speech, 'Annihilation of Caste'. He argued that political reform was impossible without social reform and called for the destruction of the religious foundations of caste: 'You must destroy the Shastras.'";
    sources = [
      {
        documentId: "D1",
        title: "Annihilation of Caste",
        excerpt:
          "If you wish to bring about a breach in the system, then you have got to apply the dynamite to the Vedas and the Shastras…",
      },
    ];
  } else if (lowerQuery.includes("poona") || lowerQuery.includes("pact") || lowerQuery.includes("gandhi")) {
    content =
      "The Poona Pact was signed on September 24, 1932, between Dr. B.R. Ambedkar and Mahatma Gandhi's representatives. It secured reserved electoral seats for the depressed classes in exchange for abandoning the demand for separate electorates.";
    sources = [
      {
        documentId: "D4",
        title: "The Poona Pact Agreement",
        excerpt: "Formal agreement finalizing reserved electoral seats for the depressed classes.",
      },
      {
        documentId: "D12",
        title: "Letter to Gandhi on Separate Electorates",
        excerpt: "Articulating Ambedkar's position on separate electorates and the rights of the depressed classes.",
      },
    ];
  } else if (lowerQuery.includes("education") || lowerQuery.includes("columbia")) {
    content =
      "Dr. Ambedkar had an exceptional educational background. He earned his M.A. in Economics from Columbia University in 1915 and his doctoral degree at the London School of Economics in 1923. He was one of the most highly educated Indians of his time.";
    sources = [
      {
        documentId: "D3",
        title: "Administration and Finance of the East India Company",
        excerpt: "His M.A. dissertation analyzing financial systems under British rule.",
      },
      {
        documentId: "D10",
        title: "Problem of the Rupee: Its Origin and Its Solution",
        excerpt: "Doctoral thesis examining the history of the Indian rupee.",
      },
    ];
  } else if (lowerQuery.includes("mahad") || lowerQuery.includes("satyagraha") || lowerQuery.includes("water")) {
    content =
      "The Mahad Satyagraha of 1927 was a watershed moment in the Dalit movement. Dr. Ambedkar led untouchables to the Chavadar tank in Mahad to assert their legal right to use public water. The conference also symbolically burned the Manusmriti.";
    sources = [
      {
        documentId: "D2",
        title: "Address at Mahad Satyagraha",
        excerpt: "Speech delivered during the second Mahad conference where the Manusmriti was symbolically burned.",
      },
    ];
  } else if (lowerQuery.includes("buddhism") || lowerQuery.includes("convert") || lowerQuery.includes("dhamma")) {
    content =
      "On October 14, 1956, Dr. Ambedkar converted to Buddhism at Deekshabhoomi, Nagpur, along with approximately 600,000 followers. He viewed Buddhism as the path to liberation from the caste system. His magnum opus 'The Buddha and His Dhamma' was published posthumously in 1957.";
    sources = [
      {
        documentId: "D6",
        title: "The Buddha and His Dhamma",
        excerpt: "A re-interpretation of the Buddha's teachings and their relevance to social liberation.",
      },
      {
        documentId: "D16",
        title: "Conversion Ceremony at Deekshabhoomi – Newsreel",
        excerpt: "Newsreel documenting the mass conversion ceremony at Nagpur.",
      },
    ];
  } else if (lowerQuery.includes("constitution") || lowerQuery.includes("draft") || lowerQuery.includes("preamble")) {
    content =
      "Dr. Ambedkar was appointed Chairman of the Constitution Drafting Committee on August 29, 1947. He is rightly called the 'Father of the Indian Constitution'. The Constitution he helped draft enshrined fundamental rights, reserved seats for Dalits and Adivasis, and abolished untouchability under Article 17.";
    sources = [
      {
        documentId: "D7",
        title: "Draft of the Indian Constitution – Preamble",
        excerpt: "Early draft establishing the foundational principles of justice, liberty, equality and fraternity.",
      },
    ];
  } else if (lowerQuery.includes("woman") || lowerQuery.includes("women") || lowerQuery.includes("hindu code")) {
    content =
      "Dr. Ambedkar was a strong advocate for women's rights. As Law Minister, he championed the Hindu Code Bill, which sought to grant Hindu women equal rights in marriage, divorce and inheritance. When the bill was diluted and shelved, he resigned from the Cabinet in 1951.";
    sources = [
      {
        documentId: "D14",
        title: "The Hindu Code Bill – Speech in Parliament",
        excerpt: "Last major parliamentary speech defending the Hindu Code Bill.",
      },
      {
        documentId: "D21",
        title: "On the Hindu Code Bill – Resignation Letter",
        excerpt: "Letter of resignation citing failure to pass the Hindu Code Bill.",
      },
    ];
  } else if (lowerQuery.length > 5) {
    content = `Based on the archives, here is some information regarding "${query}": Dr. Ambedkar's extensive writings cover constitutional law, economics, social justice, religion and labour rights. Try narrowing your question to one of these areas for a more specific answer.`;
  }

  return {
    id: Date.now().toString(),
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    sources,
    confidence: sources && sources.length > 0 ? "high" : "medium",
  };
}
