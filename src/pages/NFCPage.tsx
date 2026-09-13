import { useParams, Link } from "react-router-dom";
import { Nfc, ArrowRight, AlertCircle, FileText, Calendar, Users } from "lucide-react";

// NFC token → archival experience map (would be backend-driven)
const NFC_TOKEN_MAP: Record<
  string,
  { type: "document" | "event" | "person"; id: string; title: string; description: string; route: string }
> = {
  "nfc-001": {
    type: "document",
    id: "doc-annihilation",
    title: "Annihilation of Caste",
    description: "You are standing near a display of Ambedkar's landmark 1936 text. Tap to read the full document.",
    route: "/documents/doc-annihilation",
  },
  "nfc-002": {
    type: "event",
    id: "ev-mahad",
    title: "Mahad Satyagraha, 1927",
    description: "This exhibit marks the site of Ambedkar's first mass civil rights action.",
    route: "/events/ev-mahad",
  },
  "nfc-003": {
    type: "document",
    id: "doc-constitution-speech",
    title: "Constitutional Legacy",
    description: "Explore Ambedkar's final address to the Constituent Assembly.",
    route: "/documents/doc-constitution-speech",
  },
  "nfc-004": {
    type: "event",
    id: "ev-dhamma-diksha",
    title: "Dhamma Diksha, 1956",
    description: "The largest mass religious conversion in history.",
    route: "/events/ev-dhamma-diksha",
  },
};

const TYPE_ICONS = {
  document: FileText,
  event: Calendar,
  person: Users,
};

export default function NFCPage() {
  const { token } = useParams<{ token: string }>();
  const experience = token ? NFC_TOKEN_MAP[token] : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* NFC icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4">
            <Nfc className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            NFC Museum Experience
          </p>
        </div>

        {experience ? (
          <div className="border border-[var(--border)] rounded-sm overflow-hidden bg-[var(--card)]">
            <div className="p-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 mb-3">
                {(() => {
                  const Icon = TYPE_ICONS[experience.type];
                  return <Icon className="w-4 h-4 text-[var(--primary)]" />;
                })()}
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--primary)]">
                  {experience.type}
                </span>
              </div>
              <h1 className="font-display text-2xl font-semibold mb-3">{experience.title}</h1>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{experience.description}</p>
            </div>
            <div className="p-4">
              <Link
                to={experience.route}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-sm text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Open in Archive
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="block text-center mt-3 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Explore full archive
              </Link>
            </div>
          </div>
        ) : (
          <div className="border border-[var(--border)] rounded-sm p-6 text-center bg-[var(--card)]">
            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-[var(--muted-foreground)] opacity-60" />
            <h2 className="font-display text-xl font-semibold mb-2">Token not recognised</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              NFC token <code className="font-mono text-xs bg-[var(--muted)] px-1.5 py-0.5 rounded-sm">{token}</code>{" "}
              does not match any registered archival experience.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-sm text-sm hover:opacity-90 transition-opacity"
            >
              Explore the Archive
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
