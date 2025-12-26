/**
 * Provider detector
 * Detects clinic/hospital/lab names using keyword matching
 */
function detect(text) {
  const spans = [];
  
  // Keywords that indicate provider names
  const providerKeywords = [
    'clinic', 'hospital', 'IVF', 'Health', 'Pathology', 'Labs', 'Laboratory',
    'Medical', 'Centre', 'Center', 'Care', 'Practice', 'Specialist', 'Doctor',
    'Physician', 'Consultant', 'Therapy', 'Wellness', 'Diagnostics'
  ];
  
  // Pattern to match provider names (keyword + optional name before/after)
  const patterns = [
    // "Dr. [Name] Clinic" or "[Name] Clinic"
    new RegExp(`\\b([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*)?\\s*(${providerKeywords.join('|')})\\b`, 'gi'),
    // "[Provider Name] Hospital" or standalone provider names
    new RegExp(`\\b([A-Z][A-Za-z]+(?:\\s+[A-Z][A-Za-z]+){0,3})\\s+(${providerKeywords.join('|')})\\b`, 'gi')
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      // Avoid matching common words that might contain these keywords
      const matched = match[0];
      const before = text[match.index - 1] || ' ';
      const after = text[match.index + matched.length] || ' ';
      
      // Skip if it's part of a larger word or common phrase
      if (!/[a-z]/.test(before) && !/[a-z]/.test(after)) {
        // Check if it's a meaningful provider name (at least 3 chars)
        if (matched.length >= 3) {
          spans.push({
            start: match.index,
            end: match.index + matched.length,
            type: 'PROVIDER',
            confidence: 0.75
          });
        }
      }
    }
  });
  
  return spans;
}

module.exports = { detect };

