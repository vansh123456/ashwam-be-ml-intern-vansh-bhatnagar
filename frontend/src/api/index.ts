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

// Backend URL - defaults to port 3000 where backend runs
// Can be overridden with VITE_API_URL environment variable
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Send journals.jsonl file to backend for PII scrubbing
 * @param file - The JSONL file to scrub
 * @returns Promise resolving to array of scrubbed entries
 */
export async function scrubFileWithBackend(file: File): Promise<ScrubbedEntry[]> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<ScrubbedEntry[]>(
      `${API_BASE_URL}/scrub`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout for large files
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        throw new Error(
          `Backend error: ${error.response.status} - ${
            error.response.data?.error || error.response.data?.message || 'Unknown error'
          }`
        );
      } else if (error.request) {
        // Request made but no response
        throw new Error(
          'Unable to connect to backend. Please ensure the server is running on ' +
          API_BASE_URL
        );
      }
    }
    throw error;
  }
}


