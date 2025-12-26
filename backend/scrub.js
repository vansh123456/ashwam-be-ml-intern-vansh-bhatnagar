#!/usr/bin/env node
/**
 * CLI script for PII scrubbing
 * Usage: npm run scrub input=./journals.jsonl output=./scrubbed.jsonl
 */
const { readJSONL, createJSONLWriter } = require('./src/utils/jsonl');
const { scrub } = require('./src/scrubber');
const path = require('path');

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let inputPath = null;
  let outputPath = null;
  
  for (const arg of args) {
    if (arg.startsWith('input=')) {
      inputPath = arg.substring(6);
    } else if (arg.startsWith('output=')) {
      outputPath = arg.substring(7);
    }
  }
  
  if (!inputPath || !outputPath) {
    console.error('Usage: npm run scrub input=./journals.jsonl output=./scrubbed.jsonl');
    process.exit(1);
  }
  
  // Resolve paths
  const resolvedInput = path.resolve(inputPath);
  const resolvedOutput = path.resolve(outputPath);
  
  console.log(`Reading from: ${resolvedInput}`);
  console.log(`Writing to: ${resolvedOutput}`);
  
  try {
    // Create output writer
    const writer = createJSONLWriter(resolvedOutput);
    let processedCount = 0;
    
    // Process each entry
    for await (const entry of readJSONL(resolvedInput)) {
      const entryId = entry.entry_id || entry.id || `entry_${processedCount + 1}`;
      const text = entry.text || entry.content || '';
      
      // Scrub the text
      const scrubbed = scrub(text, entryId);
      
      // Write result
      await writer.write(scrubbed);
      processedCount++;
      
      // Log progress (without PII)
      if (processedCount % 100 === 0) {
        console.log(`Processed ${processedCount} entries...`);
      }
    }
    
    // Close writer
    await writer.end();
    
    console.log(`\nCompleted! Processed ${processedCount} entries.`);
    console.log(`Output written to: ${resolvedOutput}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

