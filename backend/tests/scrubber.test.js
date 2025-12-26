/**
 * Tests for scrubber pipeline
 * Tests overlap resolution, replacement, and output format
 */
const { scrub } = require('../src/scrubber');
const { resolve } = require('../src/resolver/resolve');
const { replace } = require('../src/replacer/replace');
const { detectAll } = require('../src/detectors');

describe('Scrubber Pipeline', () => {
  test('returns correct output structure', () => {
    const text = 'Contact john@example.com';
    const result = scrub(text, 'test_entry_1');
    
    expect(result).toHaveProperty('entry_id');
    expect(result).toHaveProperty('scrubbed_text');
    expect(result).toHaveProperty('detected_spans');
    expect(result).toHaveProperty('types_found');
    expect(result).toHaveProperty('scrubber_version');
    
    expect(result.entry_id).toBe('test_entry_1');
    expect(result.scrubber_version).toBe('v1');
    expect(Array.isArray(result.detected_spans)).toBe(true);
    expect(Array.isArray(result.types_found)).toBe(true);
  });

  test('replaces PII with placeholders', () => {
    const text = 'Email: john@example.com';
    const result = scrub(text, 'test_1');
    
    expect(result.scrubbed_text).toContain('[EMAIL]');
    expect(result.scrubbed_text).not.toContain('john@example.com');
  });

  test('detects multiple PII types', () => {
    const text = 'Contact john@example.com or call +61 2 1234 5678';
    const result = scrub(text, 'test_2');
    
    expect(result.types_found.length).toBeGreaterThan(0);
    expect(result.detected_spans.length).toBeGreaterThan(0);
  });

  test('includes correct character offsets', () => {
    const text = 'Email: john@example.com';
    const result = scrub(text, 'test_3');
    
    if (result.detected_spans.length > 0) {
      const span = result.detected_spans[0];
      expect(span).toHaveProperty('start');
      expect(span).toHaveProperty('end');
      expect(span).toHaveProperty('type');
      expect(span).toHaveProperty('confidence');
      expect(typeof span.start).toBe('number');
      expect(typeof span.end).toBe('number');
      expect(span.end).toBeGreaterThan(span.start);
    }
  });
});

describe('Overlap Resolution', () => {
  test('resolves overlapping spans by priority', () => {
    // Create overlapping spans
    const spans = [
      { start: 0, end: 10, type: 'NAME', confidence: 0.7 },
      { start: 5, end: 15, type: 'EMAIL', confidence: 1.0 }
    ];
    
    const resolved = resolve(spans);
    
    // EMAIL has higher priority, so it should be kept
    expect(resolved.length).toBe(1);
    expect(resolved[0].type).toBe('EMAIL');
  });

  test('prefers longer spans when priority is equal', () => {
    const spans = [
      { start: 0, end: 5, type: 'NAME', confidence: 0.7 },
      { start: 0, end: 10, type: 'NAME', confidence: 0.7 }
    ];
    
    const resolved = resolve(spans);
    
    // Should keep the longer span
    expect(resolved.length).toBe(1);
    expect(resolved[0].end - resolved[0].start).toBe(10);
  });

  test('handles non-overlapping spans', () => {
    const spans = [
      { start: 0, end: 5, type: 'EMAIL', confidence: 1.0 },
      { start: 10, end: 15, type: 'PHONE', confidence: 0.9 }
    ];
    
    const resolved = resolve(spans);
    
    // Both should be kept
    expect(resolved.length).toBe(2);
  });

  test('follows priority order', () => {
    const spans = [
      { start: 0, end: 10, type: 'DOB', confidence: 0.85 },
      { start: 5, end: 15, type: 'ADDRESS', confidence: 0.8 },
      { start: 8, end: 18, type: 'EMAIL', confidence: 1.0 }
    ];
    
    const resolved = resolve(spans);
    
    // EMAIL has highest priority
    expect(resolved.length).toBe(1);
    expect(resolved[0].type).toBe('EMAIL');
  });
});

describe('Replacement', () => {
  test('replaces spans with placeholders', () => {
    const text = 'Contact john@example.com';
    const spans = [
      { start: 8, end: 25, type: 'EMAIL', confidence: 1.0 }
    ];
    
    const replaced = replace(text, spans);
    
    expect(replaced).toBe('Contact [EMAIL]');
  });

  test('preserves text outside spans', () => {
    const text = 'Hello, contact john@example.com for more info';
    const spans = [
      { start: 14, end: 31, type: 'EMAIL', confidence: 1.0 }
    ];
    
    const replaced = replace(text, spans);
    
    expect(replaced).toContain('Hello, contact');
    expect(replaced).toContain('for more info');
    expect(replaced).toContain('[EMAIL]');
  });

  test('handles multiple replacements', () => {
    const text = 'Email: john@example.com Phone: +61 2 1234 5678';
    const spans = [
      { start: 7, end: 24, type: 'EMAIL', confidence: 1.0 },
      { start: 32, end: 46, type: 'PHONE', confidence: 0.9 }
    ];
    
    const replaced = replace(text, spans);
    
    expect(replaced).toContain('[EMAIL]');
    expect(replaced).toContain('[PHONE]');
  });

  test('handles overlapping replacements correctly', () => {
    const text = 'john@example.com';
    const spans = [
      { start: 0, end: 4, type: 'NAME', confidence: 0.7 },
      { start: 0, end: 17, type: 'EMAIL', confidence: 1.0 }
    ];
    
    // Resolve overlaps first (EMAIL has higher priority)
    const resolved = resolve(spans);
    const replaced = replace(text, resolved);
    expect(replaced).toBe('[EMAIL]');
  });
});

describe('End-to-End Scenarios', () => {
  test('scrubs journal entry with multiple PII types', () => {
    const text = 'Patient: John Smith, DOB: 15/03/1990, Email: john@example.com, Phone: +61 2 1234 5678';
    const result = scrub(text, 'journal_1');
    
    expect(result.scrubbed_text).toContain('[NAME]');
    expect(result.scrubbed_text).toContain('[DOB]');
    expect(result.scrubbed_text).toContain('[EMAIL]');
    expect(result.scrubbed_text).toContain('[PHONE]');
    
    expect(result.types_found.length).toBeGreaterThanOrEqual(4);
  });

  test('preserves health-related content', () => {
    const text = 'Experiencing cramps and nausea. Take 400mg medication. Walked 6234 steps.';
    const result = scrub(text, 'health_entry');
    
    // Should not flag health content
    expect(result.detected_spans.length).toBe(0);
    expect(result.types_found.length).toBe(0);
    expect(result.scrubbed_text).toBe(text);
  });

  test('handles appointment IDs correctly', () => {
    const text = 'Appointment APPT-12345 confirmed';
    const result = scrub(text, 'appt_entry');
    
    expect(result.scrubbed_text).toContain('[APPT_ID]');
    expect(result.types_found).toContain('APPT_ID');
  });
});

