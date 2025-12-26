import React, { useMemo } from 'react';
import type { ScrubbedEntry } from '../api';

type Props = {
  results: ScrubbedEntry[];
};

const TYPE_LABELS: Record<string, string> = {
  EMAIL: 'Email',
  PHONE: 'Phone',
  NAME: 'Name',
  ADDRESS: 'Address',
  DOB: 'Date of Birth',
  PROVIDER: 'Provider',
  APPT_ID: 'Appointment ID',
  INSURANCE_ID: 'Insurance ID',
  GOV_ID: 'Government ID',
};

const TYPE_BADGE_CLASS: Record<string, string> = {
  EMAIL: 'bg-piiEmail/20 text-piiEmail border-piiEmail/60',
  PHONE: 'bg-piiPhone/20 text-piiPhone border-piiPhone/60',
  NAME: 'bg-piiName/20 text-piiName border-piiName/60',
  ADDRESS: 'bg-piiAddress/20 text-piiAddress border-piiAddress/60',
  DOB: 'bg-piiDob/20 text-piiDob border-piiDob/60',
  PROVIDER: 'bg-piiProvider/20 text-piiProvider border-piiProvider/60',
  APPT_ID: 'bg-piiAppt/20 text-piiAppt border-piiAppt/60',
  INSURANCE_ID: 'bg-piiInsurance/20 text-piiInsurance border-piiInsurance/60',
  GOV_ID: 'bg-piiGov/20 text-piiGov border-piiGov/60',
};

export const SummaryPanel: React.FC<Props> = ({ results }) => {
  const { typeCounts, totalSpans } = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;

    results.forEach((entry) => {
      entry.detected_spans.forEach((span) => {
        total += 1;
        counts[span.type] = (counts[span.type] ?? 0) + 1;
      });
    });

    return { typeCounts: counts, totalSpans: total };
  }, [results]);

  return (
    <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-900/40">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">Scrub Summary</h2>
        <span className="text-xs text-slate-400">
          {results.length
            ? `${results.length} entries processed`
            : 'No scrub runs yet'}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2">
        <div className="text-xs text-slate-400">Total PII spans replaced</div>
        <div className="text-base font-semibold text-emerald-400">
          {totalSpans}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Object.entries(typeCounts).length === 0 && (
          <span className="text-[11px] text-slate-500">
            Run a scrub to see PII type breakdown.
          </span>
        )}
        {Object.entries(typeCounts).map(([type, count]) => (
          <span
            key={type}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${TYPE_BADGE_CLASS[type] ?? 'bg-slate-800 text-slate-200 border-slate-600'}`}
          >
            <span className="uppercase tracking-wide">
              {TYPE_LABELS[type] ?? type}
            </span>
            <span className="text-xs text-slate-100/80">{count}</span>
          </span>
        ))}
      </div>
    </div>
  );
};


