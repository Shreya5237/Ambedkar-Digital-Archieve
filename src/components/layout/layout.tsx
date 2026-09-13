import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Sprout, Menu, X, Globe, Archive, ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const NAV_LINKS = [
  { key: "discover", to: "/" },
  { key: "garden", to: "/garden" },
  { key: "timeline", to: "/timeline" },
  { key: "explorer", to: "/knowledge-explorer" },
  { key: "ask", to: "/ask" },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
];

export default function Layout() {
  const { t, i18n } = useTranslation();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-sm bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                <Archive className="w-4 h-4 text-[var(--primary-foreground)]" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-sm font-semibold leading-tight tracking-tight">
                  Ambedkar Archive
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)] tracking-widest uppercase font-mono">
                  Digital Heritage
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ key, to }) => (
                <Link
                  key={key}
                  to={to}
                  className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
                    isActive(to)
                      ? "text-[var(--primary)] font-medium"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {t(`nav.${key}`)}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                to="/garden"
                className="p-2 rounded-sm hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                aria-label="Knowledge Garden"
              >
                <Sprout className="w-4 h-4" />
              </Link>

              {/* Language */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen((o) => !o)}
                  className="p-2 rounded-sm hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1"
                  aria-label="Change language"
                >
                  <Globe className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3" />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg py-1 z-50 min-w-[120px]">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--muted)] transition-colors ${
                          i18n.language === lang.code ? "text-[var(--primary)] font-medium" : "text-[var(--foreground)]"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                className="p-2 rounded-sm hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Mobile menu */}
              <button
                className="lg:hidden p-2 rounded-sm hover:bg-[var(--muted)] transition-colors"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-[var(--border)] bg-[var(--background)]">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ key, to }) => (
                <Link
                  key={key}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 text-sm rounded-sm transition-colors ${
                    isActive(to)
                      ? "text-[var(--primary)] font-medium bg-[var(--muted)]"
                      : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {t(`nav.${key}`)}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-sm bg-[var(--primary)] flex items-center justify-center">
                  <Archive className="w-3.5 h-3.5 text-[var(--primary-foreground)]" />
                </div>
                <span className="font-display font-semibold text-sm">Ambedkar Digital Heritage Archive</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                A digital preservation and research platform dedicated to the life, work, and legacy of Dr. B. R. Ambedkar
                (1891–1956).
              </p>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
                Explore
              </h4>
              <div className="flex flex-col gap-1.5">
                {NAV_LINKS.map(({ key, to }) => (
                  <Link key={key} to={to} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                    {t(`nav.${key}`)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
                About
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                All archival materials are sourced from recognised institutions. Rights and provenance are documented for each
                item. This platform is for research and educational use.
              </p>
            </div>
          </div>
          <div className="rule mt-8 pt-6 flex items-center justify-between">
            <span className="text-xs text-[var(--muted-foreground)] font-mono">
              © 2024 Ambedkar Digital Heritage Archive
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              Jai Bhim
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
