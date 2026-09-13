import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tag, ArrowRight } from "lucide-react";
import { getAllTopics } from "@/services/api";

export default function TopicsPage() {
  const { data: topics, isLoading } = useQuery({ queryKey: ["topics"], queryFn: getAllTopics });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Tag className="w-5 h-5 text-[var(--primary)]" />
          <h1 className="font-display text-3xl font-semibold">Topics</h1>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">Thematic categories across the archival record</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-[var(--muted)] rounded-sm" />)}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics?.map((topic) => (
          <Link
            key={topic.id}
            to={`/search?topic=${topic.id}`}
            className="group border border-[var(--border)] rounded-sm p-5 hover:border-[var(--primary)]/50 hover:bg-[var(--card)] transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: topic.color + "20", color: topic.color }}
              >
                <Tag className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
            </div>
            <h3 className="font-display font-semibold mt-3 mb-1 group-hover:text-[var(--primary)] transition-colors">
              {topic.label}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-3">{topic.description}</p>
            <div className="flex items-center gap-2">
              <div
                className="h-1 flex-1 rounded-full opacity-30"
                style={{ backgroundColor: topic.color }}
              />
              <span className="text-xs text-[var(--muted-foreground)] font-mono">{topic.documentCount} docs</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
