// Cold-email rule definitions for the inline extension.
//
// This is a snapshot, not a live import. The canonical banned-word list is
// points/banned-jargon.md at the repo root (NOT catalog/rules/catalog.json,
// which is a standalone variant that nothing in the critic path loads).
// After editing, run `node tools/jargon-coverage.mjs` to see what this file
// still misses, then rerun the build. There is no automated sync.
//
// Each rule has a detect() function that returns spans where the rule fires.
// The service worker also passes the body through Claude for the higher-order
// rules (vague-ask, missing-offer) that aren't pattern-matchable.

import type { Rule } from '../types';

export interface DetectedSpan {
  start: number;
  end: number;
  quote: string;
}

export interface DetectableRule extends Rule {
  detect: (body: string) => DetectedSpan[];
}

// Helpers
const matchAll = (body: string, pattern: RegExp): DetectedSpan[] => {
  const out: DetectedSpan[] = [];
  const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
  for (const m of body.matchAll(re)) {
    if (typeof m.index !== 'number') continue;
    out.push({ start: m.index, end: m.index + m[0].length, quote: m[0] });
  }
  return out;
};

export const COLD_EMAIL_RULES: DetectableRule[] = [
  {
    id: 'em-dash',
    name: 'Em-dash',
    description: 'Em-dashes read as AI-generated. Replace with comma, period, parens.',
    severity: 'critical',
    detect: (body) => matchAll(body, /—|--/g),
  },
  {
    id: 'not-just-x-also-y',
    name: '"Not just X, also Y" construction',
    description: 'AI tic. Cut and rewrite as one direct sentence.',
    severity: 'issue',
    detect: (body) => matchAll(body, /\bnot just\b[^.!?]{1,80}\b(also|but|it'?s)\b/gi),
  },
  {
    id: 'delve-tapestry',
    name: 'AI-tell vocabulary',
    description: 'delve, tapestry, navigate the complexities, robust solution, cutting-edge, game-changer.',
    severity: 'critical',
    detect: (body) =>
      matchAll(
        body,
        /\b(delve|tapestry|navigate the complexit|robust solution|cutting[- ]edge|game[- ]chang|transformative)\w*/gi,
      ),
  },
  {
    id: 'ai-template-opener',
    name: 'Templated opener',
    description: '"I hope this email finds you well", "My name is X", "I am writing to".',
    severity: 'critical',
    detect: (body) =>
      matchAll(
        body,
        /(I hope (this email finds you well|you are well|you'?re well)|my name is\b|I am writing to\b|I am reaching out (to|because)\b)/gi,
      ),
  },
  {
    id: 'pick-your-brain',
    name: '"Pick your brain"',
    description: 'Generic ask with no value. Offer something instead.',
    severity: 'critical',
    detect: (body) => matchAll(body, /pick (your|ur) brain/gi),
  },
  {
    id: 'grab-coffee',
    name: '"Grab coffee"',
    description: 'Default move. Make it specific to them.',
    severity: 'issue',
    detect: (body) => matchAll(body, /grab (a )?coffee/gi),
  },
  {
    id: 'consultant-jargon',
    name: 'Consultant jargon',
    description: 'leverage, align, synergize, empower, enable, drive, strategize, deliverables, utilize, impactful.',
    severity: 'issue',
    detect: (body) =>
      matchAll(
        body,
        /\b(leverag\w*|align\w*|synergiz\w*|empower\w*|enabl\w*|strategiz\w*|deliverables|utiliz\w*|incentiviz\w*|impactful)\b/gi,
      ),
  },
  {
    id: 'intersection-of',
    name: '"At the intersection of"',
    description: 'The most expensive intersection in Silicon Valley.',
    severity: 'issue',
    detect: (body) => matchAll(body, /at the intersection of|the convergence of/gi),
  },
  {
    id: 'driving-innovation',
    name: 'Brand-by-bot phrases',
    description: '"driving innovation", "building and scaling", "passionate about complex problems".',
    severity: 'critical',
    detect: (body) =>
      matchAll(
        body,
        /(driving innovation|building and scaling|passionate about (complex |hard )?problems|drawn to (complex|hard) problems|maximize impact)/gi,
      ),
  },
  {
    id: 'weak-intensifier',
    name: 'Empty intensifier',
    description: 'very, really, actually, basically, simply, clearly, obviously, literally, totally, definitely.',
    severity: 'warn',
    detect: (body) =>
      matchAll(
        body,
        /\b(very|really|actually|basically|simply|clearly|obviously|literally|totally|definitely|fundamentally)\b/gi,
      ),
  },
  {
    id: 'weak-subject-line',
    name: 'Weak subject line',
    description: '"Quick question", "Hoping to connect", "Thank you" — invisible in inboxes.',
    severity: 'issue',
    detect: (body) => {
      // Look for a Subject: line at top of body and assess it.
      const subjectMatch = body.match(/^Subject:\s*(.+)$/im);
      if (!subjectMatch || typeof subjectMatch.index !== 'number') return [];
      const subject = subjectMatch[1].trim();
      const weak = /^(Quick question|Hoping to connect|Thank you|Hello|Hi|Reaching out|Following up|Introduction)$/i;
      if (weak.test(subject)) {
        return [{ start: subjectMatch.index, end: subjectMatch.index + subjectMatch[0].length, quote: subjectMatch[0] }];
      }
      return [];
    },
  },
  {
    id: 'modern-ai-tells',
    name: 'Modern AI vocabulary',
    description: 'unlock the potential, elevate your, the landscape/realm of, a testament to, underscores, embark on a journey, ever-evolving, in todays X world, foster collaboration, harness the power, seamless, holistic, meticulous, myriad, pivotal.',
    severity: 'critical',
    detect: (body) =>
      matchAll(
        body,
        /\b(unlock\w* (the |your )?(full )?(potential|value|power|insights)|elevat(e|es|ed|ing) (your|the|our)|(the )?(landscape|realm) of|(a|is a) testament to|underscor(e|es|ed|ing) the|embark\w* on a journey|(ever|rapidly)[- ]evolving|stands as a|in today'?s [a-z-]+ world|foster\w* (a |an |the )?(collaboration|innovation|culture|community|growth|environment)|harness\w* (the )?(power|potential|strength|capabilit\w+)|seamless\w*|holistic\w*|meticulous\w*|myriad|pivotal|paradigm)\b/gi,
      ),
  },
  {
    id: 'consultant-filler',
    name: 'Consultant filler',
    description: 'circle back, touch base, low-hanging fruit, move the needle, boil the ocean, table stakes, best-in-class, double-click on.',
    severity: 'issue',
    detect: (body) =>
      matchAll(
        body,
        /\b(circle back|touch base|sync up|low[- ]hanging fruit|move the needle|boil the ocean|table stakes|best[- ]in[- ]class|double[- ]click on)\b/gi,
      ),
  },
];

// Length check — single function, not a span-detector.
export const LENGTH_LIMIT_WORDS = 200;

export function countWords(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}
