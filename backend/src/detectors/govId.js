/**
 * Government ID detector
 * Detects SSN, Aadhaar, Medicare, and similar government IDs
 */
function detect(text) {
  const spans = [];
  
  // Patterns for different government IDs
  const patterns = [
    // SSN format: 123-45-6789
    { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, confidence: 0.95 },
    // Aadhaar format: 1234 5678 9012
    { pattern: /\b\d{4}\s\d{4}\s\d{4}\b/g, confidence: 0.95 },
    // Medicare format variations
    { pattern: /\b\d{10,11}\b/g, confidence: 0.7 }, // 10-11 digit numbers (context-dependent)
    // Other formats: XXX-XX-XXXX or similar
    { pattern: /\b[A-Z]{2,3}[-]?\d{6,}\b/g, confidence: 0.8 }
  ];
  
  patterns.forEach(({ pattern, confidence }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const matched = match[0];
      // Avoid matching phone numbers or other common patterns
      // SSN and Aadhaar patterns are specific enough
      if (pattern.source.includes('\\d{3}-\\d{2}-\\d{4}') || 
          pattern.source.includes('\\d{4}\\s\\d{4}\\s\\d{4}')) {
        spans.push({
          start: match.index,
          end: match.index + matched.length,
          type: 'GOV_ID',
          confidence: confidence
        });
      } else {
        // For less specific patterns, check context
        const before = text.substring(Math.max(0, match.index - 20), match.index);
        const after = text.substring(match.index + matched.length, match.index + matched.length + 20);
        const context = (before + ' ' + after).toLowerCase();
        
        // Look for government/ID related context
        if (context.match(/(medicare|ssn|aadhaar|government|gov|id|number)/)) {
          spans.push({
            start: match.index,
            end: match.index + matched.length,
            type: 'GOV_ID',
            confidence: confidence
          });
        }
      }
    }
  });
  
  return spans;
}

module.exports = { detect };

