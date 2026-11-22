import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/chrome/Breadcrumbs';
import { suggestRoutesForPath, searchCurriculum } from '../utils/curriculumStore';

export function NotFoundPage() {
  const location = useLocation();
  const [lookupQuery, setLookupQuery] = useState('');

  const suggested = suggestRoutesForPath(location.pathname);
  const customSearch = lookupQuery.trim()
    ? searchCurriculum(lookupQuery, { limit: 6 })
    : [];

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-16 space-y-8">
      <Breadcrumbs items={[{ label: '404 Route Lookup' }]} />

      <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono-tabular font-bold text-[var(--warning)]">
            HTTP 404 · Route Not Registered in Curriculum Registry v1
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--ink)]">
            We couldn&apos;t find that exact address
          </h1>
          <p className="text-sm sm:text-base text-[var(--text)] max-w-2xl">
            Requested path:{' '}
            <code className="font-mono-tabular px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--ink)]">
              {location.pathname}
            </code>
            . Use the route lookup below or choose one of the suggested Class 10 curriculum routes.
          </p>
        </div>

        {/* Helpful lookup input */}
        <div className="max-w-xl relative">
          <label htmlFor="notfound-lookup" className="sr-only">
            Search for a valid Class 10 route
          </label>
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="notfound-lookup"
            type="search"
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
            placeholder="Search chapter, section or Tamil title (e.g. Trigonometry, Heart, மணற்கேணி)..."
            className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-[12px] border border-[var(--line)] bg-[var(--surface-subtle)] text-sm text-[var(--ink)]"
          />
        </div>

        {customSearch.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-[var(--ink)]">Matching Curriculum Routes:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customSearch.map((item) => (
                <Link
                  key={`${item.kind}-${item.id}`}
                  to={item.route}
                  className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] hover:border-[var(--primary)] flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-[var(--ink)]">{item.title}</div>
                    <div className="text-[var(--text-muted)]">{item.subtitle}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--primary)] shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <h2 className="text-base font-extrabold text-[var(--ink)]">
            Suggested Class 10 Routes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggested.map((s) => (
              <Link
                key={s.route}
                to={s.route}
                className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)]/60 hover:border-[var(--primary)] flex items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-[var(--ink)]">{s.label}</div>
                  <div className="text-xs text-[var(--text-muted)]">{s.reason}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--primary)] shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
