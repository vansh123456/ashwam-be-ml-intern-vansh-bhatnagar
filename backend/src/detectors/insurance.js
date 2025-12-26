/**
 * Insurance ID detector
 * Detects insurance IDs like BUPA-PL-123456, policy numbers, etc.
 */
function detect(text) {
  const spans = [];
  
  // Patterns for insurance IDs
  const patterns = [
    // BUPA-PL-###### or similar formats
    /\b([A-Z]{2,}(?:-[A-Z]{2,})*)[-\s]?\d{4,}\b/g,
    // Policy numbers: POL-######, POLICY-######
    /\b(POL|POLICY|INS|INSURANCE)[-\s]?\d{4,}\b/gi,
    // Member IDs: MEM-######
    /\b(MEM|MEMBER)[-\s]?\d{4,}\b/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const matched = match[0];
      // Avoid matching things like "BUPA-400mg" (check for digits at end)
      if (/\d{4,}$/.test(matched)) {
        spans.push({
          start: match.index,
          end: match.index + matched.length,
          type: 'INSURANCE_ID',
          confidence: 0.85
        });
      }
    }
  });
  
  return spans;
}

module.exports = { detect };

