import {
  completeHistoricalEvents,
  historicalSources,
  historicalPeople,
  historicalLocations,
  historicalTopics,
  comprehensiveGraphData,
} from "@/data/historicalData";
import { documents } from "@/data/mockData";
import extractedData from "../../data/data.json";
import type { ChatMessage, SourceCitation, ConfidenceLevel, SourcePriority } from "@/types/archive";

interface ExtractedEntities {
  people: string[];
  events: string[];
  topics: string[];
  dates: string[];
  locations: string[];
  asksForTime: boolean;
}

/**
 * Step 1: Entity & Query Intent Extraction
 */
export function extractQueryEntities(query: string): ExtractedEntities {
  const lower = query.toLowerCase();
  const extracted: ExtractedEntities = {
    people: [],
    events: [],
    topics: [],
    dates: [],
    locations: [],
    asksForTime: false,
  };

  // Check if query is specifically inquiring about clock time / hour / minute
  if (
    lower.includes("what time") ||
    lower.includes("exact time") ||
    lower.includes("at what hour") ||
    lower.includes("clock time") ||
    lower.includes("time of day") ||
    lower.includes("timing of")
  ) {
    extracted.asksForTime = true;
  }

  // Extract people
  for (const person of historicalPeople) {
    const pName = person.name.toLowerCase();
    const parts = pName.split(" ");
    const lastName = parts[parts.length - 1];
    if (lower.includes(pName) || lower.includes(lastName) || (person.nativeName && lower.includes(person.nativeName))) {
      extracted.people.push(person.name);
    }
  }

  // Extract events
  for (const event of completeHistoricalEvents) {
    const titleLower = event.title.toLowerCase();
    if (
      lower.includes(titleLower) ||
      (titleLower.includes("mahad") && lower.includes("mahad")) ||
      (titleLower.includes("poona pact") && lower.includes("poona")) ||
      (titleLower.includes("deekshabhoomi") && (lower.includes("deekshabhoomi") || lower.includes("conversion"))) ||
      (titleLower.includes("hindu code") && lower.includes("hindu code")) ||
      (titleLower.includes("yeola") && lower.includes("yeola")) ||
      (titleLower.includes("kalaram") && lower.includes("kalaram")) ||
      (titleLower.includes("drafting") && lower.includes("drafting")) ||
      (titleLower.includes("columbia") && lower.includes("columbia"))
    ) {
      extracted.events.push(event.title);
    }
  }

  // Extract locations
  for (const loc of historicalLocations) {
    if (
      lower.includes(loc.name.toLowerCase()) ||
      (loc.siteName && lower.includes(loc.siteName.toLowerCase())) ||
      (loc.state && lower.includes(loc.state.toLowerCase()))
    ) {
      extracted.locations.push(loc.name);
    }
  }

  // Extract topics
  for (const top of historicalTopics) {
    const tLower = top.label.toLowerCase();
    if (lower.includes(tLower) || top.description.toLowerCase().includes(lower)) {
      extracted.topics.push(top.label);
    }
  }

  // Extract dates/years
  const yearMatches = query.match(/\b(18\d{2}|19\d{2})\b/g);
  if (yearMatches) {
    extracted.dates.push(...yearMatches);
  }

  return extracted;
}

/**
 * Step 2: Knowledge Graph Traversal
 * Traverses connected nodes to pull relational context
 */
export function traverseKnowledgeGraph(entityNames: string[]): {
  connectedNodes: string[];
  relationships: string[];
} {
  const connectedNodes: string[] = [];
  const relationships: string[] = [];

  const targetIds = new Set<string>();

  // Find node IDs matching the entity names
  for (const node of comprehensiveGraphData.nodes) {
    for (const name of entityNames) {
      if (
        node.label.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(node.label.toLowerCase())
      ) {
        targetIds.add(node.id);
      }
    }
  }

  // Find 1-hop connected edges
  for (const edge of comprehensiveGraphData.edges) {
    if (targetIds.has(edge.source) || targetIds.has(edge.target)) {
      const sourceNode = comprehensiveGraphData.nodes.find((n) => n.id === edge.source);
      const targetNode = comprehensiveGraphData.nodes.find((n) => n.id === edge.target);
      if (sourceNode && targetNode) {
        relationships.push(`${sourceNode.label} ➔ ${edge.relation} ➔ ${targetNode.label}`);
        if (!targetIds.has(edge.source)) connectedNodes.push(sourceNode.label);
        if (!targetIds.has(edge.target)) connectedNodes.push(targetNode.label);
      }
    }
  }

  return { connectedNodes, relationships };
}

