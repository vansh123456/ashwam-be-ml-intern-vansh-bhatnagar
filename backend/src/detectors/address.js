/**
 * Address detector
 * Detects addresses including street names, flat numbers, cities
 */
function detect(text) {
  const spans = [];
  
  // Patterns for addresses
  const patterns = [
    // Flat/Unit numbers: Flat 123, Unit 456
    /\b(Flat|Unit|Apt|Apartment|Suite|Ste)\s\d+[A-Za-z]?\b/gi,
    // Street addresses: 123 Main Street, 456 Oak Rd
    /\b\d+\s+[A-Za-z0-9\s]+(Street|St|Road|Rd|Lane|Ln|Avenue|Ave|Drive|Dr|Boulevard|Blvd|Way|Court|Ct|Place|Pl)\b/gi,
    // City names with state/country indicators
    /\b\d+\s+[A-Za-z\s]+(VIC|NSW|QLD|SA|WA|TAS|NT|ACT|Pune|Mumbai|Delhi|Bangalore|Sydney|Melbourne|Brisbane|Perth|Adelaide)\b/gi,
    // Postal codes (AU: 4 digits, US: 5 digits, IN: 6 digits)
    /\b\d{4,6}\b/g
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const matched = match[0];
      // Avoid matching standalone numbers that could be measurements
      if (pattern.source.includes('(Street|St|') || 
          pattern.source.includes('(Flat|Unit|') ||
          pattern.source.includes('(VIC|NSW|')) {
        spans.push({
          start: match.index,
          end: match.index + matched.length,
          type: 'ADDRESS',
          confidence: 0.8
        });
      } else {
        // For postal codes, check if it's in address context
        const before = text.substring(Math.max(0, match.index - 30), match.index);
        const after = text.substring(match.index + matched.length, match.index + matched.length + 10);
        const context = (before + ' ' + after).toLowerCase();
        
        if (context.match(/(street|road|address|flat|unit|city|suburb|postal|zip)/)) {
          spans.push({
            start: match.index,
            end: match.index + matched.length,
            type: 'ADDRESS',
            confidence: 0.7
          });
        }
      }
    }
  });
  
  return spans;
}

module.exports = { detect };

