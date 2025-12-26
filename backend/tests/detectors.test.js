/**
 * Tests for PII detectors
 * Ensures each PII type is detected correctly
 * Ensures health-related content is NOT flagged
 */
const emailDetector = require('../src/detectors/email');
const phoneDetector = require('../src/detectors/phone');
const nameDetector = require('../src/detectors/name');
const addressDetector = require('../src/detectors/address');
const dobDetector = require('../src/detectors/dob');
const providerDetector = require('../src/detectors/provider');
const apptIdDetector = require('../src/detectors/apptId');
const insuranceDetector = require('../src/detectors/insurance');
const govIdDetector = require('../src/detectors/govId');

describe('Email Detector', () => {
  test('detects email addresses', () => {
    const text = 'Contact me at john.doe@example.com';
    const spans = emailDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0].type).toBe('EMAIL');
    expect(text.substring(spans[0].start, spans[0].end)).toBe('john.doe@example.com');
  });

  test('detects multiple emails', () => {
    const text = 'Email admin@test.com or support@test.com';
    const spans = emailDetector.detect(text);
    expect(spans.length).toBe(2);
  });
});

describe('Phone Detector', () => {
  test('detects phone numbers', () => {
    const text = 'Call me at +61 2 1234 5678';
    const spans = phoneDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0].type).toBe('PHONE');
  });

  test('detects US phone format', () => {
    const text = 'Phone: (555) 123-4567';
    const spans = phoneDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
  });

  test('does not detect measurement numbers', () => {
    const text = 'Take 400mg twice daily';
    const spans = phoneDetector.detect(text);
    expect(spans.length).toBe(0);
  });

  test('does not detect step counts', () => {
    const text = 'Walked 6234 steps today';
    const spans = phoneDetector.detect(text);
    expect(spans.length).toBe(0);
  });
});

describe('DOB Detector', () => {
  test('detects date formats', () => {
    const text = 'Born on 15/03/1990';
    const spans = dobDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0].type).toBe('DOB');
  });

  test('detects dash-separated dates', () => {
    const text = 'DOB: 25-12-1985';
    const spans = dobDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
  });
});

describe('Name Detector', () => {
  test('detects names with titles', () => {
    const text = 'Patient: John Smith';
    const spans = nameDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0].type).toBe('NAME');
  });

  test('detects capitalized names', () => {
    const text = 'Dr. Sarah Johnson visited';
    const spans = nameDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
  });
});

describe('Address Detector', () => {
  test('detects street addresses', () => {
    const text = 'Address: 123 Main Street, Melbourne';
    const spans = addressDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0].type).toBe('ADDRESS');
  });

  test('detects flat numbers', () => {
    const text = 'Flat 5B, 123 Oak Road';
    const spans = addressDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
  });
});

describe('Provider Detector', () => {
  test('detects clinic names', () => {
    const text = 'Visited Melbourne IVF Clinic';
    const spans = providerDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0].type).toBe('PROVIDER');
  });

  test('detects hospital names', () => {
    const text = 'Admitted to Royal Melbourne Hospital';
    const spans = providerDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
  });
});

describe('Appointment ID Detector', () => {
  test('detects APPT IDs', () => {
    const text = 'Appointment ID: APPT-12345';
    const spans = apptIdDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0].type).toBe('APPT_ID');
  });

  test('detects booking IDs', () => {
    const text = 'Booking: BKG-789';
    const spans = apptIdDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
  });

  test('detects invoice IDs', () => {
    const text = 'Invoice INV-456';
    const spans = apptIdDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
  });
});

describe('Insurance ID Detector', () => {
  test('detects insurance IDs', () => {
    const text = 'Insurance: BUPA-PL-123456';
    const spans = insuranceDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0].type).toBe('INSURANCE_ID');
  });

  test('detects policy numbers', () => {
    const text = 'Policy POL-789012';
    const spans = insuranceDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
  });
});

describe('Government ID Detector', () => {
  test('detects SSN format', () => {
    const text = 'SSN: 123-45-6789';
    const spans = govIdDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
    expect(spans[0].type).toBe('GOV_ID');
  });

  test('detects Aadhaar format', () => {
    const text = 'Aadhaar: 1234 5678 9012';
    const spans = govIdDetector.detect(text);
    expect(spans.length).toBeGreaterThan(0);
  });
});

describe('Health Content Preservation', () => {
  test('does not flag symptoms', () => {
    const text = 'Experiencing cramps and nausea';
    const allDetectors = [
      emailDetector, phoneDetector, nameDetector, addressDetector,
      dobDetector, providerDetector, apptIdDetector, insuranceDetector, govIdDetector
    ];
    
    let totalSpans = 0;
    for (const detector of allDetectors) {
      totalSpans += detector.detect(text).length;
    }
    expect(totalSpans).toBe(0);
  });

  test('does not flag medication dosages', () => {
    const text = 'Take 400mg of medication';
    const spans = phoneDetector.detect(text);
    expect(spans.length).toBe(0);
  });

  test('does not flag step counts', () => {
    const text = 'Walked 6234 steps';
    const spans = phoneDetector.detect(text);
    expect(spans.length).toBe(0);
  });

  test('preserves period cycle info', () => {
    const text = 'Cycle day 15, period started';
    const allDetectors = [
      emailDetector, phoneDetector, nameDetector, addressDetector,
      dobDetector, providerDetector, apptIdDetector, insuranceDetector, govIdDetector
    ];
    
    let totalSpans = 0;
    for (const detector of allDetectors) {
      totalSpans += detector.detect(text).length;
    }
    expect(totalSpans).toBe(0);
  });
});