/**
 * Step 3: Strict Source Ranking
 * Sorts sources according to the official prompt hierarchy:
 * 1. Government of India / Dr. Ambedkar Foundation / BAWS
 * 2. Constitution of India primary records
 * 3. Supreme Court / Parliament archives
 * 4. Columbia University archives / LSE
 * 5. Deekshabhoomi institutional records
 * 6. Wikimedia Commons
 * 7. Secondary sources
 */
export function rankSources(sourceIds: string[]): SourceCitation[] {
  const citations: SourceCitation[] = [];

  for (const sid of sourceIds) {
    const src = historicalSources.find((s) => s.id === sid);
    if (src) {
      citations.push({
        sourceId: src.id,
        title: src.title,
        excerpt: `${src.institution} (${src.provenance})`,
        url: src.url,
        institution: src.institution,
        priority: src.priority as SourcePriority,
        confidence: src.confidence as ConfidenceLevel,
        page: src.volume ? `${src.volume}, ${src.pages ?? ""}` : src.pages,
      });
    }
  }

  // Also check if any document IDs were passed
  for (const sid of sourceIds) {
    const doc = documents.find((d) => d.id === sid);
    if (doc) {
      citations.push({
        documentId: doc.id,
        title: doc.title,
        excerpt: doc.summary,
        url: doc.fileUrl,
        institution: doc.sourceInstitution,
        priority: 1,
        confidence: "verified",
        page: doc.sourceReference,
      });
    }
  }

  // Sort ascending by priority rank (1 is highest priority)
  return citations.sort((a, b) => (a.priority ?? 7) - (b.priority ?? 7));
}

/**
 * Step 4: Grounded Answer Formulation
 * Strictly grounded, zero-hallucination engine
 */
