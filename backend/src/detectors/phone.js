/**
 * Phone detector
 * Detects phone numbers in AU/US/IN formats
 */
function detect(text) {
  const spans = [];
  // Pattern for AU/US/IN phone formats: (+country code)? (area code)? number
  const pattern = /(\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3}[\s-]?\d{3,4}/g;
  
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const matched = match[0];
    // Filter out numbers that are too short or look like dates/measurements
    // Avoid matching standalone 3-4 digit numbers that could be measurements
    if (matched.replace(/[\s\-\(\)\+]/g, '').length >= 8) {
      // Avoid matching things like "400mg" or "6234 steps"
      const before = text[match.index - 1] || ' ';
      const after = text[match.index + matched.length] || ' ';
      
      // Skip if it looks like a measurement (letter immediately before or after)
      // But allow if there's a space or punctuation
      const isMeasurement = /[a-z0-9]/.test(before) && /[a-z]/.test(after);
      const isStepCount = /\d/.test(before) && /\s*(steps|step)/i.test(text.substring(match.index + matched.length, match.index + matched.length + 10));
      
      if (!isMeasurement && !isStepCount) {
        spans.push({
          start: match.index,
          end: match.index + matched.length,
          type: 'PHONE',
          confidence: 0.9
        });
      }
    }
  }
  
  return spans;
}

module.exports = { detect };

