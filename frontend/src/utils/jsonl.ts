import type { ParsedJournalEntry } from '../App';
import type { ScrubbedEntry } from '../api';

/**
 * Read a File as text.
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error('File reading aborted'));
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.readAsText(file);
  });
}

/**
 * Parse a JSONL file into journal entries for preview.
 * Expects each line to be a JSON object containing at least a `text` field.
 */
export async function parseJsonlFromFile(file: File): Promise<ParsedJournalEntry[]> {
  const text = await readFileAsText(file);
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

  const entries: ParsedJournalEntry[] = [];

  lines.forEach((line, index) => {
    try {
      const obj = JSON.parse(line);
      const entryId: string =
        obj.entry_id ?? obj.id ?? `entry_${index + 1}`;
      const content: string = obj.text ?? obj.content ?? '';
      if (content) {
        entries.push({ entry_id: entryId, text: content });
      }
    } catch {
      // Skip invalid JSON lines but keep UI resilient.
    }
  });

  return entries;
}

/**
 * Convert scrubbed results back into JSONL string for download.
 */
export function buildJsonlFromResults(results: ScrubbedEntry[]): string {
  return results
    .map((r) => JSON.stringify(r))
    .join('\n');
}


