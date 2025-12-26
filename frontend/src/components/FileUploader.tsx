import React, { useRef } from 'react';

type Props = {
  file: File | null;
  loading: boolean;
  onFileSelected: (file: File | null) => void;
  onScrub: () => void;
  onDownload: () => void;
};

export const FileUploader: React.FC<Props> = ({
  file,
  loading,
  onFileSelected,
  onScrub,
  onDownload,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) {
      onFileSelected(null);
      return;
    }

    if (!selected.name.toLowerCase().endsWith('.jsonl')) {
      alert('Please upload a .jsonl file.');
      event.target.value = '';
      onFileSelected(null);
      return;
    }

    onFileSelected(selected);
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-900/40">
      <h2 className="text-sm font-semibold text-slate-100">
        Journals Source
      </h2>
      <p className="text-xs text-slate-400">
        Upload your <span className="font-mono">journals.jsonl</span> file. No
        raw PII is ever rendered outside your browser.
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBrowseClick}
          className="rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-slate-50 shadow-sm shadow-slate-900/40 ring-1 ring-slate-600 hover:bg-slate-700"
        >
          Choose File
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".jsonl"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="truncate text-xs text-slate-300">
          {file ? file.name : 'No file selected'}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onScrub}
          disabled={!file || loading}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/40"
        >
          {loading && (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-950 border-t-transparent" />
          )}
          <span>Scrub Data</span>
        </button>

        <button
          type="button"
          onClick={onDownload}
          disabled={loading}
          className="rounded-md border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
        >
          Download Scrubbed JSONL
        </button>
      </div>

      <p className="text-[11px] text-slate-500">
        The left panel shows original journal text, the right panel shows
        scrubbed output with PII highlights.
      </p>
    </div>
  );
};


