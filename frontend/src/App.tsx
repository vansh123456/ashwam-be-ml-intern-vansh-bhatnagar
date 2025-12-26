import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { JournalViewer } from './components/JournalViewer';
import { SummaryPanel } from './components/SummaryPanel';
import { parseJsonlFromFile, buildJsonlFromResults } from './utils/jsonl';
import type { ScrubbedEntry } from './api';

export type ParsedJournalEntry = {
  entry_id: string;
  text: string;
};

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedEntries, setParsedEntries] = useState<ParsedJournalEntry[]>([]);
  const [results, setResults] = useState<ScrubbedEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (selectedFile: File | null) => {
    setFile(selectedFile);
    setResults([]);
    setError(null);

    if (!selectedFile) {
      setParsedEntries([]);
      return;
    }

    try {
      const entries = await parseJsonlFromFile(selectedFile);
      setParsedEntries(entries);
    } catch (e) {
      console.error(e);
      setError('Failed to read journals file. Please ensure it is valid JSONL.');
      setParsedEntries([]);
    }
  };

  const handleScrub = async () => {
    if (!file) {
      setError('Please select a journals.jsonl file first.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const { scrubFileWithBackend } = await import('./api');
      const scrubbedResults = await scrubFileWithBackend(file);
      setResults(scrubbedResults);
    } catch (e) {
      console.error(e);
      const errorMessage =
        e instanceof Error ? e.message : 'Failed to scrub data. Please try again.';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!results.length) {
      setError('No scrubbed results to download yet.');
      return;
    }
    const jsonl = buildJsonlFromResults(results);
    const blob = new Blob([jsonl], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scrubbed-journals.jsonl';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight text-slate-50">
            Ashwam PII Scrubber
          </h1>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/40">
            v1.0
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row">
        <section className="w-full space-y-4 lg:w-2/5">
          <FileUploader
            file={file}
            loading={loading}
            onFileSelected={handleFileSelected}
            onScrub={handleScrub}
            onDownload={handleDownload}
          />
          <SummaryPanel results={results} />
          {error && (
            <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </div>
          )}
        </section>

        <section className="w-full lg:w-3/5">
          <JournalViewer entries={parsedEntries} results={results} loading={loading} />
        </section>
      </main>
    </div>
  );
};

export default App;


