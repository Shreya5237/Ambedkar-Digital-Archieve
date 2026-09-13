import type { ArchiveFile, FileType, ExtractedContent, UnifiedAttributes, ExtractedRelationship } from "@/types/institution";

// File specific extraction templates for when exact filenames are uploaded
export const FILE_SPECIFIC_EXTRACTION_MAP: Record<string, { title: string; extractedContent: ExtractedContent; attributes: UnifiedAttributes; relationships: ExtractedRelationship[] }> = {
  "Volume17_Part_I.pdf": {
    title: "Dr. B.R. Ambedkar and His Egalitarian Revolution (Vol 17)",
    extractedContent: {
      title: "Dr. B.R. Ambedkar and His Egalitarian Revolution",
      text: "DR. BABASAHEB AMBEDKAR WRITINGS AND SPEECHES Volume No. : 17 PART ONE DR. B.R. AMBEDKAR AND HIS EGALITARIAN REVOLUTION Edited by HARI NARAKE DR. M. L. KASARE N. G. KAMBLE ASHOK GODGHATE.",
      language: "English",
      summary: "Volume 17 covers Dr. Ambedkar's egalitarian revolution, edited by Hari Narake and others.",
      pageCount: 650,
    },
    attributes: {
      persons: ["B. R. Ambedkar", "Hari Narake", "Dr. M. L. Kasare"],
      documents: ["Writings and Speeches Volume 17"],
      events: ["Egalitarian Revolution"],
      places: ["New Delhi"],
      dates: ["2019"],
      topics: ["Social Justice", "Egalitarianism"],
      publications: ["Dr. Ambedkar Foundation"],
    },
    relationships: [
      { source: "Dr. Ambedkar Foundation", relation: "published", target: "Writings and Speeches Volume 17" }
    ],
  },
  "VolumeH40.pdf": {
    title: "Dr. Ambedkar: Articles and Statements (Vol 40 Hindi)",
    extractedContent: {
      title: "डॉ. भीमराव अम्बेडकर : लेख तथा वक्तव्य (वर्ष 1946-1956)",
      text: "डॉ. भीमराव अम्बेडकर : लेख तथा वक्तव्य (वर्ष 1946-1956) भाग-3. डॉ. अम्बेडकर प्रतिष्ठान द्वारा प्रकाशित।",
      translatedText: "Dr. Bhimrao Ambedkar: Articles and Statements (Year 1946-1956) Part-3. Published by Dr. Ambedkar Foundation.",
      language: "Hindi",
      summary: "Hindi translation of Volume 40 covering articles and statements by Dr. Ambedkar from 1946 to 1956.",
      pageCount: 420,
    },
    attributes: {
      persons: ["B. R. Ambedkar"],
      documents: ["खंड 40"],
      events: ["Articles and Statements Compilation"],
      places: ["New Delhi"],
      dates: ["2019"],
      topics: ["Speeches", "Statements"],
      publications: ["Dr. Ambedkar Foundation"],
    },
    relationships: [
      { source: "Dr. Ambedkar Foundation", relation: "published", target: "खंड 40" }
    ],
  }
};

// Predefined extraction templates for each supported format
export const PREDEFINED_EXTRACTION_MAP: Record<
  FileType,
  {
    title: string;
    extractedContent: ExtractedContent;
    attributes: UnifiedAttributes;
    relationships: ExtractedRelationship[];
  }
