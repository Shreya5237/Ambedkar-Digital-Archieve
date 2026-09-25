import type { ChatSession, ChatMessage } from "@/types/archive";

export const SAMPLE_CHAT_SESSIONS: ChatSession[] = [
  {
    id: "session-const-art17",
    title: "Constituent Assembly: Article 17 & Constitutional Morality",
    mode: "research",
    createdAt: "2024-09-24T09:15:00Z",
    updatedAt: "2024-09-24T09:42:00Z",
    tags: ["Constitutional Law", "CAD Vol. VII", "Article 17", "1948-1949"],
    researchParameters: {
      era: "1946-1950",
      strictPrimaryOnly: true,
      synthesisFormat: "synthesis",
      bawsVolumeFilter: "Vol 13",
    },
    researchNotes: [
      {
        id: "note-1",
        sessionId: "session-const-art17",
        type: "quote",
        title: "Constitutional Morality Definition",
        content:
          "Constitutional morality is not a natural sentiment. It has to be cultivated. We must realize that our people have yet to learn it. Democracy in India is only a top-dressing on an Indian soil, which is essentially undemocratic.",
        sourceTitle: "Constituent Assembly Debates, Vol. VII",
        authorOrSpeaker: "Dr. B. R. Ambedkar",
        reference: "CAD Vol. VII, p. 38 (4 November 1948)",
        addedAt: "2024-09-24T09:20:00Z",
        tags: ["Constitutional Morality", "CAD"],
      },
      {
        id: "note-2",
        sessionId: "session-const-art17",
        type: "quote",
        title: "Warning on Life of Contradictions",
        content:
          "On the 26th of January 1950, we are going to enter into a life of contradictions. In politics we will have equality and in social and economic life we will have inequality.",
        sourceTitle: "Constituent Assembly Debates, Vol. XI",
        authorOrSpeaker: "Dr. B. R. Ambedkar",
        reference: "CAD Vol. XI, pp. 972–981 (25 November 1949)",
        addedAt: "2024-09-24T09:35:00Z",
        tags: ["Democracy", "Equality"],
      },
    ],
    messages: [
      {
        id: "msg-const-1-user",
        role: "user",
        content:
          "How did Dr. Ambedkar articulate the abolition of Untouchability under Article 17, and what role did constitutional morality play in the 1948 Draft Constitution debates?",
        timestamp: "2024-09-24T09:15:30Z",
        mode: "research",
      },
      {
        id: "msg-const-1-asst",
        role: "assistant",
        content:
          `### Archival Research Synthesis: Article 17 & Constitutional Morality\n\n` +
          `**1. Legislative Genesis of Article 17 (Draft Article 11)**\n` +
          `The abolition of untouchability was formulated as Draft Article 11 by the Fundamental Rights Sub-Committee in April 1947 and introduced to the Constituent Assembly on **29 November 1948**.\n\n` +
          `Dr. B. R. Ambedkar, as Chairman of the Drafting Committee, steered the provision to ensure that "Untouchability" was not merely declared unlawful in civic terms, but that **its practice in any form was declared a punishable offence by parliamentary law** (later enacted under Article 35 as the Untouchability (Offences) Act, 1955; subsequently the Protection of Civil Rights Act).\n\n` +
          `**2. Doctrine of Constitutional Morality (4 November 1948)**\n` +
          `In his landmark address introducing the Draft Constitution, Dr. Ambedkar drew upon George Grote's historiography of Athenian democracy to establish that constitutional morality is neither intuitive nor innate:\n\n` +
          `> *"Constitutional morality is not a natural sentiment. It has to be cultivated. We must realize that our people have yet to learn it. Democracy in India is only a top-dressing on an Indian soil, which is essentially undemocratic."*\n\n` +
          `**3. Archival Precision & Chronological Rigor**\n` +
          `The Assembly unanimously adopted Draft Article 11 amidst shouts of *"Ambedkar ki Jai"* on 29 November 1948. While historical records meticulously log verbatim parliamentary transcripts, **no exact clock-hour of debate commencement or vote tally is recorded in the official gazettes**, adhering to standard Commonwealth parliamentary reporting conventions.`,
        timestamp: "2024-09-24T09:16:15Z",
        mode: "research",
        confidence: "verified",
        timeWarning: "Time: Clock time of parliamentary session opening not documented in official Assembly gazettes.",
        extractedEntities: {
          people: ["Dr. B. R. Ambedkar", "George Grote", "K. M. Munshi"],
          events: ["Constituent Assembly Debates", "Introduction of Draft Constitution"],
          topics: ["Constitution & Law", "Social Justice & Equality"],
          dates: ["1948", "1950", "29 November 1948", "4 November 1948"],
          locations: ["Constitution Hall (Central Hall of Parliament), New Delhi"],
        },
        sources: [
          {
            documentId: "D7",
            sourceId: "SRC-CONST-CAD",
            title: "Constituent Assembly Debates (Official Report), Volume VII",
            page: "Vol. VII, pp. 31–44, 659–669",
            excerpt: "Verbatim debate on Draft Article 11 (Article 17) and speech introducing Draft Constitution.",
            institution: "Lok Sabha Secretariat / Parliament Library, New Delhi",
            priority: 1,
            confidence: "verified",
          },
          {
            documentId: "D1",
            sourceId: "SRC-BAWS-13",
            title: "Dr. Babasaheb Ambedkar: Writings and Speeches, Volume 13",
            page: "Vol. 13: Dr. Ambedkar and the Constitution of India",
            excerpt: "Complete records of Drafting Committee minutes, amendments, and legal memorandums.",
            institution: "Dr. Ambedkar Foundation, Ministry of Social Justice and Empowerment",
            priority: 1,
            confidence: "verified",
          },
        ],
        researchData: {
          executiveAbstract:
            "Archival analysis of Constituent Assembly proceedings reveals that Article 17 was designed as a self-executing constitutional injunction against untouchability, paired with Article 35 mandate for penal legislation. Dr. Ambedkar grounded this in the imperative of 'constitutional morality' to counteract social hierarchy.",
          historiographicalContext:
            "Introduced during the second reading of the Draft Constitution on 29 November 1948, Draft Article 11 passed without substantive dissent. Dr. Ambedkar's 4 November 1948 speech established the conceptual boundary between mere administrative constitutionality and cultivated democratic morality.",
          verbatimQuotes: [
            {
              quote:
                "Constitutional morality is not a natural sentiment. It has to be cultivated. We must realize that our people have yet to learn it. Democracy in India is only a top-dressing on an Indian soil, which is essentially undemocratic.",
              speaker: "Dr. B. R. Ambedkar",
              source: "Constituent Assembly Debates, Vol. VII",
              folioOrPage: "p. 38",
              year: "1948",
              institutionalPriority: 1,
            },
            {
              quote:
                "'Untouchability' is abolished and its practice in any form is forbidden. The enforcement of any disability arising out of 'Untouchability' shall be an offence punishable in accordance with law.",
              speaker: "Drafting Committee",
              source: "Constitution of India, Official Text (1950)",
              folioOrPage: "Article 17, Part III",
              year: "1949",
              institutionalPriority: 1,
            },
          ],
          corroborationMatrix: [
            {
              sourceTitle: "Constituent Assembly Debates (Official Report), Vol. VII",
              repository: "Parliament Library of India, New Delhi",
              tier: "Tier 1: Parliamentary Primary Record",
              priority: 1,
              consensusStatus: "Primary Official Record",
            },
            {
              sourceTitle: "Dr. Babasaheb Ambedkar: Writings and Speeches (BAWS), Vol. 13",
              repository: "Ministry of Social Justice and Empowerment, Govt. of India",
              tier: "Tier 1: Official National Archive Edition",
              priority: 1,
              consensusStatus: "Independently Corroborated",
            },
            {
              sourceTitle: "B. Shiva Rao, The Framing of India's Constitution: Select Documents",
              repository: "Indian Institute of Public Administration (IIPA)",
              tier: "Tier 2: Scholarly Source Collection",
              priority: 3,
              consensusStatus: "Corroborated by Legislative Record",
            },
          ],
          archivalLimitations:
            "Debate transcripts record day and agenda items, but parliamentary reporters did not log specific clock-hours for individual speeches. Verified date: 29 November 1948.",
          recommendedPrimaryReadings: [
            {
              title: "Draft Constitution of India (October 1947 Draft & February 1948 Published Draft)",
              documentId: "D7",
              volume: "BAWS Vol. 13",
              relevance: "Primary evolution from Advisory Committee clause to Draft Article 11.",
            },
            {
              title: "Speech on Third Reading of the Constitution (25 November 1949)",
              volume: "CAD Vol. XI",
              relevance: "Comprehensive philosophical summation on social vs political democracy.",
            },
          ],
          academicCitations: {
            apa: "Constituent Assembly of India. (1948). Debates: Official report (Vol. 7, pp. 31–44, 659–669). Lok Sabha Secretariat, Government of India.",
            chicago: "Constituent Assembly of India. Constituent Assembly Debates (Official Report). Vol. 7. New Delhi: Lok Sabha Secretariat, 1948.",
            mla: "Constituent Assembly of India. Constituent Assembly Debates: Official Report. Vol. 7, Lok Sabha Secretariat, 1948.",
            bibtex:
              `@book{cad1948vol7,\n  title={Constituent Assembly Debates (Official Report)},\n  author={{Constituent Assembly of India}},\n  volume={7},\n  year={1948},\n  publisher={Lok Sabha Secretariat, New Delhi},\n  pages={31--44, 659--669}\n}`,
          },
        },
      },
    ],
  },
  {
    id: "session-mahad-legal",
    title: "Mahad Satyagraha (1927) & Bombay High Court 1937 Precedent",
    mode: "research",
    createdAt: "2024-09-22T14:30:00Z",
    updatedAt: "2024-09-22T15:10:00Z",
    tags: ["Civil Rights", "Legal Jurisprudence", "Bombay High Court", "1927-1937"],
    researchParameters: {
      era: "1924-1935",
      strictPrimaryOnly: false,
      synthesisFormat: "synthesis",
      bawsVolumeFilter: "Vol 17",
    },
    researchNotes: [
      {
        id: "note-mahad-1",
        sessionId: "session-mahad-legal",
        type: "quote",
        title: "Mahad Human Rights Proclamation",
        content:
          "The water of Chavdar Tank is not nectar that will make us immortal. We are going to the tank simply to assert that we too are human beings like others.",
        sourceTitle: "Bahishkrit Bharat (Editorial)",
        authorOrSpeaker: "Dr. B. R. Ambedkar",
        reference: "Bahishkrit Bharat, 20 March 1927 (BAWS Vol. 17, Part 1)",
        addedAt: "2024-09-22T14:45:00Z",
        tags: ["Mahad", "Human Rights", "1927"],
      },
    ],
    messages: [
      {
        id: "msg-mahad-1-user",
        role: "user",
        content:
          "Provide an archival dossier on the Mahad Satyagraha (20 March 1927) and trace the 10-year legal battle concluding in the Bombay High Court Appeal No. 252 of 1936.",
        timestamp: "2024-09-22T14:30:10Z",
        mode: "research",
      },
      {
        id: "msg-mahad-1-asst",
        role: "assistant",
        content:
          `### Historiographical Dossier: Mahad Satyagraha & Bombay High Court Landmark (1927–1937)\n\n` +
          `**1. Antecedents: The Bole Resolution of 1923**\n` +
          `On 4 August 1923, the Bombay Legislative Council passed S. K. Bole's resolution recommending that the Untouchables be allowed to use all public water sources, wells, dharamshalas, and dispensaries. On 5 January 1924, the Mahad Municipality formally adopted the resolution. However, local caste orthodoxy prevented enforcement.\n\n` +
          `**2. Direct Action at Chavdar Tank (20 March 1927)**\n` +
          `During the Kolaba District Depressed Classes Conference (19–20 March 1927), Dr. Ambedkar led thousands of delegates in peaceful procession to the Chavdar Tank, drinking water to establish fundamental civil rights. The action was met with violent backlash and an orthodox ritual "purification" of the tank using 108 earthen pots of cow dung, urine, and curd.\n\n` +
          `**3. The 10-Year Litigation Trajectory (1927–1937)**\n` +
          `- **Regular Civil Suit No. 405 of 1927:** Caste Hindus filed suit claiming Chavdar Tank was private property (*nistar* rights).\n` +
          `- **Temporary Injunction:** District Munsiff granted an ex-parte injunction restraining Untouchables from using the tank.\n` +
          `- **Trial Court & District Court:** Dismissed the orthodox plea on grounds that the tank was municipal property dedicated to public use.\n` +
          `- **Conclusive High Court Verdict (17 March 1937):** In *Appeal No. 252 of 1936*, Justices Broomfield and Sen of the Bombay High Court conclusively dismissed the orthodox appeal, affirming that Chavdar Tank was public property and confirming the full legal rights of Untouchables to access public waters.`,
        timestamp: "2024-09-22T14:31:05Z",
        mode: "research",
        confidence: "verified",
        timeWarning: "Time: Clock time of the morning march to Chavdar Tank is unverified in official court records.",
        extractedEntities: {
          people: ["Dr. B. R. Ambedkar", "S. K. Bole", "Justice Broomfield", "Justice Sen"],
          events: ["Mahad Satyagraha", "Manusmriti Dahan"],
          topics: ["Social Justice & Equality", "Constitution & Law"],
          dates: ["1927", "1937", "20 March 1927", "17 March 1937", "4 August 1923"],
          locations: ["Mahad", "Chavdar Tank", "Bombay High Court"],
        },
        sources: [
          {
            documentId: "D2",
            sourceId: "SRC-BAWS-17-1",
            title: "Dr. Babasaheb Ambedkar: Writings and Speeches, Volume 17 (Part 1)",
            page: "Part 1, pp. 3–42",
            excerpt: "Contemporary reports, resolutions, and editorials on Mahad Satyagraha.",
            institution: "Dr. Ambedkar Foundation, Ministry of Social Justice and Empowerment",
            priority: 1,
            confidence: "verified",
          },
          {
            sourceId: "SRC-BOM-HC-1937",
            title: "Bombay High Court Law Reports, Appeal No. 252 of 1936",
            page: "ILR (1937) Bom. Series",
            excerpt: "Judgment of Broomfield and Sen JJ. confirming Chavdar Tank as public municipal property.",
            institution: "Bombay High Court Archives, Mumbai",
            priority: 2,
            confidence: "verified",
          },
        ],
        researchData: {
          executiveAbstract:
            "The Mahad Satyagraha of 20 March 1927 inaugurated the modern Indian civil rights movement. Beyond direct moral action, Dr. Ambedkar anchored the struggle in constitutional legality, fighting a ten-year court battle up to the Bombay High Court which established public civic equality.",
          historiographicalContext:
            "Occurred in the context of the 1923 Bole Resolution. The movement transformed from an assertion of civic rights on 20 March 1927 to structural ideological defiance with the burning of the Manusmriti on 25 December 1927.",
          verbatimQuotes: [
            {
              quote:
                "The water of Chavdar Tank is not nectar that will make us immortal. We are going to the tank simply to assert that we too are human beings like others.",
              speaker: "Dr. B. R. Ambedkar",
              source: "Speech at Kolaba District Conference, Mahad",
              folioOrPage: "BAWS Vol. 17 (1), p. 12",
              year: "1927",
              institutionalPriority: 1,
            },
            {
              quote:
                "Chavdar Tank is a public tank vested in the municipality for the use of all inhabitants of Mahad without distinction of caste or creed.",
              speaker: "Justices Broomfield & Sen",
              source: "Bombay High Court Appeal No. 252 of 1936",
              folioOrPage: "Judicial Record, 17 March 1937",
              year: "1937",
              institutionalPriority: 2,
            },
          ],
          corroborationMatrix: [
            {
              sourceTitle: "Bombay High Court Judicial Record (Appeal No. 252 of 1936)",
              repository: "High Court of Judicature at Bombay Archives",
              tier: "Tier 2: Judicial Archival Record",
              priority: 2,
              consensusStatus: "Independently Corroborated",
            },
            {
              sourceTitle: "Dr. Babasaheb Ambedkar: Writings and Speeches, Vol. 17 (Part 1)",
              repository: "Government of Maharashtra Education Dept.",
              tier: "Tier 1: Official National Archive Edition",
              priority: 1,
              consensusStatus: "Primary Official Record",
            },
            {
              sourceTitle: "Kolaba District Gazetteer (1964 Revision)",
              repository: "Directorate of Government Printing and Stationery, Maharashtra",
              tier: "Tier 3: Administrative Gazetteer",
              priority: 3,
              consensusStatus: "Secondary Historical Support",
            },
          ],
          archivalLimitations:
            "Municipal registers from Mahad (1924–1927) exist in fragmentary physical state; secondary gazetteers corroborate the 1924 Municipal Board resolution date as 5 January 1924.",
          recommendedPrimaryReadings: [
            {
              title: "Bahishkrit Bharat (Fortnightly Journal) Issues: April–December 1927",
              volume: "BAWS Vol. 17 (Part 2)",
              relevance: "Direct Marathi editorials documenting the Satyagraha and trial proceedings.",
            },
            {
              title: "Manusmriti Dahan Resolution (25 December 1927)",
              volume: "BAWS Vol. 17 (Part 1)",
              relevance: "Archival record of the second Mahad conference and resolution.",
            },
          ],
          academicCitations: {
            apa: "Ambedkar, B. R. (1927). The Mahad Satyagraha. In V. Moon (Ed.), Dr. Babasaheb Ambedkar: Writings and speeches (Vol. 17, Part 1, pp. 3–42). Government of Maharashtra.",
            chicago: "Ambedkar, B. R. 'The Mahad Satyagraha.' In Dr. Babasaheb Ambedkar: Writings and Speeches, edited by Vasant Moon, Vol. 17, Part 1, 3–42. Bombay: Education Department, 1927.",
            mla: "Ambedkar, B. R. 'The Mahad Satyagraha.' Dr. Babasaheb Ambedkar: Writings and Speeches, edited by Vasant Moon, vol. 17, part 1, 1927, pp. 3–42.",
            bibtex:
              `@incollection{ambedkar1927mahad,\n  author={Ambedkar, B. R.},\n  title={The Mahad Satyagraha},\n  booktitle={Dr. Babasaheb Ambedkar: Writings and Speeches},\n  editor={Moon, Vasant},\n  volume={17 (Part 1)},\n  pages={3--42},\n  year={1927},\n  publisher={Education Department, Government of Maharashtra}\n}`,
          },
        },
      },
    ],
  },
  {
    id: "session-rupee-monetary",
    title: "The Problem of the Rupee: Monetary Theory & RBI Architecture",
    mode: "standard",
    createdAt: "2024-09-20T11:00:00Z",
    updatedAt: "2024-09-20T11:25:00Z",
    tags: ["Economics", "Monetary Policy", "LSE", "RBI"],
    messages: [
      {
        id: "msg-rupee-1-user",
        role: "user",
        content:
          "What was Dr. Ambedkar's economic critique of the gold exchange standard in The Problem of the Rupee?",
        timestamp: "2024-09-20T11:00:20Z",
        mode: "standard",
      },
      {
        id: "msg-rupee-1-asst",
        role: "assistant",
        content:
          `In his 1923 doctoral dissertation at the London School of Economics (supervised by Professor Edwin Cannan), published as ***The Problem of the Rupee: Its Origin and Its Solution***, Dr. B. R. Ambedkar formulated an incisive critique of the colonial currency system.\n\n` +
          `### Core Economic Arguments:\n` +
          `1. **Critique of the Gold Exchange Standard:**\n` +
          `   Dr. Ambedkar directly challenged John Maynard Keynes's endorsement of the Gold Exchange Standard for India. Ambedkar argued that the gold exchange standard lacked automaticity and gave the colonial government arbitrary power to expand currency, leading to chronic inflation and purchasing-power erosion that disproportionately devastated poor agrarian labourers.\n\n` +
          `2. **The Ideal Monetary Standard:**\n` +
          `   He advocated for a **pure gold standard with a fixed gold parity**, but with gold kept out of active circulation to stabilize the internal price level: *"The choice is between a currency whose value depends on the discretion of the issuer and a currency whose value depends on natural limitation."*\n\n` +
          `3. **Influence on the Reserve Bank of India (RBI):**\n` +
          `   When the Royal Commission on Indian Currency and Finance (the **Hilton Young Commission**) met in 1925–1926, each member carried a copy of Ambedkar's *The Problem of the Rupee*. His detailed testimony directly shaped the central banking legislative structure that led to the Reserve Bank of India Act, 1934.`,
        timestamp: "2024-09-20T11:01:10Z",
        mode: "standard",
        confidence: "verified",
        sources: [
          {
            documentId: "D3",
            sourceId: "SRC-BAWS-6",
            title: "Dr. Babasaheb Ambedkar: Writings and Speeches, Volume 6",
            page: "Vol. 6: The Problem of the Rupee; Evolution of Provincial Finance",
            excerpt: "Complete text of LSE doctoral treatise on monetary standard and currency inflation.",
            institution: "Dr. Ambedkar Foundation, Ministry of Social Justice and Empowerment",
            priority: 1,
            confidence: "verified",
          },
          {
            sourceId: "SRC-LSE-ARCH",
            title: "London School of Economics and Political Science (LSE) Archives",
            page: "Doctoral Theses Collection, D.Sc. (Econ), 1923",
            excerpt: "Examiners' reports and official deposit of Dr. Ambedkar's thesis.",
            institution: "LSE Library Archives, London, UK",
            priority: 4,
            confidence: "verified",
          },
        ],
      },
    ],
  },
  {
    id: "session-yeola-conversion",
    title: "Yeola Declaration (1935) to Deekshabhoomi: 21-Year Evolution",
    mode: "standard",
    createdAt: "2024-09-18T16:00:00Z",
    updatedAt: "2024-09-18T16:35:00Z",
    tags: ["Religious Philosophy", "Buddhism", "22 Vows", "Nagpur 1956"],
    messages: [
      {
        id: "msg-yeola-1-user",
        role: "user",
        content:
          "Why did Dr. Ambedkar wait 21 years between the Yeola Declaration in 1935 and the conversion to Buddhism in 1956?",
        timestamp: "2024-09-18T16:00:15Z",
        mode: "standard",
      },
      {
        id: "msg-yeola-1-asst",
        role: "assistant",
        content:
          `On **13 October 1935**, at the Yeola Depressed Classes Conference in Nashik District, Dr. Ambedkar made his historic declaration:\n\n` +
          `> *"I had the misfortune of being born with the stigma of an Untouchable... but I will not die a Hindu."*\n\n` +
          `The 21-year period between Yeola (1935) and Deekshabhoomi (14 October 1956) was characterized by profound intellectual, sociological, and constitutional deliberation:\n\n` +
          `1. **Comparative Theological Investigation (1935–1950):**\n` +
          `   Dr. Ambedkar systematically evaluated Islam, Christianity, Sikhism, and Buddhism. He sought a religion grounded in **rational ethics (Prajna), compassion (Karuna), and social equality (Samata)**, free from supernatural revelation or social hierarchy.\n\n` +
          `2. **Constitutional Prioritization (1946–1951):**\n` +
          `   During the late 1940s, his energy was dedicated to drafting the Indian Constitution, securing fundamental civil rights, and fighting for the Hindu Code Bill in Parliament.\n\n` +
          `3. **Reconstructing Navayana Buddhism (1950–1956):**\n` +
          `   In 1950, he published *The Buddha and the Future of His Religion* in the Mahabodhi Society journal. He authored *The Buddha and His Dhamma*, formulating a distinct emancipation framework.\n\n` +
          `4. **The Historic Conversion (14 October 1956):**\n` +
          `   At Deekshabhoomi, Nagpur, Dr. Ambedkar and approximately 500,000 followers converted to Buddhism, taking the **22 Vows** that explicitly renounced caste deities and superstitious rituals.`,
        timestamp: "2024-09-18T16:01:05Z",
        mode: "standard",
        confidence: "verified",
        timeWarning: "Time: Clock time of the Yeola speech is unrecorded in municipal police logs.",
        sources: [
          {
            documentId: "D9",
            sourceId: "SRC-BAWS-17-1",
            title: "Dr. Babasaheb Ambedkar: Writings and Speeches, Volume 17 (Part 1)",
            page: "Part 1, Yeola Conference Proceedings",
            excerpt: "Full text of the Yeola declaration and reaction of national press.",
            institution: "Dr. Ambedkar Foundation, Ministry of Social Justice and Empowerment",
            priority: 1,
            confidence: "verified",
          },
          {
            documentId: "D6",
            sourceId: "SRC-DEEKSHA-1956",
            title: "Deekshabhoomi Memorial Records & 22 Vows",
            page: "Nagpur Deeksha Gazette, 14 October 1956",
            excerpt: "Original Marathi text of 22 Vows administered to 500,000 participants.",
            institution: "Deekshabhoomi Smarak Samiti, Nagpur",
            priority: 5,
            confidence: "verified",
          },
        ],
      },
    ],
  },
];

