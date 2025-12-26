import axios from 'axios';

export type DetectedSpan = {
  type: string;
  start: number;
  end: number;
  confidence: number;
};

export type ScrubbedEntry = {
  entry_id: string;
  scrubbed_text: string;
  detected_spans: DetectedSpan[];
  types_found: string[];
  scrubber_version: string;
};

// Backend URL is provided via Vite env; fallback uses the existing backend port 3000.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Placeholder for future backend integration.
 * In the next step, this will POST the journals.jsonl file to `${API_BASE_URL}/scrub`.
 */
export async function scrubFileWithBackend(_file: File): Promise<ScrubbedEntry[]> {
  // This function is intentionally left as a stub for now to respect the
  // step-by-step integration flow.
  // eslint-disable-next-line no-console
  console.info('scrubFileWithBackend called - backend wiring will be added next.');
  return [];
}


