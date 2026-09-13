import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Users, FileText, ArrowRight, Calendar } from "lucide-react";
import { getAllPeople, getPerson, getFeaturedDocuments } from "@/services/api";

export function PeopleListPage() {
  const { data: people, isLoading } = useQuery({ queryKey: ["people"], queryFn: getAllPeople });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-5 h-5 text-[var(--primary)]" />
          <h1 className="font-display text-3xl font-semibold">People</h1>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          Historical figures documented in the archival record
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-[var(--muted)] rounded-sm" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {people?.map((person) => (
          <Link
            key={person.id}
            to={`/people/${person.id}`}
            className="group border border-[var(--border)] rounded-sm p-5 hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-14 h-14 rounded-sm object-cover bg-[var(--muted)] flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-sm bg-[var(--muted)] flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[var(--muted-foreground)]" />
                </div>
              )}
              <div>
                <h3 className="font-display font-semibold leading-snug group-hover:text-[var(--primary)] transition-colors">
                  {person.name}
                </h3>
                {person.born && (
                  <p className="text-xs text-[var(--muted-foreground)] font-mono mt-0.5">
                    {person.born.slice(0, 4)}
                    {person.died ? `–${person.died.slice(0, 4)}` : "–present"}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed mb-3">
              {person.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {person.roles.slice(0, 2).map((role) => (
                  <span
                    key={role}
                    className="text-[10px] bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>
              <span className="text-xs text-[var(--muted-foreground)]">{person.documentCount} docs</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: person, isLoading } = useQuery({
    queryKey: ["person", id],
    queryFn: () => getPerson(id!),
    enabled: !!id,
  });
  const { data: docs } = useQuery({ queryKey: ["featured-documents"], queryFn: getFeaturedDocuments });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-8 bg-[var(--muted)] rounded w-1/3" />
        <div className="h-4 bg-[var(--muted)] rounded w-1/2" />
        <div className="h-32 bg-[var(--muted)] rounded" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Users className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)] opacity-50" />
        <h2 className="font-display text-2xl font-semibold">Person not found</h2>
      </div>
    );
  }

  const relatedDocs = docs?.filter((d) => d.personIds.includes(person.id)) ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-start gap-6 mb-8 pb-8 border-b border-[var(--border)]">
        {person.image && (
          <img
            src={person.image}
            alt={person.name}
            className="w-24 h-24 rounded-sm object-cover bg-[var(--muted)] flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h1 className="font-display text-3xl font-semibold mb-1">{person.name}</h1>
          {person.born && (
            <p className="font-mono text-sm text-[var(--muted-foreground)] mb-3">
              {person.born} — {person.died ?? "present"}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mb-4">
            {person.roles.map((role) => (
              <span
                key={role}
                className="text-xs bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] px-2 py-1 rounded-sm"
              >
                {role}
              </span>
            ))}
          </div>
          <p className="text-[var(--foreground)] leading-relaxed">{person.description}</p>
        </div>
      </div>

      {relatedDocs.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--primary)]" />
            Documents in the Archive
          </h2>
          <div className="space-y-3">
            {relatedDocs.map((doc) => (
              <Link
                key={doc.id}
                to={`/documents/${doc.id}`}
                className="group flex gap-4 border border-[var(--border)] rounded-sm p-4 hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded-sm">
                      {doc.contentType.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] font-mono">{doc.year}</span>
                  </div>
                  <h3 className="font-display font-semibold text-sm group-hover:text-[var(--primary)] transition-colors">
                    {doc.title}
                  </h3>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] self-center opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