const LOCAL_STORAGE_KEY = "ambedkar_archive_chat_sessions_v2";

/**
 * Loads chat sessions from localStorage or returns default sample sessions.
 */
export function loadChatSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load chat sessions from localStorage:", e);
  }
  return SAMPLE_CHAT_SESSIONS;
}

/**
 * Persists chat sessions to localStorage.
 */
export function saveChatSessions(sessions: ChatSession[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error("Failed to save chat sessions to localStorage:", e);
  }
}

/**
 * Creates a brand new chat session.
 */
export function createNewChatSession(mode: "standard" | "research" = "standard", initialTitle?: string): ChatSession {
  const timestamp = new Date().toISOString();
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: initialTitle || (mode === "research" ? "New Archival Research Session" : "New Conversation"),
    mode,
    createdAt: timestamp,
    updatedAt: timestamp,
    messages: [],
    tags: mode === "research" ? ["Research Mode", "Grounded RAG"] : ["General Inquiry"],
    researchNotes: [],
    researchParameters: {
      era: "all",
      strictPrimaryOnly: mode === "research",
      synthesisFormat: "synthesis",
      bawsVolumeFilter: "all",
    },
  };
}

/**
 * Loads sessions and ensures a fresh empty active session is ready for the user at start.
 * The sample sessions are preserved in the sidebar history.
 */
export function getInitialChatState(): { sessions: ChatSession[]; activeSessionId: string } {
  const stored = loadChatSessions();
  // Check if there is already an empty session at the beginning
  const firstSession = stored[0];
  if (firstSession && firstSession.messages.length === 0) {
    return { sessions: stored, activeSessionId: firstSession.id };
  }

  // Otherwise, create a fresh empty conversation and place it at the front
  const freshSession = createNewChatSession("standard");
  const allSessions = [freshSession, ...stored];
  saveChatSessions(allSessions);
  return { sessions: allSessions, activeSessionId: freshSession.id };
}


