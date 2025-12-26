/**
 * JSONL utilities for streaming read/write
 */
const fs = require('fs');
const { Readable } = require('stream');

/**
 * Read JSONL file line by line
 * @param {string} filePath - Path to JSONL file
 * @returns {AsyncGenerator} Yields parsed JSON objects
 */
async function* readJSONL(filePath) {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  let buffer = '';
  
  for await (const chunk of fileStream) {
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep incomplete line in buffer
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed) {
        try {
          yield JSON.parse(trimmed);
        } catch (err) {
          // Skip invalid JSON lines
          console.warn(`Skipping invalid JSON line: ${trimmed.substring(0, 50)}...`);
        }
      }
    }
  }
  
  // Process remaining buffer
  if (buffer.trim()) {
    try {
      yield JSON.parse(buffer.trim());
    } catch (err) {
      // Skip invalid JSON line
    }
  }
}

/**
 * Write JSONL file
 * @param {string} filePath - Path to output JSONL file
 * @param {Array} entries - Array of objects to write
 */
async function writeJSONL(filePath, entries) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
    
    writeStream.on('error', reject);
    writeStream.on('finish', resolve);
    
    for (const entry of entries) {
      const line = JSON.stringify(entry) + '\n';
      writeStream.write(line);
    }
    
    writeStream.end();
  });
}

/**
 * Stream write JSONL file entry by entry
 * @param {string} filePath - Path to output JSONL file
 * @returns {Object} Object with write method
 */
function createJSONLWriter(filePath) {
  const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
  
  return {
    write: (entry) => {
      const line = JSON.stringify(entry) + '\n';
      return new Promise((resolve, reject) => {
        writeStream.write(line, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    },
    end: () => {
      return new Promise((resolve, reject) => {
        writeStream.end((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  };
}

module.exports = { readJSONL, writeJSONL, createJSONLWriter };