> = {
  PDF: {
    title: "Dr. Babasaheb Ambedkar Writings and Speeches - Volume 1",
    extractedContent: {
      title: "Dr. Babasaheb Ambedkar Writings and Speeches - Volumes",
      text: "DR. BABASAHEB AMBEDKAR WRITINGS AND SPEECHES Volume No. : 1 Compiled by Vasant Moon. And Volume No. : 17 PART ONE DR. B.R. AMBEDKAR AND HIS EGALITARIAN REVOLUTION Edited by HARI NARAKE DR. M. L. KASARE N. G. KAMBLE ASHOK GODGHATE. Hindi translations (खंड 1) cover Castes in India, Annihilation of Caste, etc.",
      language: "English, Hindi",
      summary: "Extracted volumes from Dr. Ambedkar's comprehensive writings, speeches, and egalitarian revolution, covering both English and Hindi translations.",
      pageCount: 1400,
    },
    attributes: {
      persons: ["B. R. Ambedkar", "Vasant Moon", "Hari Narake", "Dr. M. L. Kasare"],
      documents: ["Writings and Speeches Volume 1", "Writings and Speeches Volume 17", "खंड 1", "खंड 40"],
      events: ["Compilation of Writings and Speeches", "Egalitarian Revolution"],
      places: ["New Delhi"],
      dates: ["14 April 1979", "1993", "2019"],
      topics: ["Social Justice", "Egalitarianism", "Castes in India", "Annihilation of Caste", "Linguistic States"],
      publications: ["Dr. Ambedkar Foundation", "Ministry of Social Justice & Empowerment"],
    },
    relationships: [
      { source: "Vasant Moon", relation: "compiled", target: "Writings and Speeches Volume 1" },
      { source: "Dr. Ambedkar Foundation", relation: "published", target: "Writings and Speeches Volume 17" },
      { source: "B. R. Ambedkar", relation: "wrote", target: "Annihilation of Caste" },
    ],
  },

  DOCX: {
    title: "Constitutional Assembly Debate Transcript - Fundamental Rights (1948)",
    extractedContent: {
      title: "Constitutional Assembly Debate Transcript - Fundamental Rights",
      text: "Article 11 [now Article 17]: 'Untouchability' is abolished and its practice in any form is forbidden. Dr. Ambedkar: 'The purpose of this article is to liberate millions of citizens from historical oppression and ensure legal equality under Article 14.'",
      language: "English",
      summary: "Official transcript of the Constituent Assembly debate regarding Article 17 (Abolition of Untouchability) and Article 32 (Constitutional Remedies).",
      pageCount: 8,
    },
    attributes: {
      persons: ["B. R. Ambedkar", "K. M. Munshi", "Alladi Krishnaswami Ayyar"],
      documents: ["Draft Constitution of India", "Article 17", "Article 32"],
      events: ["Draft Constitution Clause-by-Clause Debate"],
      places: ["New Delhi", "Parliament House"],
      dates: ["29 November 1948"],
      topics: ["Fundamental Rights", "Abolition of Untouchability", "Constitutional Remedies"],
      publications: ["Drafting Committee Minutes"],
    },
    relationships: [
      { source: "B. R. Ambedkar", relation: "drafted", target: "Draft Constitution of India" },
      { source: "Draft Constitution Clause-by-Clause Debate", relation: "debated", target: "Article 17" },
      { source: "Article 17", relation: "abolishes", target: "Abolition of Untouchability" },
    ],
  },

  IMAGE: {
    title: "Mahad Satyagraha Water Tank Historic Assembly Photograph (1927)",
    extractedContent: {
      title: "Mahad Satyagraha Water Tank Historic Assembly Photograph",
      text: "OCR Text Detected: 'MAHAD WATER TANK MARCH - 20 MARCH 1927. DR. B. R. AMBEDKAR LEADING CITIZENS TO CHAVDAR TALE FOR EQUAL WATER ACCESS.'",
      visualInfo: "Black-and-white archival photograph showing Dr. B. R. Ambedkar walking alongside thousands of satyagrahis toward the Chavdar Tale public water tank in Mahad.",
      language: "English / Marathi",
      summary: "Visual documentation of the historic Mahad Satyagraha asserting civil rights to public water sources.",
      resolution: "3400 x 2200 px (300 DPI Archival Scan)",
    },
    attributes: {
      persons: ["B. R. Ambedkar", "Anant Vinayak Chitre", "Bapu Sahasrabuddhe"],
      documents: ["Mahad Satyagraha Resolution"],
      events: ["Mahad Satyagraha", "Chavdar Tale March"],
      places: ["Mahad", "Raigad", "Maharashtra"],
      dates: ["20 March 1927"],
      topics: ["Civil Rights", "Public Water Access", "Social Revolution", "Human Dignity"],
      publications: ["Bahishkrit Bharat"],
    },
    relationships: [
      { source: "B. R. Ambedkar", relation: "led", target: "Mahad Satyagraha" },
      { source: "Mahad Satyagraha", relation: "occurred_at", target: "Mahad" },
      { source: "Mahad Satyagraha", relation: "promoted", target: "Civil Rights" },
    ],
  },

  AUDIO: {
    title: "BBC Radio Broadcast Audio Address on Democracy in India (1956)",
    extractedContent: {
      title: "BBC Radio Broadcast Audio Address on Democracy in India",
      text: "Audio Transcript (00:00 - 05:40): 'Democracy in India is only a top-dressing on an Indian soil which is essentially undemocratic. To preserve democracy we must hold fast to constitutional methods of achieving our social and economic objectives...'",
      audioInfo: "Mono archival voice recording (BBC World Service Master Tape Restoration). Clear acoustic clarity with background tape hiss.",
      language: "English",
      summary: "Radio broadcast recording featuring Dr. B. R. Ambedkar discussing the future of parliamentary democracy and social reform in independent India.",
      duration: "05 min 42 sec",
    },
    attributes: {
      persons: ["B. R. Ambedkar"],
      documents: ["BBC Broadcast Transcript"],
      events: ["BBC World Service Address"],
      places: ["London", "New Delhi"],
      dates: ["May 1956"],
      topics: ["Parliamentary Democracy", "Social Reform", "Constitutionalism"],
      publications: ["BBC Archival Sound Records"],
    },
    relationships: [
      { source: "B. R. Ambedkar", relation: "broadcasted", target: "BBC World Service Address" },
      { source: "BBC World Service Address", relation: "analyzed", target: "Parliamentary Democracy" },
    ],
  },

  VIDEO: {
    title: "Historical Newsreel Footage of Deekshabhoomi Conversion Ceremony (1956)",
    extractedContent: {
      title: "Historical Newsreel Footage of Deekshabhoomi Conversion Ceremony",
      text: "Combined Audio/Visual Transcript: 'Nagpur, October 14, 1956. Dr. B. R. Ambedkar along with Dr. Savita Ambedkar and over 500,000 followers took the 22 vows, initiating the historic Buddhist revival movement in modern India.'",
      visualInfo: "16mm black and white newsreel video capturing the massive gathering at Deekshabhoomi, Nagpur. High visual fidelity showing ceremonial rituals and assembly.",
      audioInfo: "Synchronized original audio chant recordings and announcer voiceover.",
      language: "Marathi / English",
      summary: "Rare newsreel video documentation of the landmark mass conversion ceremony in Nagpur, 1956.",
      duration: "12 min 15 sec",
      resolution: "1080p Digitized Archival Video",
    },
    attributes: {
      persons: ["B. R. Ambedkar", "Savita Ambedkar", "Mahasthavir Chandramani"],
      documents: ["22 Buddhist Vows"],
      events: ["Deekshabhoomi Mass Conversion Ceremony"],
      places: ["Deekshabhoomi", "Nagpur", "Maharashtra"],
      dates: ["14 October 1956"],
      topics: ["Navayana Buddhism", "Social Emancipation", "Cultural Revival"],
      publications: ["Films Division Archive Reel #402"],
    },
    relationships: [
      { source: "B. R. Ambedkar", relation: "administered", target: "22 Buddhist Vows" },
      { source: "Deekshabhoomi Mass Conversion Ceremony", relation: "held_at", target: "Nagpur" },
      { source: "22 Buddhist Vows", relation: "founded", target: "Navayana Buddhism" },
    ],
  },
};

