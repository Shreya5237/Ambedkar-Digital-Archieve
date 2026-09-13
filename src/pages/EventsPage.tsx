import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, FileText, ArrowRight, MapPin, Users } from "lucide-react";
import { getFeaturedEvents, getEvent } from "@/services/api";

export function EventsListPage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getFeaturedEvents,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-5 h-5 text-[var(--primary)]" />
          <h1 className="font-display text-3xl font-semibold">Historical Events</h1>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          Key events documented across the archival record
        </p>
      </div>

      {isLoading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-[var(--muted)] rounded-sm" />)}
        </div>
      )}

      <div className="space-y-4">
        {events?.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="group flex gap-4 border border-[var(--border)] rounded-sm p-5 hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all"
          >
            {event.image && (
              <div className="w-24 h-24 flex-shrink-0 rounded-sm overflow-hidden bg-[var(--muted)]">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-[var(--primary)] mb-1">{event.date}</p>
              <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors">
                {event.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed mb-2">
                {event.description}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-[var(--muted-foreground)]">
                {event.places.length > 0 && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.places[0]}
                  </span>
                )}
                {event.people.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.people.length} people
                  </span>
                )}
                {event.documents.length > 0 && (
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {event.documents.length} documents
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] self-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-8 bg-[var(--muted)] rounded w-1/3" />
        <div className="h-48 bg-[var(--muted)] rounded" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)] opacity-50" />
        <h2 className="font-display text-2xl font-semibold">Event not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-sm text-[var(--primary)] mb-2">{event.date}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4 leading-tight">{event.title}</h1>

        {event.image && (
          <div className="w-full h-56 rounded-sm overflow-hidden bg-[var(--muted)] mb-6">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <p className="text-[var(--foreground)] leading-relaxed text-base mb-4">{event.description}</p>

        {/* Significance */}
        <div className="p-4 bg-[var(--muted)] border-l-2 border-[var(--primary)] rounded-sm">
          <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-1">
            Historical significance
          </p>
          <p className="text-sm leading-relaxed text-[var(--foreground)]">{event.significance}</p>
        </div>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pb-8 border-b border-[var(--border)]">
        {event.places.length > 0 && (
          <div className="border border-[var(--border)] rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
                Places
              </span>
            </div>
            <div className="space-y-1">
              {event.places.map((place) => (
                <p key={place} className="text-sm">{place}</p>
              ))}
            </div>
          </div>
        )}
        {event.people.length > 0 && (
          <div className="border border-[var(--border)] rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
                People
              </span>
            </div>
            <div className="space-y-1">
              {event.people.map((person, i) => (
                <Link key={person} to={`/people/${event.people[i]}`} className="block text-sm text-[var(--primary)] hover:underline">
                  {person}
                </Link>
              ))}
            </div>
          </div>
        )}
        {event.topics.length > 0 && (
          <div className="border border-[var(--border)] rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
                Topics
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {event.topics.map((topic, i) => (
                <Link key={topic} to={`/search?topic=${event.topics[i]}`} className="text-xs bg-[var(--muted)] px-2 py-1 rounded-sm hover:bg-[var(--secondary)] transition-colors">
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related documents */}
      {event.documents.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--primary)]" />
            Related Documents
          </h2>
          <div className="space-y-3">
            {event.documents.map((docId) => (
              <Link
                key={docId}
                to={`/documents/${docId}`}
                className="group flex items-center gap-3 border border-[var(--border)] rounded-sm p-4 hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all"
              >
                <FileText className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                <span className="flex-1 text-sm font-medium group-hover:text-[var(--primary)] transition-colors">
                  {docId.replace("doc-", "").replace(/-/g, " ")}
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
