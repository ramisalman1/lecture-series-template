#!/usr/bin/env node

/**
 * Migration script: Convert blockquote metadata to YAML frontmatter.
 * Run once: node migrate-frontmatter.js
 */

const fs = require('fs');
const path = require('path');

const lecturesDir = path.join(__dirname, 'content', 'lectures');

const files = fs.readdirSync(lecturesDir).filter(f => f.endsWith('.md')).sort();

let migrated = 0;
let skipped = 0;

files.forEach(file => {
  const filePath = path.join(lecturesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if already has YAML frontmatter (starts with ---)
  if (/^---\s*\n(?![\s]*>)/.test(content.trim())) {
    console.log(`  ⏭  ${file} — already has YAML frontmatter`);
    skipped++;
    return;
  }

  // Extract metadata from blockquote format
  // Pattern: optional whitespace, ---, blockquote lines, ---
  const metaMatch = content.match(
    /^\s*---\s*\n([\s\S]*?)\n\s*---/
  );

  if (!metaMatch) {
    console.log(`  ⚠️  ${file} — no metadata block found`);
    skipped++;
    return;
  }

  const metaBlock = metaMatch[1];
  const afterMeta = content.slice(metaMatch.index + metaMatch[0].length);

  // Parse blockquote lines
  const lines = metaBlock.split('\n').filter(l => l.trim().startsWith('>'));

  let series = '';
  let number = '';
  let topic = '';
  let speaker = '';
  let youtube = '';

  lines.forEach(line => {
    // Remove > prefix and clean up
    const clean = line.replace(/^>\s*/, '').trim();

    const seriesMatch = clean.match(/\*\*السلسلة:\*\*\s*(.+)/);
    if (seriesMatch) series = seriesMatch[1].trim();

    const numMatch = clean.match(/\*\*رقم المحاضرة:\*\*\s*(.+)/);
    if (numMatch) number = numMatch[1].trim();

    const topicMatch = clean.match(/\*\*الموضوع:\*\*\s*(.+)/);
    if (topicMatch) topic = topicMatch[1].trim();

    const speakerMatch = clean.match(/\*\*المحاضر:\*\*\s*(.+)/);
    if (speakerMatch) speaker = speakerMatch[1].trim();

    const sourceMatch = clean.match(/\*\*المصدر:\*\*\s*\[.*?\]\((.*?)\)/);
    if (sourceMatch) youtube = sourceMatch[1].trim();
  });

  // Build YAML frontmatter
  const yamlLines = ['---'];
  if (series) yamlLines.push(`series: "${series}"`);
  if (number) yamlLines.push(`number: ${parseInt(number, 10)}`);
  if (topic) yamlLines.push(`topic: "${topic.replace(/"/g, '\\"')}"`);
  if (speaker) yamlLines.push(`speaker: "${speaker}"`);
  if (youtube) yamlLines.push(`youtube: "${youtube}"`);
  yamlLines.push('---');

  const newContent = yamlLines.join('\n') + afterMeta;

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`  ✅ ${file} — migrated (lecture ${number})`);
  migrated++;
});

console.log(`\n📊 Done: ${migrated} migrated, ${skipped} skipped`);