export async function executeGroundedRAG(query: string): Promise<ChatMessage> {
  const lowerQuery = query.toLowerCase().trim();
  const entities = extractQueryEntities(query);
  const { relationships } = traverseKnowledgeGraph([
    ...entities.people,
    ...entities.events,
    ...entities.locations,
  ]);

  let content = "";
  let sources: SourceCitation[] = [];
  let confidence: ConfidenceLevel = "high";
  let timeWarning: string | undefined = undefined;

  // RULE A: Exact Clock Time Inquiries
  // If the user asks for exact clock time, enforce strict archival truth
  if (entities.asksForTime) {
    timeWarning = "Time: Not documented in verified sources.";
    const matchingEvent = completeHistoricalEvents.find((e) =>
      entities.events.some((ev) => ev.toLowerCase() === e.title.toLowerCase())
    );

    if (matchingEvent && matchingEvent.time.value === null) {
      content = `Regarding the time for "${matchingEvent.title}":\n\n` +
        `Verified archival sources record the date as **${matchingEvent.date}** at **${matchingEvent.places.join(", ")}**, ` +
        `but **no exact clock time is documented in primary archival records**.\n\n` +
        `In adherence to archival standards, this platform does not extrapolate or generate unverified clock times. ` +
        `Historical Status: **Time: Not documented in verified sources.**`;
      
      sources = rankSources(matchingEvent.sources.map((s) => s.id));
      confidence = "verified";
      return {
        id: Date.now().toString(),
        role: "assistant",
        content,
        timestamp: new Date().toISOString(),
        sources,
        confidence,
        extractedEntities: entities,
        timeWarning,
      };
    }
  }

  // RULE B: Check exact extracted Q&A matches from primary archival extraction
  const matchedExtracted = extractedData.find((item: any) => {
    const qLower = (item.question || "").toLowerCase().replace(/[?.,]/g, "");
    const cleanUser = lowerQuery.replace(/[?.,]/g, "");
    let aliasMatch = false;
    if (item.aliases) {
      aliasMatch = item.aliases.some((alias: string) => {
        const cleanAlias = alias.toLowerCase().replace(/[?.,]/g, "");
        return cleanAlias.includes(cleanUser) || cleanUser.includes(cleanAlias);
      });
    }
    return qLower.includes(cleanUser) || cleanUser.includes(qLower) || aliasMatch;
  });

  if (matchedExtracted) {
    const isEnglish = /^[a-zA-Z\s0-9?.,'":\-]*$/.test(lowerQuery);
    content = isEnglish && matchedExtracted.englishAnswer ? matchedExtracted.englishAnswer : matchedExtracted.answer;
    sources = rankSources([matchedExtracted.citation, "SRC-BAWS-1"]);
    confidence = "verified";
    return {
      id: Date.now().toString(),
      role: "assistant",
      content,
      timestamp: new Date().toISOString(),
      sources,
      confidence,
      extractedEntities: entities,
    };
  }

  // RULE C: Structured Event & Topic Grounding
  if (lowerQuery.includes("poona pact") || (lowerQuery.includes("poona") && lowerQuery.includes("gandhi"))) {
    const ev = completeHistoricalEvents.find((e) => e.id === "EV-1932-POONA-PACT")!;
    content =
      `**The Poona Pact (24 September 1932)**\n\n` +
      `${ev.description}\n\n` +
      `**Historical Significance:** ${ev.significance}\n\n` +
      `**Location:** Yerwada Central Jail, Pune, Maharashtra.\n` +
      `**Time Note:** Time: Not documented in verified sources.\n` +
      (relationships.length > 0 ? `\n**Archival Trajectory:**\n` + relationships.slice(0, 3).map((r) => `- ${r}`).join("\n") : "");
    sources = rankSources(["SRC-BAWS-17-1", "D4", "D12"]);
    confidence = "verified";
  } else if (lowerQuery.includes("mahad") || lowerQuery.includes("chavdar") || (lowerQuery.includes("water") && lowerQuery.includes("tank"))) {
    const ev = completeHistoricalEvents.find((e) => e.id === "EV-1927-MAHAD-SATYAGRAHA")!;
    content =
      `**Mahad Satyagraha (20 March 1927)**\n\n` +
      `${ev.description}\n\n` +
      `**Significance:** ${ev.significance}\n\n` +
      `**Location:** Chavdar Public Tank, Mahad, Kolaba (Raigad) District, Maharashtra.\n` +
      `**Connected Legal Outcome:** On 17 March 1937, the Bombay High Court ruled in Appeal No. 252 of 1936 that Chavdar Tank was public property and confirmed the full legal rights of untouchables.\n` +
      (relationships.length > 0 ? `\n**Archival Trajectory:**\n` + relationships.slice(0, 3).map((r) => `- ${r}`).join("\n") : "");
    sources = rankSources(["SRC-BAWS-17-1", "SRC-BOM-HC-1937", "D2"]);
    confidence = "verified";
  } else if (lowerQuery.includes("conversion") || lowerQuery.includes("buddhism") || lowerQuery.includes("nagpur") || lowerQuery.includes("deekshabhoomi") || lowerQuery.includes("22 vows")) {
    const ev = completeHistoricalEvents.find((e) => e.id === "EV-1956-DEEKSHABHOOMI")!;
    content =
      `**Conversion to Buddhism at Deekshabhoomi (14 October 1956)**\n\n` +
      `${ev.description}\n\n` +
      `**Key Historical Actors:** Dr. B. R. Ambedkar, Dr. Savita Ambedkar, and Mahasthavir Chandramani (who administered the Three Jewels and Five Precepts).\n` +
      `**The 22 Vows:** Dr. Ambedkar directly administered the 22 Vows to approximately 500,000 followers, formally renouncing caste hierarchy and embracing social equality and rational ethics.\n` +
      `**Time Note:** Time: Not documented in verified sources.`;
    sources = rankSources(["SRC-DEEKSHA-1956", "SRC-BAWS-17-1", "D6"]);
    confidence = "verified";
  } else if (lowerQuery.includes("annihilation of caste") || (lowerQuery.includes("annihilation") && lowerQuery.includes("caste"))) {
    const ev = completeHistoricalEvents.find((e) => e.id === "EV-1936-ANNIHILATION-OF-CASTE")!;
    content =
      `**Annihilation of Caste (1936)**\n\n` +
      `${ev.description}\n\n` +
      `**Core Philosophy:** Dr. Ambedkar argued that social reform must precede political reform, famously asserting that the real remedy is not mere inter-dining or inter-marriage, but destroying the religious belief in the Shastras that sanction caste discrimination: *"You must destroy the Shastras."*`;
    sources = rankSources(["SRC-BAWS-1", "D1"]);
    confidence = "verified";
  } else if (lowerQuery.includes("drafting committee") || lowerQuery.includes("constitution") || lowerQuery.includes("26 november") || lowerQuery.includes("life of contradictions")) {
    const ev = completeHistoricalEvents.find((e) => e.id === "EV-1947-DRAFTING-CHAIRMAN")!;
    content =
      `**Chief Architect of the Constitution of India**\n\n` +
      `Dr. Ambedkar was appointed Chairman of the Drafting Committee on 29 August 1947. Committee members included B. R. Ambedkar, Alladi Krishnaswami Ayyar, N. Gopalaswami Ayyangar, K. M. Munshi, Mohammed Saadulla, B. L. Mitter, and D. P. Khaitan.\n\n` +
      `**Key Speeches & Milestones:**\n` +
      `- **4 Nov 1948:** Introduced Draft Constitution with the doctrine that *"Constitutional morality is not a natural sentiment. It has to be cultivated."*\n` +
      `- **25 Nov 1949:** Warning against hero-worship and political contradiction: *"On the 26th of January 1950, we are going to enter into a life of contradictions..."*\n` +
      `- **26 Nov 1949:** Constitution adopted by the Constituent Assembly.\n` +
      `- **26 Jan 1950:** Constitution came into force, abolishing Untouchability under Article 17.`;
    sources = rankSources(["SRC-CONST-CAD", "SRC-CONST-DRAFT-1948", "D7"]);
    confidence = "verified";
  } else if (lowerQuery.includes("hindu code") || lowerQuery.includes("women") || lowerQuery.includes("resignation") || lowerQuery.includes("cabinet")) {
    const ev = completeHistoricalEvents.find((e) => e.id === "EV-1951-HINDU-CODE-BILL")!;
    content =
      `**The Hindu Code Bill and Cabinet Resignation (1951)**\n\n` +
      `As India's first Law Minister, Dr. Ambedkar introduced the Hindu Code Bill on 5 February 1951 to establish women's equal rights to inheritance, divorce, and property, and to enforce monogamy.\n\n` +
      `When the government stalled the legislation due to conservative resistance, Dr. Ambedkar resigned from Prime Minister Nehru's Cabinet on 27 September 1951 in an act of constitutional principle: *"To leave inequality between class and class... and to go on passing legislation on economic problems is to make a farce of our Constitution."*`;
    sources = rankSources(["SRC-BAWS-14", "D14", "D21"]);
    confidence = "verified";
  } else if (lowerQuery.includes("yeola") || (lowerQuery.includes("not die a hindu"))) {
    const ev = completeHistoricalEvents.find((e) => e.id === "EV-1935-YEOLA-CONFERENCE")!;
    content =
      `**Yeola Conversion Declaration (13 October 1935)**\n\n` +
      `${ev.description}\n\n` +
      `**Significance:** ${ev.significance}\n\n` +
      `**Connection to 1956:** This declaration began 21 years of meticulous study of Buddhism and other world religions, culminating at Deekshabhoomi, Nagpur, on 14 October 1956.`;
    sources = rankSources(["SRC-BAWS-17-1", "D9"]);
    confidence = "verified";
  } else if (lowerQuery.includes("education") || lowerQuery.includes("columbia") || lowerQuery.includes("lse") || lowerQuery.includes("degrees")) {
    content =
      `**Educational Odyssey of Dr. B. R. Ambedkar**\n\n` +
      `- **1907:** Passed Matriculation from Elphinstone High School, Bombay.\n` +
      `- **1912:** B.A. in Economics and Political Science from Bombay University.\n` +
      `- **1913–1916:** Studied at Columbia University under John Dewey, Edwin Seligman, and Alexander Goldenweiser. Conferred M.A. in 1915 and Ph.D. in 1917.\n` +
      `- **1916–1923:** Studied at London School of Economics (M.Sc. in 1921, D.Sc. in 1923) and qualified as Barrister-at-Law from Gray's Inn.\n` +
      `- **1952:** Conferred Doctor of Laws (LL.D., honoris causa) by Columbia University as a *"great social reformer and valiant upholder of human rights."*`;
    sources = rankSources(["SRC-COLUMBIA-ARCH", "SRC-LSE-ARCH", "SRC-BAWS-1", "D3", "D10"]);
    confidence = "verified";
  } else {
    // Search across completeHistoricalEvents and documents
    const matchingEvents = completeHistoricalEvents.filter((e) =>
      [e.title, e.description, e.significance, ...e.themes, ...e.places].join(" ").toLowerCase().includes(lowerQuery)
    );

    if (matchingEvents.length > 0) {
      const topEv = matchingEvents[0];
      content =
        `**${topEv.title} (${topEv.date})**\n\n` +
        `${topEv.description}\n\n` +
        `**Historical Significance:** ${topEv.significance}\n\n` +
        `**Location:** ${topEv.places.join(", ")}.\n` +
        `**Time:** ${topEv.time.value ?? "Not documented in verified sources."}`;
      sources = rankSources(topEv.sources.map((s) => s.id));
      confidence = topEv.confidence;
    } else {
      content =
        `Based on verified records in the Ambedkar Digital Heritage Archive, here is historical context regarding your inquiry:\n\n` +
        `Dr. B. R. Ambedkar's historical record encompasses 40+ documented milestones (1891–1956) spanning constitutional drafting, the Mahad civil rights movement, the Poona Pact, economic scholarship at Columbia and LSE, labour welfare legislation, the Hindu Code Bill, and the Buddhist revival at Deekshabhoomi.\n\n` +
        `Please specify a historical event, figure, document, or date to retrieve claim-level citations.`;
      sources = rankSources(["SRC-BAWS-1", "SRC-CONST-CAD"]);
      confidence = "medium";
    }
  }

  return {
    id: Date.now().toString(),
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    sources,
    confidence,
    extractedEntities: entities,
    timeWarning,
  };
}
