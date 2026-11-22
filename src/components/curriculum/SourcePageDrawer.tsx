import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, X } from 'lucide-react';
import type { CurriculumUnit } from '../../types/curriculum';

export function SourcePageDrawer({
  unit,
  buttonLabel,
}: {
  unit: CurriculumUnit;
  buttonLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Textbook source page index (${unit.source_page_anchors.length} pages)`}
        className="min-h-[44px] px-3.5 py-2 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-sm font-semibold text-[var(--ink)] inline-flex items-center gap-2 transition-colors whitespace-nowrap"
      >
        <BookOpen className="w-4 h-4 text-[var(--primary)] shrink-0" />
        <span>{buttonLabel ?? `Textbook references (${unit.source_page_anchors.length} pages)`}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="source-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-black/50 p-0 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full max-w-xl bg-[var(--surface)] border border-[var(--line)] sm:rounded-[20px] h-full overflow-hidden flex flex-col shadow-xl">
            <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between gap-4">
              <div>
                <h2 id="source-drawer-title" className="text-lg font-extrabold text-[var(--ink)]">
                  Textbook Source &amp; Page Index — {unit.code_label}
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  {unit.book} ({unit.edition}) · Printed pp. {unit.printed_page}–
                  {unit.printed_page_end}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close textbook source drawer"
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--surface-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="p-4 rounded-[14px] bg-[var(--surface-subtle)] border border-[var(--line)] text-sm text-[var(--text)] space-y-1.5">
                <p className="font-bold text-[var(--ink)]">
                  How textbook page pointers work
                </p>
                <p>
                  These {unit.source_page_anchors.length} page references connect your printed Class
                  10 textbook pages (and PDF pages in{' '}
                  <code className="font-mono-tabular text-xs">{unit.sources[0]?.pdf_filename}</code>)
                  directly to the matching topic on Katrio.
                </p>
              </div>

              <div className="border border-[var(--line)] rounded-[14px] overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--surface-subtle)] border-b border-[var(--line)] text-[var(--ink)]">
                      <th className="py-3 px-3.5 font-bold">Book Page</th>
                      <th className="py-3 px-3.5 font-bold">PDF Page</th>
                      <th className="py-3 px-3.5 font-bold">Linked Topics</th>
                      <th className="py-3 px-3.5 font-bold">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {unit.source_page_anchors.map((anchor) => {
                      const linkedSections = unit.sections.filter((s) =>
                        anchor.linked_section_ids.includes(s.id),
                      );
                      return (
                        <tr key={anchor.anchor_id} className="hover:bg-[var(--surface-subtle)]/60">
                          <td className="py-2.5 px-3.5 font-mono-tabular font-bold text-[var(--ink)] whitespace-nowrap">
                            p. {anchor.printed_page}
                          </td>
                          <td className="py-2.5 px-3.5 font-mono-tabular text-xs text-[var(--text-muted)] whitespace-nowrap">
                            PDF {anchor.pdf_page}
                          </td>
                          <td className="py-2.5 px-3.5 space-y-1">
                            {linkedSections.map((sec) => (
                              <div key={sec.id}>
                                <Link
                                  to={sec.route}
                                  onClick={() => setIsOpen(false)}
                                  className="text-[var(--primary)] hover:underline font-semibold"
                                >
                                  {sec.section_number} {sec.title}
                                </Link>
                              </div>
                            ))}
                          </td>
                          <td className="py-2.5 px-3.5 text-xs text-[var(--text-muted)]">
                            {anchor.audit_note}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-[var(--line)] bg-[var(--surface-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>
                Printed pages {unit.printed_page}–{unit.printed_page_end}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 min-h-[40px] rounded-xl bg-[var(--primary)] text-white text-sm font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
