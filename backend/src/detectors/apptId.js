/**
 * Appointment/Booking/Invoice ID detector
 * Detects IDs like APPT-123, BKG-456, INV-789
 */
function detect(text) {
  const spans = [];
  // Pattern for APPT/BKG/INV IDs
  const pattern = /(APPT|BKG|INV|Appt|Bkg|Inv|appt|bkg|inv)[-\s]?\d+/gi;
  
  let match;
  while ((match = pattern.exec(text)) !== null) {
    spans.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'APPT_ID',
      confidence: 0.95
    });
  }
  
  return spans;
}

module.exports = { detect };

