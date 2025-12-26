/**
 * Date of Birth detector
 * Detects dates in DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY formats
 */
function detect(text) {
  const spans = [];
  // Pattern for dates: DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const pattern = /\b(0?[1-9]|[12][0-9]|3[01])[-\/.](0?[1-9]|1[012])[-\/.]\d{2,4}\b/g;
  
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const matched = match[0];
    // Check if it's a valid date format (not just any number pattern)
    // Avoid matching things like "1.5" or "2/3" which could be measurements
    const parts = matched.split(/[-\/.]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      
      // Basic validation: day 1-31, month 1-12, year 1900-2100 or 00-99
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && 
          (year >= 1900 && year <= 2100 || (year >= 0 && year <= 99))) {
        spans.push({
          start: match.index,
          end: match.index + matched.length,
          type: 'DOB',
          confidence: 0.85
        });
      }
    }
  }
  
  return spans;
}

module.exports = { detect };

