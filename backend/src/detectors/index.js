/**
 * Aggregate detector
 * Runs all PII detectors and returns combined results
 */
const emailDetector = require('./email');
const phoneDetector = require('./phone');
const nameDetector = require('./name');
const addressDetector = require('./address');
const dobDetector = require('./dob');
const providerDetector = require('./provider');
const apptIdDetector = require('./apptId');
const insuranceDetector = require('./insurance');
const govIdDetector = require('./govId');

/**
 * Run all detectors on text and return all detected spans
 * @param {string} text - Input text to scan
 * @returns {Array} Array of spans with { start, end, type, confidence }
 */
function detectAll(text) {
  const allSpans = [];
  
  // Run all detectors
  allSpans.push(...emailDetector.detect(text).map(s => ({ ...s, detector: 'email' })));
  allSpans.push(...phoneDetector.detect(text).map(s => ({ ...s, detector: 'phone' })));
  allSpans.push(...apptIdDetector.detect(text).map(s => ({ ...s, detector: 'apptId' })));
  allSpans.push(...govIdDetector.detect(text).map(s => ({ ...s, detector: 'govId' })));
  allSpans.push(...insuranceDetector.detect(text).map(s => ({ ...s, detector: 'insurance' })));
  allSpans.push(...providerDetector.detect(text).map(s => ({ ...s, detector: 'provider' })));
  allSpans.push(...nameDetector.detect(text).map(s => ({ ...s, detector: 'name' })));
  allSpans.push(...addressDetector.detect(text).map(s => ({ ...s, detector: 'address' })));
  allSpans.push(...dobDetector.detect(text).map(s => ({ ...s, detector: 'dob' })));
  
  return allSpans;
}

module.exports = { detectAll };

