import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../../features/local-progress/ProgressContext';

export function Footer() {
  const { preferences } = useProgress();

  if (preferences.focusMode) {
    return (
      <footer className="border-t border-[var(--line)] bg-[var(--surface)] py-5 px-4 text-center text-sm text-[var(--text-muted)]">
        <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <span>Katrio · Focus view active · Progress saved on this device only</span>
          <Link to="/accessibility" className="underline hover:text-[var(--ink)] font-medium">
            Display &amp; accessibility settings
          </Link>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)] mt-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[var(--line)]">
          <div className="md:col-span-2 space-y-3">
            <Link
              to="/"
              className="text-lg font-extrabold text-[var(--ink)] tracking-tight inline-flex items-center gap-2"
            >
              <span className="w-6 h-6 rounded-md bg-[var(--primary)] text-white text-xs font-extrabold inline-flex items-center justify-center">
                K
              </span>
              <span>Katrio</span>
            </Link>
            <p className="text-base text-[var(--text)] max-w-md leading-relaxed">
              Learn by seeing. Understand by doing. Don&apos;t just read the lesson — step inside it
              with free, no-login interactive visual learning for Tamil Nadu Class 10.
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-md">
              Independent educational resource aligned with the Tamil Nadu State Board Class 10
              syllabus. Not an official government website.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-extrabold text-[var(--ink)]">Class 10 Subjects</h2>
            <ul className="space-y-2.5 text-sm text-[var(--text)]">
              <li>
                <Link to="/class-10/science" className="hover:text-[var(--ink)] hover:underline">
                  Science
                </Link>
              </li>
              <li>
                <Link to="/class-10/mathematics" className="hover:text-[var(--ink)] hover:underline">
                  Mathematics
                </Link>
              </li>
              <li>
                <Link to="/class-10/english" className="hover:text-[var(--ink)] hover:underline">
                  English
                </Link>
              </li>
              <li>
                <Link
                  to="/class-10/tamil"
                  className="hover:text-[var(--ink)] hover:underline font-tamil"
                  lang="ta"
                >
                  தமிழ் (Tamil)
                </Link>
              </li>
              <li>
                <Link
                  to="/class-10/social_science"
                  className="hover:text-[var(--ink)] hover:underline"
                >
                  Social Science (History, Geography, Civics, Economics)
                </Link>
              </li>
              <li>
                <Link to="/arcade" className="hover:text-[var(--ink)] hover:underline font-medium">
                  Games &amp; Practice Arcade
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-extrabold text-[var(--ink)]">About &amp; Support</h2>
            <ul className="space-y-2.5 text-sm text-[var(--text)]">
              <li>
                <Link to="/teachers" className="hover:text-[var(--ink)] hover:underline">
                  For Teachers &amp; Classrooms
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-[var(--ink)] hover:underline">
                  Accessibility &amp; Learning Settings
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[var(--ink)] hover:underline">
                  Privacy &amp; Saved Progress
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[var(--ink)] hover:underline">
                  About &amp; Curriculum Sources
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-[var(--ink)] hover:underline">
                  Editorial Status &amp; Roadmap
                </Link>
              </li>
              <li>
                <Link to="/flashcards" className="hover:text-[var(--ink)] hover:underline">
                  Flashcards
                </Link>
                <span aria-hidden="true"> · </span>
                <Link to="/quizzes" className="hover:text-[var(--ink)] hover:underline">
                  Quizzes
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>
            © 2026 Katrio. Free to explore, no login required, study progress saved on your device
            only.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/about" className="underline hover:text-[var(--ink)]">
              Curriculum &amp; Source Audit
            </Link>
            <span aria-hidden="true">·</span>
            <a href="/sitemap.xml" className="underline hover:text-[var(--ink)]">
              Sitemap XML
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
