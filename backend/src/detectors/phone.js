/**
 * Phone detector
 * Detects phone numbers in AU/US/IN formats
 */
function detect(text) {
  const spans = [];
  // Pattern for AU/US/IN phone formats: (+country code)? (area code)? number
  // Handles: +61 2 1234 5678, (02) 1234 5678, 0412 345 678, +1-555-123-4567, etc.
  const patterns = [
    // Format: +XX X XXXX XXXX or +XX-XX-XXXX-XXXX
    /\+?\d{1,3}[\s-]?\d{1,4}[\s-]?\d{3,4}[\s-]?\d{3,4}/g,
    // Format: (XX) XXXX XXXX or (XXX) XXX-XXXX
    /\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/g,
    // Format: XXXX XXX XXX (mobile numbers)
    /\b\d{4}[\s-]?\d{3}[\s-]?\d{3}\b/g
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const matched = match[0];
      // Filter out numbers that are too short
      const digitsOnly = matched.replace(/[\s\-\(\)\+]/g, '');
      if (digitsOnly.length >= 8 && digitsOnly.length <= 15) {
        // Avoid matching things like "400mg" or "6234 steps"
        const before = text[match.index - 1] || ' ';
        const after = text[match.index + matched.length] || ' ';
        
        // Skip if it looks like a measurement (letter immediately before or after digits)
        const beforeContext = text.substring(Math.max(0, match.index - 5), match.index);
        const afterContext = text.substring(match.index + matched.length, match.index + matched.length + 10);
        
        const isMeasurement = /[a-z]\d/.test(beforeContext + matched) || /\d[a-z]/.test(matched + afterContext);
        const isStepCount = /\d+\s*(steps|step)/i.test(matched + afterContext);
        const isDosage = /\d+\s*(mg|ml|g|kg|lb)/i.test(matched + afterContext);
        
        if (!isMeasurement && !isStepCount && !isDosage) {
          // Check if this span overlaps with an already detected span
          let overlaps = false;
          for (const existingSpan of spans) {
            if (match.index < existingSpan.end && match.index + matched.length > existingSpan.start) {
              overlaps = true;
              break;
            }
          }
          
          if (!overlaps) {
            spans.push({
              start: match.index,
              end: match.index + matched.length,
              type: 'PHONE',
              confidence: 0.9
            });
          }
        }
      }
    }
  }
  
  return spans;
}

module.exports = { detect };

