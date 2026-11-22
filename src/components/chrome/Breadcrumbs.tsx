import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
  lang?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--text-muted)]">
        <li>
          <Link
            to="/"
            className="hover:text-[var(--ink)] hover:underline py-1 inline-flex items-center font-medium"
          >
            Home
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight className="w-4 h-4 shrink-0 opacity-60" aria-hidden="true" />
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  lang={item.lang}
                  className={`hover:text-[var(--ink)] hover:underline py-1 inline-flex items-center truncate max-w-[260px] sm:max-w-[340px] ${
                    item.lang === 'ta' ? 'font-tamil' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  lang={item.lang}
                  className={`font-semibold text-[var(--ink)] truncate max-w-[280px] sm:max-w-[440px] ${
                    item.lang === 'ta' ? 'font-tamil' : ''
                  }`}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
