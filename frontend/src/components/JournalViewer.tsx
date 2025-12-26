import React, { useState } from 'react';
import type { ParsedJournalEntry } from '../App';
import type { ScrubbedEntry } from '../api';
import { HighlightText } from './HighlightText';

type Props = {
  entries: ParsedJournalEntry[];
  results: ScrubbedEntry[];
  loading: boolean;
};

export const JournalViewer: React.FC<Props> = ({
  entries,
  results,
  loading,
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resultsMap: Record<string, ScrubbedEntry> = {};
  results.forEach((r) => {
    resultsMap[r.entry_id] = r;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">
          Journal Entries
        </h2>
        <span className="text-xs text-slate-400">
          {entries.length
            ? `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} loaded`
            : 'No entries yet'}
        </span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          Processing journals with Ashwam PII Scrubber…
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry) => {
          const result = resultsMap[entry.entry_id];
          const isExpanded = expandedIds[entry.entry_id] ?? true;

          return (
            <article
              key={entry.entry_id}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 shadow-md shadow-slate-900/40"
            >
              <header className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                    {entry.entry_id}
                  </span>
                  {result && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/40">
                      scrubbed v{result.scrubber_version ?? '1'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpanded(entry.entry_id)}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {isExpanded ? 'Collapse' : 'Expand'}
                </button>
              </header>

              {isExpanded && (
                <div className="grid gap-3 border-t border-slate-800 pt-3 text-sm md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Original
                    </p>
                    <div className="rounded-md border border-slate-800 bg-slate-950/60 p-2 text-xs leading-relaxed text-slate-100">
                      {entry.text}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Scrubbed &amp; Highlighted
                    </p>
                    <div className="rounded-md border border-slate-800 bg-slate-950/60 p-2 text-xs leading-relaxed text-slate-100">
                      {result ? (
                        <HighlightText
                          text={result.scrubbed_text}
                          spans={result.detected_spans}
                        />
                      ) : (
                        <span className="text-slate-500">
                          Run <span className="font-semibold">Scrub Data</span>{' '}
                          once the backend is connected to see scrubbed output
                          here.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {!entries.length && (
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
            Upload a <span className="font-mono">journals.jsonl</span> file to
            preview entries and scrub them.
          </div>
        )}
      </div>
    </div>
  );
};


