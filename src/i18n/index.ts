import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        discover: "Discover",
        search: "Search",
        timeline: "Timeline",
        explorer: "Knowledge Explorer",
        ask: "Ask the Archive",
        documents: "Documents",
        people: "People",
        events: "Events",
        topics: "Topics",
      },
      home: {
        hero_title: "The Ambedkar Digital Heritage Archive",
        hero_subtitle:
          "A living repository of speeches, documents, letters, and records spanning the life and legacy of Dr. B. R. Ambedkar — jurist, economist, social reformer, and architect of the Indian Constitution.",
        search_placeholder: "Search documents, speeches, events, people…",
        ask_placeholder: "Ask the Archive a question…",
        featured_events: "Featured Historical Events",
        explore_title: "Explore the Archive",
        explore_documents: "Documents",
        explore_people: "People",
        explore_events: "Events",
        explore_topics: "Topics",
        explore_places: "Places",
      },
      search: {
        title: "Search the Archive",
        results_for: "Results for",
        no_results: "No results found",
        filters: "Filters",
        all_types: "All types",
        all_languages: "All languages",
      },
      document: {
        transcript: "Transcript",
        metadata: "Metadata",
        provenance: "Provenance",
        source: "Source",
        pages: "Pages",
        zoom_in: "Zoom in",
        zoom_out: "Zoom out",
        page: "Page",
        of: "of",
        citation: "Cite this document",
      },
      timeline: {
        title: "Historical Timeline",
        subtitle: "A chronological journey through Ambedkar's life, work, and legacy",
      },
      ask: {
        title: "Ask the Archive",
        subtitle: "Evidence-grounded answers from the archival record",
        placeholder: "Ask about a document, event, speech, or period…",
        send: "Send",
        high_confidence: "High archival confidence",
        medium_confidence: "Medium archival confidence",
        insufficient: "Insufficient archival evidence",
        source_from: "Source from archive",
        disclaimer:
          "Responses are grounded in the archival record. Where evidence is insufficient, this is explicitly stated.",
      },
      common: {
        view_all: "View all",
        learn_more: "Learn more",
        read_document: "Read document",
        back: "Back",
        loading: "Loading…",
        error: "Something went wrong",
        close: "Close",
        open: "Open",
      },
    },
  },
  hi: {
    translation: {
      nav: {
        discover: "खोजें",
        search: "खोज",
        timeline: "समयरेखा",
        explorer: "ज्ञान अन्वेषक",
        ask: "पुरालेख से पूछें",
        documents: "दस्तावेज़",
        people: "लोग",
        events: "घटनाएँ",
        topics: "विषय",
      },
      home: {
        hero_title: "अम्बेडकर डिजिटल विरासत पुरालेख",
        hero_subtitle:
          "डॉ. बी. आर. अम्बेडकर के जीवन और विरासत से जुड़े भाषणों, दस्तावेज़ों, पत्रों और अभिलेखों का एक जीवंत संग्रह।",
        search_placeholder: "दस्तावेज़, भाषण, घटनाएँ, लोग खोजें…",
      },
      common: {
        view_all: "सभी देखें",
        learn_more: "अधिक जानें",
        read_document: "दस्तावेज़ पढ़ें",
        back: "वापस",
        loading: "लोड हो रहा है…",
        error: "कुछ गड़बड़ हुई",
        close: "बंद करें",
        open: "खोलें",
      },
    },
  },
  mr: {
    translation: {
      nav: {
        discover: "शोधा",
        search: "शोध",
        timeline: "कालरेखा",
        explorer: "ज्ञान अन्वेषक",
        ask: "पुरालेखाला विचारा",
        documents: "कागदपत्रे",
        people: "लोक",
        events: "घटना",
        topics: "विषय",
      },
      home: {
        hero_title: "आंबेडकर डिजिटल वारसा पुरालेख",
        hero_subtitle: "डॉ. बी. आर. आंबेडकर यांच्या जीवन आणि वारशाशी संबंधित भाषणे, कागदपत्रे, पत्रे यांचा संग्रह.",
        search_placeholder: "कागदपत्रे, भाषणे, घटना, लोक शोधा…",
      },
      common: {
        view_all: "सर्व पहा",
        learn_more: "अधिक जाणून घ्या",
        read_document: "कागदपत्र वाचा",
        back: "मागे",
        loading: "लोड होत आहे…",
        error: "काहीतरी चुकले",
        close: "बंद करा",
        open: "उघडा",
      },
    },
  },
  ta: {
    translation: {
      nav: {
        discover: "கண்டறியுங்கள்",
        search: "தேடல்",
        timeline: "காலக்கோடு",
        explorer: "அறிவு ஆய்வாளர்",
        ask: "ஆவணகத்திடம் கேளுங்கள்",
        documents: "ஆவணங்கள்",
        people: "நபர்கள்",
        events: "நிகழ்வுகள்",
        topics: "தலைப்புகள்",
      },
      home: {
        hero_title: "அம்பேத்கர் டிஜிட்டல் பாரம்பரிய காப்பகம்",
        hero_subtitle:
          "டாக்டர் பி. ஆர். அம்பேத்கரின் வாழ்க்கை மற்றும் பாரம்பரியம் தொடர்பான உரைகள், ஆவணங்கள், கடிதங்கள் மற்றும் பதிவுகளின் தொகுப்பு.",
        search_placeholder: "ஆவணங்கள், உரைகள், நிகழ்வுகள், நபர்களைத் தேடுங்கள்…",
      },
      common: {
        view_all: "அனைத்தையும் காண்க",
        learn_more: "மேலும் அறிக",
        read_document: "ஆவணத்தைப் படிக்கவும்",
        back: "பின்",
        loading: "ஏற்றுகிறது…",
        error: "ஏதோ தவறு நடந்தது",
        close: "மூடு",
        open: "திற",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
