git rm -r --cached node_modules/**
 * Overlap resolver
 * Resolves overlapping spans using priority and longest span preference
 * Priority: EMAIL > PHONE > APPT_ID > GOV_ID > INSURANCE_ID > PROVIDER > NAME > ADDRESS > DOB
 */
const PRIORITY = {
  EMAIL: 9,
  PHONE: 8,
  APPT_ID: 7,
  GOV_ID: 6,
  INSURANCE_ID: 5,
  PROVIDER: 4,
  NAME: 3,
  ADDRESS: 2,
  DOB: 1
};

/**
 * Check if two spans overlap
 */
function overlaps(span1, span2) {
  return span1.start < span2.end && span1.end > span2.start;
}

/**
 * Resolve overlapping spans
 * @param {Array} spans - Array of detected spans
 * @returns {Array} Resolved spans with no overlaps
 */
function resolve(spans) {
  if (spans.length === 0) return [];
  
  // Sort by priority (descending), then by length (descending), then by start position
  const sorted = [...spans].sort((a, b) => {
    const priorityA = PRIORITY[a.type] || 0;
    const priorityB = PRIORITY[b.type] || 0;
    
    if (priorityA !== priorityB) {
      return priorityB - priorityA; // Higher priority first
    }
    
    // If same priority, prefer longer spans
    const lengthA = a.end - a.start;
    const lengthB = b.end - b.start;
    if (lengthA !== lengthB) {
      return lengthB - lengthA; // Longer first
    }
    
    // If same length, prefer earlier spans
    return a.start - b.start;
  });
  
  const resolved = [];
  
  for (const span of sorted) {
    // Check if this span overlaps with any already resolved span
    let hasOverlap = false;
    for (const resolvedSpan of resolved) {
      if (overlaps(span, resolvedSpan)) {
        hasOverlap = true;
        break;
      }
    }
    
    // Only add if no overlap
    if (!hasOverlap) {
      resolved.push(span);
    }
  }
  
  // Sort resolved spans by start position for easier processing
  return resolved.sort((a, b) => a.start - b.start);
}

module.exports = { resolve };