// Initial institutional files log for Upload History & Archive views
export const INITIAL_INSTITUTION_FILES: ArchiveFile[] = [
  {
    id: "FILE001",
    filename: "ambedkar_speech_1946.pdf",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadDate: "2026-09-12",
    category: "Speech",
    sourceInstitution: "Dr. Ambedkar International Centre",
    languages: ["English", "Hindi"],
    processingStatus: "completed",
    vectorStatus: "updated",
    extractedContent: PREDEFINED_EXTRACTION_MAP.PDF.extractedContent,
    attributes: PREDEFINED_EXTRACTION_MAP.PDF.attributes,
    relationships: PREDEFINED_EXTRACTION_MAP.PDF.relationships,
  },
  {
    id: "FILE002",
    filename: "constitutional_debate.docx",
    fileType: "DOCX",
    fileSize: "1.1 MB",
    uploadDate: "2026-09-12",
    category: "Constitutional Debate",
    sourceInstitution: "Parliamentary Archives",
    languages: ["English"],
    processingStatus: "completed",
    vectorStatus: "not_updated", // Pending update so user can test vector DB update button in history!
    extractedContent: PREDEFINED_EXTRACTION_MAP.DOCX.extractedContent,
    attributes: PREDEFINED_EXTRACTION_MAP.DOCX.attributes,
    relationships: PREDEFINED_EXTRACTION_MAP.DOCX.relationships,
  },
  {
    id: "FILE003",
    filename: "ambedkar_photo_1930.jpg",
    fileType: "IMAGE",
    fileSize: "4.8 MB",
    uploadDate: "2026-09-11",
    category: "Photograph",
    sourceInstitution: "National Archives of India",
    languages: ["English", "Marathi"],
    processingStatus: "completed",
    vectorStatus: "updated",
    extractedContent: PREDEFINED_EXTRACTION_MAP.IMAGE.extractedContent,
    attributes: PREDEFINED_EXTRACTION_MAP.IMAGE.attributes,
    relationships: PREDEFINED_EXTRACTION_MAP.IMAGE.relationships,
  },
  {
    id: "FILE004",
    filename: "speech_recording_1956.mp3",
    fileType: "AUDIO",
    fileSize: "12.3 MB",
    uploadDate: "2026-09-10",
    category: "Speech",
    sourceInstitution: "BBC World Service Sound Archive",
    languages: ["English"],
    processingStatus: "completed",
    vectorStatus: "not_updated", // Pending update
    extractedContent: PREDEFINED_EXTRACTION_MAP.AUDIO.extractedContent,
    attributes: PREDEFINED_EXTRACTION_MAP.AUDIO.attributes,
    relationships: PREDEFINED_EXTRACTION_MAP.AUDIO.relationships,
  },
  {
    id: "FILE005",
    filename: "public_event_1956.mp4",
    fileType: "VIDEO",
    fileSize: "84.5 MB",
    uploadDate: "2026-09-09",
    category: "Event",
    sourceInstitution: "Films Division India Archive",
    languages: ["Marathi", "English"],
    processingStatus: "completed",
    vectorStatus: "updated",
    extractedContent: PREDEFINED_EXTRACTION_MAP.VIDEO.extractedContent,
    attributes: PREDEFINED_EXTRACTION_MAP.VIDEO.attributes,
    relationships: PREDEFINED_EXTRACTION_MAP.VIDEO.relationships,
  },
];
