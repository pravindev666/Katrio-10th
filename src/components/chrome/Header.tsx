import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useProgress } from '../../features/local-progress/ProgressContext';
import { LearningSettingsModal } from '../accessibility/AccessibilityBar';

export function Header() {
  const location = useLocation();
  const { preferences, record } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navItems = [
    { label: 'Explore', to: '/class-10' },
    { label: 'Subjects', to: '/class-10/science' },
    { label: 'Games & practice', to: '/arcade' },
    { label: 'For teachers', to: '/teachers' },
  ];

  const isActive = (path: string) => {
    if (path === '/class-10' && location.pathname === '/class-10') return true;
    if (path === '/class-10/science' && location.pathname.startsWith('/class-10/')) return true;
    if (path !== '/class-10' && path !== '/class-10/science' && location.pathname.startsWith(path))
      return true;
    return false;
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[var(--primary)] focus:text-white focus:rounded-xl focus:font-semibold"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-sm border-b border-[var(--line)]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              className="text-xl font-extrabold tracking-tight text-[var(--ink)] whitespace-nowrap min-h-[44px] inline-flex items-center gap-2"
            >
              <span className="w-7 h-7 rounded-lg bg-[var(--primary)] text-white text-sm font-extrabold inline-flex items-center justify-center">
                K
              </span>
              <span>Katrio</span>
            </Link>
            <span className="hidden lg:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--surface-subtle)] text-[var(--text-muted)] border border-[var(--line)]">
              Class 10 · TN State Board
            </span>
          </div>

          {/* Primary Desktop Navigation */}
          {!preferences.focusMode && (
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[var(--text)]"
            >
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`py-2 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                    isActive(item.to)
                      ? 'border-[var(--primary)] text-[var(--ink)] font-bold'
                      : 'border-transparent hover:text-[var(--ink)] hover:border-[var(--line)]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Contextual Actions & Learning Settings */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Mobile quick Explore link */}
            <Link
              to="/class-10"
              className="md:hidden px-3 py-2 min-h-[44px] inline-flex items-center justify-center text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-subtle)] rounded-[12px]"
            >
              Explore
            </Link>

            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              className="px-3 sm:px-3.5 py-2 min-h-[44px] inline-flex items-center gap-2 rounded-[12px] border border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--primary)] text-sm font-semibold text-[var(--ink)] transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-[var(--primary)] shrink-0" />
              <span className="hidden sm:inline">Learning settings</span>
              <span className="sm:hidden">Settings</span>
            </button>

            {record.lastVisitedRoute && location.pathname === '/' ? (
              <Link
                to={record.lastVisitedRoute}
                className="hidden sm:inline-flex px-4 py-2.5 min-h-[44px] items-center justify-center gap-1.5 text-sm font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] rounded-[12px] transition-colors whitespace-nowrap"
              >
                <span>Continue learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/class-10"
                className="hidden sm:inline-flex px-4 py-2.5 min-h-[44px] items-center justify-center text-sm font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] rounded-[12px] transition-colors whitespace-nowrap"
              >
                Explore Class 10
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-[12px] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--surface-subtle)]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="md:hidden border-t border-[var(--line)] bg-[var(--surface)] px-4 py-4 space-y-1.5 shadow-lg"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[44px] px-3.5 py-2.5 rounded-xl text-base font-semibold text-[var(--ink)] hover:bg-[var(--surface-subtle)]"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[var(--line)] flex flex-col gap-2">
              {record.lastVisitedRoute && (
                <Link
                  to={record.lastVisitedRoute}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[var(--primary-tint)] text-[var(--primary)] font-bold text-sm"
                >
                  <span>Continue where you left off</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link
                to="/accessibility"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--ink)]"
              >
                Accessibility &amp; display options
              </Link>
              <Link
                to="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--ink)]"
              >
                Saved progress &amp; privacy
              </Link>
            </div>
          </nav>
        )}
      </header>

      <LearningSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
