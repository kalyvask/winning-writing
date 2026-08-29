#!/usr/bin/env node
// Reports how well the code-side banned-word lists cover the canonical list.
//
// Source of truth: points/banned-jargon.md. Everything else is a derived copy
// that exists because a different runtime needs the terms in a different shape:
//
//   ui/data.js                            offline Draft Critic (no API, regex highlighter)
//   inline-coach/src/lib/rules/cold-email.ts   Vite/TS extension bundle
//   catalog/rules/catalog.json            standalone mode-tagged variant
//
// Those copies cannot simply import the markdown, so they drift. This script
// makes the drift visible instead of silent.
//
// Usage:
//   node tools/jargon-coverage.mjs           # report
//   node tools/jargon-coverage.mjs --strict  # exit 1 if any CORE term is uncovered
//
// CORE terms are derived, not hand-listed: they are the terms the canonical file
// marks as AI tells, which are the ones every surface is expected to catch.

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');

const CANONICAL = 'points/banned-jargon.md';
const SURFACES = [
  'ui/data.js',
  'inline-coach/src/lib/rules/cold-email.ts',
  'catalog/rules/catalog.json',
];

// Pull bolded terms out of the markdown bullets: - **term** or - **"term"**
function parseCanonical(md) {
  const terms = new Map(); // term -> section
  let section = '';
  for (const line of md.split('\n')) {
    const h = line.match(/^#{2,3}\s+(.*)/);
    if (h) section = h[1].trim();
    const m = line.match(/^\s*-\s+\*\*(.+?)\*\*/);
    if (!m) continue;
    let t = m[1].replace(/["“”]/g, '').trim();
    // Keep the first alternative of "x / y" and drop trailing parentheticals
    t = t.split('/')[0].split('(')[0].trim().toLowerCase();
    if (t.length < 3 || t.length > 28) continue;
    if (!terms.has(t)) terms.set(t, section);
  }
  return terms;
}

const md = await readFile(join(repoRoot, CANONICAL), 'utf-8');
const canonical = parseCanonical(md);
const core = [...canonical].filter(([, s]) => /ai tell/i.test(s)).map(([t]) => t);

const bodies = {};
for (const s of SURFACES) {
  try {
    bodies[s] = (await readFile(join(repoRoot, s), 'utf-8')).toLowerCase();
  } catch {
    bodies[s] = null;
  }
}

console.log(`Canonical: ${CANONICAL} — ${canonical.size} terms (${core.length} tagged as AI tells)\n`);

let coreGaps = 0;
const pad = Math.max(...SURFACES.map((s) => s.length));

for (const s of SURFACES) {
  const body = bodies[s];
  if (body === null) {
    console.log(`${s.padEnd(pad)}  (not found — skipped)`);
    continue;
  }
  const covered = [...canonical.keys()].filter((t) => body.includes(t));
  const missingCore = core.filter((t) => !body.includes(t));
  coreGaps += missingCore.length;
  const pct = Math.round((covered.length / canonical.size) * 100);
  console.log(`${s.padEnd(pad)}  ${covered.length}/${canonical.size} terms (${pct}%)   AI-tell gaps: ${missingCore.length}`);
  if (missingCore.length) console.log(`${' '.repeat(pad)}  missing: ${missingCore.slice(0, 12).join(', ')}${missingCore.length > 12 ? ', …' : ''}`);
}

console.log(
  `\nNote: partial coverage is expected — each surface scopes to its own use case.\n` +
    `Total coverage is not the goal; the AI-tell gaps are what matter.
` +
    `This check does literal substring matching, so a term implemented as a regex
` +
    `(e.g. /in today's [a-z-]+ world/) reads as a gap even when it is covered.
` +
    `Confirm against the source before acting on a multi-word gap.`
);

if (strict && coreGaps > 0) {
  console.error(`\nFAIL (--strict): ${coreGaps} AI-tell term(s) uncovered across surfaces.`);
  process.exit(1);
}
