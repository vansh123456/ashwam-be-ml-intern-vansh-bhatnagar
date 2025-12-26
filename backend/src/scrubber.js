/**
 * Main scrubber pipeline
 * Processes text through detection, resolution, and replacement
 */
const { detectAll } = require('./detectors');
const { resolve } = require('./resolver/resolve');
const { replace } = require('./replacer/replace');

const SCRUBBER_VERSION = 'v1';

/**
 * Scrub PII from text
 * @param {string} text - Input text
 * @param {string} entryId - Entry ID
 * @returns {Object} Scrubbed result with metadata
 */
function scrub(text, entryId) {
  // Step 1: Detect all PII
  const allSpans = detectAll(text);
  
  // Step 2: Resolve overlaps
  const resolvedSpans = resolve(allSpans);
  
  // Step 3: Replace PII with placeholders
  const scrubbedText = replace(text, resolvedSpans);
  
  // Step 4: Extract unique types found
  const typesFound = [...new Set(resolvedSpans.map(s => s.type))];
  
  // Step 5: Format spans for output (remove detector field if present)
  const detectedSpans = resolvedSpans.map(({ start, end, type, confidence }) => ({
    start,
    end,
    type,
    confidence
  }));
  
  return {
    entry_id: entryId,
    scrubbed_text: scrubbedText,
    detected_spans: detectedSpans,
    types_found: typesFound,
    scrubber_version: SCRUBBER_VERSION
  };
}

module.exports = { scrub, SCRUBBER_VERSION };

