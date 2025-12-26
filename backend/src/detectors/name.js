/**
 * Name detector
 * Detects person names using heuristics: capitalized first + last names, titles
 */
function detect(text) {
  const spans = [];
  
  // Titles that often precede names
  const titles = ['Dr\\.', 'Doctor', 'Mr\\.', 'Mrs\\.', 'Ms\\.', 'Miss', 'Prof\\.', 'Professor',
                  'Patient:', 'Partner:', 'Name:', 'Client:', 'Member:'];
  
  // Pattern 1: Title followed by name
  const titlePattern = new RegExp(`\\b(${titles.join('|')})\\s+([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)+)`, 'gi');
  
  let match;
  while ((match = titlePattern.exec(text)) !== null) {
    const fullMatch = match[0];
    const namePart = match[2]; // The name part after title
    
    // Name should be at least 2 words (first + last)
    if (namePart.split(/\s+/).length >= 2) {
      spans.push({
        start: match.index,
        end: match.index + fullMatch.length,
        type: 'NAME',
        confidence: 0.85
      });
    }
  }
  
  // Pattern 2: Capitalized first + last name (heuristic)
  // Look for sequences of capitalized words (2-4 words)
  const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/g;
  
  // Reset regex
  namePattern.lastIndex = 0;
  while ((match = namePattern.exec(text)) !== null) {
    const matched = match[0];
    const words = matched.split(/\s+/);
    
    // Skip if it's a known non-name pattern
    const lowerMatched = matched.toLowerCase();
    if (lowerMatched.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december)\b/)) {
      continue;
    }
    
    // Check context - names often appear after colons or in specific contexts
    const before = text.substring(Math.max(0, match.index - 20), match.index);
    const after = text.substring(match.index + matched.length, match.index + matched.length + 10);
    
    // If it appears after a colon or in a list, more likely to be a name
    if (before.trim().endsWith(':') || 
        before.trim().endsWith(',') ||
        after.trim().startsWith(',') ||
        words.length >= 2) {
      // Avoid matching if it's already captured by another detector
      // Check if this span overlaps with any existing spans
      let overlaps = false;
      for (const span of spans) {
        if (match.index < span.end && match.index + matched.length > span.start) {
          overlaps = true;
          break;
        }
      }
      
      if (!overlaps && words.length >= 2) {
        spans.push({
          start: match.index,
          end: match.index + matched.length,
          type: 'NAME',
          confidence: 0.7
        });
      }
    }
  }
  
  return spans;
}

module.exports = { detect };

