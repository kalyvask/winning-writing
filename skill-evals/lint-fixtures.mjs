#!/usr/bin/env node
// Deterministic, API-free fixture lint for skill-evals. Runs in CI on every
// change; the paid eval (runner.ts) is opt-in.
//
// Checks:
//   - every fixtures/<skill>/*.json parses and is an array
//   - every fixture has a unique id, a known skill, and exactly one expectation family
//   - the skill it names resolves to a SKILL.md in this repo
//   - for the catalog skill: must_flag_rule names a rule id in catalog/rules/catalog.json
//     and mode names a mode in catalog/rules/modes.json
//
// Usage (from skill-evals/ or the repo root):
//   node skill-evals/lint-fixtures.mjs
// Exit 0 when clean, 1 when any problem is found.

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const fixturesDir = join(here, 'fixtures');

// Keep in sync with REPO_SKILL_PATHS in runner.ts.
const REPO_SKILL_PATHS = {
  'winning-writing': 'catalog',
  'cold-email': 'skills/cold-email-coach',
};

const POSITIVE_KEYS = ['must_flag_rule', 'phrase_in_output', 'phrases_in_output', 'section_present'];
const NEGATIVE_KEYS = ['must_NOT_flag_rule', 'phrase_NOT_in_output'];

const problems = [];
function problem(where, msg) {
  problems.push(`${where}: ${msg}`);
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

const catalog = JSON.parse(await readFile(join(repoRoot, 'catalog', 'rules', 'catalog.json'), 'utf-8'));
const modes = JSON.parse(await readFile(join(repoRoot, 'catalog', 'rules', 'modes.json'), 'utf-8'));
const ruleIds = new Set(catalog.rules.map((r) => r.id));
const modeNames = new Set(Object.keys(modes.modes));

for (const [skill, rel] of Object.entries(REPO_SKILL_PATHS)) {
  if (!(await exists(join(repoRoot, rel, 'SKILL.md')))) {
    problem(`REPO_SKILL_PATHS`, `skill "${skill}" points at ${rel}/SKILL.md which does not exist`);
  }
}

const seenIds = new Map();
let fixtureCount = 0;
const skillDirs = (await readdir(fixturesDir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);

for (const skillDir of skillDirs) {
  if (!(skillDir in REPO_SKILL_PATHS)) {
    problem(`fixtures/${skillDir}`, `no skill named "${skillDir}" in this repo (known: ${Object.keys(REPO_SKILL_PATHS).join(', ')}); the runner would fail every fixture in it`);
    continue;
  }
  const files = (await readdir(join(fixturesDir, skillDir))).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const where = `fixtures/${skillDir}/${file}`;
    let parsed;
    try {
      parsed = JSON.parse(await readFile(join(fixturesDir, skillDir, file), 'utf-8'));
    } catch (err) {
      problem(where, `invalid JSON: ${err.message}`);
      continue;
    }
    if (!Array.isArray(parsed)) {
      problem(where, 'top level is not an array');
      continue;
    }
    parsed.forEach((f, i) => {
      fixtureCount++;
      const loc = `${where}[${i}]${f && f.id ? ` (${f.id})` : ''}`;
      if (!f || typeof f !== 'object') return problem(loc, 'fixture is not an object');
      if (typeof f.id !== 'string' || !f.id) problem(loc, 'missing id');
      else if (seenIds.has(f.id)) problem(loc, `duplicate id (first seen in ${seenIds.get(f.id)})`);
      else seenIds.set(f.id, where);
      if (f.skill !== skillDir) problem(loc, `skill "${f.skill}" does not match its directory "${skillDir}"`);
      if (typeof f.input !== 'string' || !f.input.trim()) problem(loc, 'missing input');
      const expect = f.expect && typeof f.expect === 'object' ? f.expect : null;
      if (!expect) return problem(loc, 'missing expect');
      const pos = POSITIVE_KEYS.filter((k) => k in expect);
      const neg = NEGATIVE_KEYS.filter((k) => k in expect);
      if (pos.length && neg.length) problem(loc, `mixes positive (${pos.join(',')}) and negative (${neg.join(',')}) expectations`);
      if (!pos.length && !neg.length) problem(loc, 'declares no expectation');
      const unknown = Object.keys(expect).filter((k) => !POSITIVE_KEYS.includes(k) && !NEGATIVE_KEYS.includes(k));
      if (unknown.length) problem(loc, `unknown expect keys: ${unknown.join(', ')}`);
      if (skillDir === 'winning-writing') {
        if (typeof expect.must_flag_rule === 'string' && !ruleIds.has(expect.must_flag_rule)) {
          problem(loc, `must_flag_rule "${expect.must_flag_rule}" is not a rule id in catalog/rules/catalog.json`);
        }
        if (f.mode !== undefined && !modeNames.has(f.mode)) {
          problem(loc, `mode "${f.mode}" is not defined in catalog/rules/modes.json`);
        }
      }
    });
  }
}

if (problems.length) {
  for (const p of problems) console.error(`ERROR ${p}`);
  console.error(`\n${problems.length} problem(s) across ${fixtureCount} fixture(s).`);
  process.exit(1);
}
console.log(`Fixtures OK: ${fixtureCount} fixture(s) in ${skillDirs.length} skill dir(s); ${ruleIds.size} catalog rules, ${modeNames.size} modes.`);
