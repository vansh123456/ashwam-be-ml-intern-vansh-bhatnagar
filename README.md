# Ashwam PII Scrubber - Backend

Node.js + Express backend for detecting and scrubbing Personally Identifiable Information (PII) from journal entries.

## Features

### Core Functionality
- ✅ **9 PII Type Detectors**: EMAIL, PHONE, NAME, ADDRESS, DOB, PROVIDER, APPT_ID, INSURANCE_ID, GOV_ID
- ✅ **Deterministic Rule-Based Logic**: No ML dependencies, pure regex and heuristics
- ✅ **Health Content Preservation**: Preserves symptoms, medications, vitals, and generic numbers
- ✅ **Overlap Resolution**: Priority-based system to handle conflicting detections
- ✅ **Structured JSON Output**: Complete audit trail with character offsets and confidence scores
- ✅ **Dual Interface**: REST API and CLI support

### API Endpoints
- `POST /scrub` - Process JSONL file and return scrubbed results
- `GET /health` - Health check endpoint

### CLI Tool
- Command-line interface for batch processing
- Streaming JSONL read/write for large datasets
- Progress logging

## Prerequisites

- Node.js 18+ and npm

## Installation
- After cloning the repo just run npm install
- for backend we do npm run start
- for fronted npm run dev
- Open the localhost in your machine
- Backend API file usage: npm run scrub input=../journals.jsonl output=../scrubbed.jsonl

### API Server

npm startServer runs on `http://localhost:3000` by default (configurable via `PORT` env variable).

### CLI Tool

npm run scrub input=./journals.jsonl output=./scrubbed.jsonl## PII Types Detected

1. **EMAIL** - Email addresses (regex pattern)
2. **PHONE** - Phone numbers in AU/US/IN formats
3. **NAME** - Person names (heuristic: capitalized words, titles)
4. **ADDRESS** - Street addresses, flat numbers, postal codes
5. **DOB** - Date of birth (DD/MM/YYYY, DD-MM-YYYY formats)
6. **PROVIDER** - Clinic/hospital/lab names (keyword matching)
7. **APPT_ID** - Appointment/Booking/Invoice IDs (APPT-*, BKG-*, INV-*)
8. **INSURANCE_ID** - Insurance policy numbers (BUPA-PL-*, POL-*, etc.)
9. **GOV_ID** - Government IDs (SSN, Aadhaar, Medicare formats)

## Output Format
son
{
  "entry_id": "j_001",
  "scrubbed_text": "[NAME], DOB: [DOB], Email: [EMAIL]",
  "detected_spans": [
    {
      "type": "EMAIL",
      "start": 45,
      "end": 61,
      "confidence": 1.0
    }
  ],
  "types_found": ["NAME", "DOB", "EMAIL"],
  "scrubber_version": "v1"
}## Health Content Preservation

The scrubber is designed to **preserve all health-related information**:
- ✅ Symptoms: "cramps", "nausea", "headache"
- ✅ Medications: "400mg", "ibuprofen"
- ✅ Vitals: "BP 120/80", "Weight 63.4kg"
- ✅ Step counts: "6234 steps"
- ✅ Cycle info: "Day 2 of period", "Cycle day 15"

## Implementation Details

### Overlap Resolution Priority

When multiple PII types overlap, the system uses a priority order:
1. EMAIL (priority 9)
2. PHONE (priority 8)
3. APPT_ID (priority 7)
4. GOV_ID (priority 6)
5. INSURANCE_ID (priority 5)
6. PROVIDER (priority 4)
7. NAME (priority 3)
8. ADDRESS (priority 2)
9. DOB (priority 1)

**Tradeoff**: Higher priority types take precedence. For example, if "john@example.com" is detected, the EMAIL span is kept and the NAME span for "john" is dropped. This avoids double-flagging and keeps output clean, but means we lose granular NAME annotations when they overlap with more specific identifiers.

### Context-Aware Phone Detection (Tricky Case)

One of the most challenging cases is distinguishing phone numbers from health measurements. The phone detector uses context-aware filtering:

**Problem**: Numbers like "6234" or "400mg" could match phone number patterns.

**Solution**: The detector checks surrounding context:
- Skips numbers followed by "steps" or "step"
- Skips numbers followed by measurement units ("mg", "ml", "g", "kg", "lb")
- Skips numbers that are part of measurements (letters immediately adjacent)
