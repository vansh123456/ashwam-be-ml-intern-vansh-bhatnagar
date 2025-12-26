/**
 * Email detector
 * Detects email addresses using regex pattern
 */
function detect(text) {
  const spans = [];
  const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/g;
  
  let match;
  while ((match = pattern.exec(text)) !== null) {
    spans.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'EMAIL',
      confidence: 1.0
    });
  }
  
  return spans;
}

module.exports = { detect };

