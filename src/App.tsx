/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProgressProvider } from './features/local-progress/ProgressContext';
import { Header } from './components/chrome/Header';
import { AccessibilityBar } from './components/accessibility/AccessibilityBar';
import { Footer } from './components/chrome/Footer';
import { LandingPage } from './routes/LandingPage';
import { Class10HubPage } from './routes/Class10HubPage';
import { SubjectPage } from './routes/SubjectPage';
import { UnitPage } from './routes/UnitPage';
import { SectionPlayerPage } from './routes/SectionPlayerPage';
import {
  ArcadePage,
  FlashcardsPage,
  QuizzesPage,
  TeachersPage,
  AccessibilityPage,
  PrivacyPage,
  AboutPage,
  RoadmapPage,
} from './routes/PlatformPages';
import { SustainableTnTownMission } from './components/arcade/SustainableTnTownMission';
import { NotFoundPage } from './routes/NotFoundPage';
import { getSubjectBySlug, getUnitById, getSectionById } from './utils/curriculumStore';

function RouteMetadataAndScrollUpdater() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Move focus to main content heading or container on route navigation for keyboard/screen-reader users
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      const mainEl = document.getElementById('main-content');
      if (mainEl) {
        mainEl.focus({ preventScroll: true });
      }
    }

    const parts = location.pathname.split('/').filter(Boolean);
    let pageTitle = 'Katrio · Free Interactive Visual Learning · TN Class 10';
    let pageDesc =
      'Learn by seeing. Understand by doing. Free, no-login Tamil Nadu Class 10 interactive visual lessons across Mathematics, Science, English, Tamil, and Social Science.';

    if (parts[0] === 'class-10') {
      if (parts.length === 1) {
        pageTitle = 'Class 10 Subjects & Chapters · Katrio';
      } else if (parts.length === 2) {
        const sub = getSubjectBySlug(parts[1]);
        if (sub) {
          pageTitle = `${sub.title} (${sub.unit_count} Chapters) · Class 10 · Katrio`;
          pageDesc = sub.tagline;
        }
      } else if (parts.length === 3) {
        if (
          parts[1] === 'social_science' &&
          ['history', 'geography', 'civics', 'economics'].includes(parts[2])
        ) {
          const strandCap = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
          pageTitle = `Social Science — ${strandCap} · Class 10 · Katrio`;
        } else {
          const unit = getUnitById(parts[1], parts[2]);
          if (unit) {
            pageTitle = `${unit.code_label}: ${unit.title} · Class 10 · Katrio`;
            pageDesc = `${unit.hero_interaction_title} (${unit.book}, pp. ${unit.printed_page}–${unit.printed_page_end}).`;
          }
        }
      } else if (parts.length === 4) {
        const res = getSectionById(parts[1], parts[2], parts[3]);
        if (res) {
          pageTitle = `${res.section.section_number} ${res.section.title} · ${res.unit.title} · Katrio`;
          pageDesc = `Interactive Class 10 lesson for ${res.section.title} (textbook p. ${res.section.printed_page}, ${res.unit.book}).`;
        }
      }
    } else if (parts[0] === 'arcade') {
      pageTitle =
        parts[1] === 'sustainable-tn-town'
          ? 'Design a Sustainable Tamil Nadu Town · Capstone Mission · Katrio'
          : 'Games & Interactive Practice · Katrio';
    } else if (parts[0] === 'flashcards') {
      pageTitle = 'Flashcards · Class 10 · Katrio';
    } else if (parts[0] === 'quizzes') {
      pageTitle = 'Concept Quizzes · Class 10 · Katrio';
    } else if (parts[0] === 'teachers') {
      pageTitle = 'For Teachers & Classroom Guide · Katrio';
    } else if (parts[0] === 'accessibility') {
      pageTitle = 'Learning Settings & Accessibility · Katrio';
    } else if (parts[0] === 'privacy' || parts[0] === 'progress') {
      pageTitle = 'Privacy & Your Device Progress · Katrio';
    } else if (parts[0] === 'about') {
      pageTitle = 'About, Curriculum & Sources · Katrio';
    } else if (parts[0] === 'roadmap') {
      pageTitle = 'Editorial Status & Roadmap · Katrio';
    }

    document.title = pageTitle;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', pageDesc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <RouteMetadataAndScrollUpdater />
        <div className="min-h-screen flex flex-col bg-[var(--canvas)] text-[var(--text)]">
          <Header />
          <AccessibilityBar />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/class-10" element={<Class10HubPage />} />

              {/* Social Science Strand Routes */}
              <Route
                path="/class-10/social_science/history"
                element={<SubjectPage subjectOverride="social_science" strandOverride="history" />}
              />
              <Route
                path="/class-10/social_science/geography"
                element={
                  <SubjectPage subjectOverride="social_science" strandOverride="geography" />
                }
              />
              <Route
                path="/class-10/social_science/civics"
                element={<SubjectPage subjectOverride="social_science" strandOverride="civics" />}
              />
              <Route
                path="/class-10/social_science/economics"
                element={
                  <SubjectPage subjectOverride="social_science" strandOverride="economics" />
                }
              />

              {/* Subject, Unit, and Section Routes */}
              <Route path="/class-10/:subject" element={<SubjectPage />} />
              <Route path="/class-10/:subject/:unitId" element={<UnitPage />} />
              <Route
                path="/class-10/:subject/:unitId/:sectionId"
                element={<SectionPlayerPage />}
              />

              {/* Platform & Governance Routes */}
              <Route path="/arcade" element={<ArcadePage />} />
              <Route path="/arcade/sustainable-tn-town" element={<SustainableTnTownMission />} />
              <Route path="/flashcards" element={<FlashcardsPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/teachers" element={<TeachersPage />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/progress" element={<PrivacyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ProgressProvider>
  );
}
