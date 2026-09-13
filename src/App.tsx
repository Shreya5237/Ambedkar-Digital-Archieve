import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/i18n";

import Layout from "@/components/layout/layout";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import DocumentPage from "@/pages/DocumentPage";
import KnowledgeExplorer from "@/pages/KnowledgeExplorer";
import TimelinePage from "@/pages/TimelinePage";
import AskPage from "@/pages/AskPage";
import { PeopleListPage, PersonDetailPage } from "@/pages/PeoplePage";
import { EventsListPage, EventDetailPage } from "@/pages/EventsPage";
import TopicsPage from "@/pages/TopicsPage";
import NFCPage from "@/pages/NFCPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/documents/:id" element={<DocumentPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/explorer" element={<KnowledgeExplorer />} />
            <Route path="/ask" element={<AskPage />} />
            <Route path="/people" element={<PeopleListPage />} />
            <Route path="/people/:id" element={<PersonDetailPage />} />
            <Route path="/events" element={<EventsListPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/topics" element={<TopicsPage />} />
          </Route>
          {/* NFC route — outside main layout for kiosk use */}
          <Route path="/nfc/:token" element={<NFCPage />} />
          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono text-6xl font-bold text-[var(--muted-foreground)] opacity-30 mb-4">404</div>
                  <h2 className="font-display text-2xl font-semibold mb-2">Page not found</h2>
                  <a href="/" className="text-sm text-[var(--primary)] hover:underline">
                    Return home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
