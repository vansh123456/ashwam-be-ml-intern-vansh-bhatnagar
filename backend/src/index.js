/**
 * Express API server
 * Provides POST /scrub endpoint for PII scrubbing
 */
const express = require('express');
const multer = require('multer');
const { readJSONL, writeJSONL } = require('./utils/jsonl');
const { scrub } = require('./scrubber');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads (memory storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Middleware
app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

/**
 * POST /scrub
 * Accepts JSONL file upload and returns scrubbed results
 */
app.post('/scrub', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileContent = req.file.buffer.toString('utf8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    const results = [];
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const entry = JSON.parse(line);
        const entryId = entry.entry_id || entry.id || `entry_${i + 1}`;
        const text = entry.text || entry.content || '';
        
        // Scrub the text
        const scrubbed = scrub(text, entryId);
        results.push(scrubbed);
      } catch (parseError) {
        // Skip invalid JSON lines
        console.warn(`Skipping invalid JSON line ${i + 1}`);
      }
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: 'v1' });
});

// Start server
app.listen(PORT, () => {
  console.log(`PII Scrubber API server running on port ${PORT}`);
});

module.exports = app;

