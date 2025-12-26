import React from 'react';
import type { DetectedSpan } from '../api';

const TYPE_CLASS_MAP: Record<string, string> = {
  EMAIL: 'pii-email',
  PHONE: 'pii-phone',
  NAME: 'pii-name',
  ADDRESS: 'pii-address',
  DOB: 'pii-dob',
  PROVIDER: 'pii-provider',
  APPT_ID: 'pii-appt',
  INSURANCE_ID: 'pii-insurance',
  GOV_ID: 'pii-gov',
};

export type HighlightTextProps = {
  text: string;
  spans: DetectedSpan[];
};

/**
 * HighlightText
 * Renders text with inline spans highlighted according to detected PII.
 */
export const HighlightText: React.FC<HighlightTextProps> = ({ text, spans }) => {
  if (!spans.length) {
    return <span>{text}</span>;
  }

  const ordered = [...spans].sort((a, b) => a.start - b.start);
  const segments: React.ReactNode[] = [];
  let cursor = 0;

  ordered.forEach((span, index) => {
    const { start, end, type } = span;
    if (start > cursor) {
      segments.push(
        <span key={`plain-${index}-${cursor}`}>{text.slice(cursor, start)}</span>,
      );
    }
    const cls = TYPE_CLASS_MAP[type] ?? 'pii-generic';
    segments.push(
      <span
        key={`pii-${index}-${start}-${end}`}
        className={cls}
        title={`${type} (confidence ${span.confidence.toFixed(2)})`}
      >
        {text.slice(start, end)}
      </span>,
    );
    cursor = end;
  });

  if (cursor < text.length) {
    segments.push(
      <span key={`plain-tail-${cursor}`}>{text.slice(cursor)}</span>,
    );
  }

  return <span>{segments}</span>;
};


