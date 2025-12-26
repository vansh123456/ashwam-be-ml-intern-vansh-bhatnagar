/**
 * PII replacer
 * Replaces detected PII spans with placeholders [TYPE]
 * Preserves punctuation and spacing
 */
/**
 * Replace PII spans in text with placeholders
 * @param {string} text - Original text
 * @param {Array} spans - Array of resolved spans sorted by start position
 * @returns {string} Text with PII replaced by placeholders
 */
function replace(text, spans) {
  if (spans.length === 0) return text;
  
  // Process spans from end to start to maintain correct indices
  let result = text;
  const sortedSpans = [...spans].sort((a, b) => b.start - a.start); // Reverse order
  
  for (const span of sortedSpans) {
    const before = result.substring(0, span.start);
    const after = result.substring(span.end);
    const placeholder = `[${span.type}]`;
    result = before + placeholder + after;
  }
  
  return result;
}

module.exports = { replace };

