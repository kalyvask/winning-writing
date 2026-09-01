// Background service worker. Holds the Anthropic API key (in chrome.storage.local),
// receives messages from the content scripts, and makes the actual Anthropic
// calls. Content scripts never see the API key directly — privacy invariant.
//
// Three message types:
//   - critique: span-level rule flags + a one-line takeaway
//   - checklist: the model-backed half of the pre-send checklist
//   - connectionAngle: top 3 "like you" hooks based on recipient hints

import Anthropic from '@anthropic-ai/sdk';
import { getSenderProfile } from '../lib/sender-profile';
import { COLD_EMAIL_RULES, countWords, LENGTH_LIMIT_WORDS } from '../lib/rules/cold-email';
import type {
  ChecklistRequest,
  ChecklistResponse,
  ConnectionAngleRequest,
  ConnectionAngleResponse,
  CritiqueRequest,
  CritiqueResponse,
  Flag,
  ServiceWorkerRequest,
  ServiceWorkerResponse,
} from '../lib/types';

const STORE_KEY = 'gmail-writing-coach.apikey';
const MODEL_KEY = 'gmail-writing-coach.model';
const DEFAULT_MODEL = 'claude-sonnet-4-6';

async function getApiKey(): Promise<string | null> {
  const r = await chrome.storage.local.get([STORE_KEY]);
  return r[STORE_KEY] ?? null;
}

async function getModel(): Promise<string> {
  const r = await chrome.storage.local.get([MODEL_KEY]);
  return r[MODEL_KEY] ?? DEFAULT_MODEL;
}

function clientOrError(apiKey: string | null): Anthropic | { error: string } {
  if (!apiKey) {
    return { error: 'No Anthropic API key set. Open the extension options to add one.' };
  }
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

// --- Critique ---
//
// The content script already ran the regex-based detectors locally. We send
// the body to Claude for the higher-order rules (missing-offer, picks-too-
// many-lanes, show-dont-tell, vague-ask) that aren't pattern-matchable. The
// model returns JSON; we merge with the local flags.

const CRITIQUE_SYSTEM = `You are a cold-email critic for the sender described in the profile above. You catch the higher-order failure modes that regex cannot: vague ask, missing offer, "like you" not being specific, story with no scene, picks-too-many-lanes (resume dump), flattery-opener (recapping the recipient's accomplishments), self-diminishing ("like you but at a smaller scale").

Return STRICT JSON. No commentary outside the JSON.

Schema:
{
  "takeaway": "<1-2 sentences naming the single biggest issue>",
  "flags": [
    {
      "ruleId": "<one of: vague-ask | missing-offer | picks-too-many-lanes | show-dont-tell | flattery-opener | self-diminishing | weak-subject>",
      "ruleName": "<human-readable label>",
      "severity": "<critical | issue | warn>",
      "quote": "<exact substring from the body>",
      "suggestion": "<concrete rewrite>",
      "why": "<one sentence: what the rule says, why the quote breaks it>"
    }
  ]
}

If the draft is clean on these dimensions, return an empty flags array and say so in takeaway.`;

async function runCritique(req: CritiqueRequest): Promise<CritiqueResponse> {
  const apiKey = await getApiKey();
  const result = clientOrError(apiKey);
  if ('error' in result) return { ok: false, error: result.error };
  const client = result;
  const model = await getModel();

  // Local span-detection. These are deterministic and fast; we don't need Claude.
  const localFlags: Flag[] = [];
  for (const rule of COLD_EMAIL_RULES) {
    const spans = rule.detect(req.body);
    for (const span of spans) {
      localFlags.push({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        span: { start: span.start, end: span.end },
        quote: span.quote,
        suggestion: '',
        why: rule.description,
      });
    }
  }
  // Length check.
  const wc = countWords(req.body);
  if (wc > LENGTH_LIMIT_WORDS && req.surface === 'gmail') {
    localFlags.push({
      ruleId: 'length-200',
      ruleName: 'Over 200 words',
      severity: 'issue',
      span: null,
      quote: '',
      suggestion: 'Pick one lane and cut the others.',
      why: `Current draft is ${wc} words. Cold emails over ${LENGTH_LIMIT_WORDS} don't get read.`,
    });
  }

  // Higher-order check via Claude.
  const userMessage = `Surface: ${req.surface}
Recipient: ${req.recipient.toName || '(unknown)'} ${req.recipient.toEmail ? `<${req.recipient.toEmail}>` : ''} ${req.recipient.linkedinUrl || ''}
Recipient notes: ${req.recipient.notes || '(none)'}

Body:
${req.body}

Return the JSON.`;

  let takeaway = '';
  let modelFlags: Flag[] = [];
  const senderProfile = await getSenderProfile();
  try {
    const response = await client.messages.create({
      model,
      max_tokens: 1500,
      system: [
        { type: 'text', text: senderProfile, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: CRITIQUE_SYSTEM },
      ],
      messages: [{ role: 'user', content: userMessage }],
    });
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    const parsed = parseCritiqueJson(text);
    takeaway = parsed.takeaway;
    modelFlags = parsed.flags;
  } catch (err) {
    return { ok: false, error: `Anthropic API: ${(err as Error).message}` };
  }

  return {
    ok: true,
    flags: dedupeFlags([...localFlags, ...modelFlags]),
    wordCount: wc,
    takeaway,
  };
}

function dedupeFlags(flags: Flag[]): Flag[] {
  const seen = new Set<string>();
  const out: Flag[] = [];
  for (const f of flags) {
    const key = `${f.ruleId}:${f.span?.start ?? -1}:${f.quote}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  // Sort: critical first, then issue, then warn; within each by quote position.
  const sevRank = { critical: 0, issue: 1, warn: 2 } as const;
  out.sort((a, b) => {
    const sevDiff = sevRank[a.severity] - sevRank[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return (a.span?.start ?? Infinity) - (b.span?.start ?? Infinity);
  });
  return out;
}

function parseCritiqueJson(text: string): { takeaway: string; flags: Flag[] } {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const objMatch = candidate.match(/\{[\s\S]*\}/);
  if (!objMatch) return { takeaway: '', flags: [] };
  try {
    const obj = JSON.parse(objMatch[0]);
    return {
      takeaway: typeof obj.takeaway === 'string' ? obj.takeaway : '',
      flags: Array.isArray(obj.flags)
        ? obj.flags.map((f: Partial<Flag>): Flag => ({
            ruleId: f.ruleId ?? 'unknown',
            ruleName: f.ruleName ?? f.ruleId ?? 'unknown',
            severity: f.severity ?? 'issue',
            quote: f.quote ?? '',
            suggestion: f.suggestion ?? '',
            why: f.why ?? '',
            span: null,
          }))
        : [],
    };
  } catch {
    return { takeaway: '', flags: [] };
  }
}

// --- Checklist ---
//
// The deterministic part of the checklist runs in the content script. Here
// we only handle the model-backed half: "opens with something they don't
// know", "like you is specific", "story has a scene", "picks one lane".

const CHECKLIST_SYSTEM = `You evaluate a cold-email draft against four criteria. Each is pass/fail with a one-line detail.

Return STRICT JSON. Schema:
{
  "items": [
    { "id": "something-they-dont-know", "pass": <bool>, "detail": "<one short sentence>" },
    { "id": "like-you-move", "pass": <bool>, "detail": "<one short sentence>" },
    { "id": "story-with-scene", "pass": <bool>, "detail": "<one short sentence>" },
    { "id": "picks-one-lane", "pass": <bool>, "detail": "<one short sentence>" }
  ]
}`;

async function runChecklist(req: ChecklistRequest): Promise<ChecklistResponse> {
  const apiKey = await getApiKey();
  const result = clientOrError(apiKey);
  if ('error' in result) return { ok: false, error: result.error };
  const client = result;
  const model = await getModel();

  const userMessage = `Surface: ${req.surface}
Recipient: ${req.recipient.toName || '(unknown)'}

Body:
${req.body}

Return the JSON.`;

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 600,
      system: CHECKLIST_SYSTEM,
      messages: [{ role: 'user', content: userMessage }],
    });
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (!objMatch) return { ok: false, error: 'Model did not return JSON.' };
    const obj = JSON.parse(objMatch[0]);
    const items = (Array.isArray(obj.items) ? obj.items : []).map((it: { id: string; pass: boolean; detail: string }) => ({
      id: it.id,
      label: it.id, // panel maps id -> label
      pass: !!it.pass,
      detail: it.detail ?? '',
    }));
    return {
      ok: true,
      items,
      passCount: items.filter((i: { pass: boolean }) => i.pass).length,
      totalCount: items.length,
    };
  } catch (err) {
    return { ok: false, error: `Anthropic API: ${(err as Error).message}` };
  }
}

// --- Connection angles ---

const CONNECTION_SYSTEM = `You find specific, genuine "like you" connection angles between the sender (see profile above) and the recipient. If the profile is the unfilled template, return an empty angles array rather than inventing biography. Rank top 3 by leverage.

Categories from highest leverage to lowest:
1. Unusual / coincidental detail (same hobby, same year in same city, same uncommon experience)
2. Career parallel
3. Shared value or principle
4. Shared geography or institution (if small enough to be meaningful)

Return STRICT JSON. Schema:
{
  "angles": [
    { "headline": "<short noun phrase>", "detail": "<one sentence the sender can paraphrase into the email>" }
  ]
}

If you don't have enough info to find a genuine angle, return an empty angles array.`;

async function runConnectionAngle(req: ConnectionAngleRequest): Promise<ConnectionAngleResponse> {
  const apiKey = await getApiKey();
  const result = clientOrError(apiKey);
  if ('error' in result) return { ok: false, error: result.error };
  const client = result;
  const model = await getModel();

  const userMessage = `Recipient: ${req.recipient.toName || '(unknown)'} ${req.recipient.toEmail || ''} ${req.recipient.linkedinUrl || ''}
Recipient notes: ${req.recipient.notes || '(none)'}

Return the JSON.`;

  const senderProfile = await getSenderProfile();
  try {
    const response = await client.messages.create({
      model,
      max_tokens: 600,
      system: [
        { type: 'text', text: senderProfile, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: CONNECTION_SYSTEM },
      ],
      messages: [{ role: 'user', content: userMessage }],
    });
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (!objMatch) return { ok: false, error: 'Model did not return JSON.' };
    const obj = JSON.parse(objMatch[0]);
    return {
      ok: true,
      angles: Array.isArray(obj.angles) ? obj.angles : [],
    };
  } catch (err) {
    return { ok: false, error: `Anthropic API: ${(err as Error).message}` };
  }
}

// Route messages from content scripts.
chrome.runtime.onMessage.addListener(
  (msg: ServiceWorkerRequest, _sender, sendResponse: (response: ServiceWorkerResponse) => void) => {
    (async () => {
      try {
        if (msg.type === 'critique') {
          sendResponse(await runCritique(msg));
        } else if (msg.type === 'checklist') {
          sendResponse(await runChecklist(msg));
        } else if (msg.type === 'connectionAngle') {
          sendResponse(await runConnectionAngle(msg));
        } else {
          sendResponse({ ok: false, error: `Unknown message type: ${(msg as { type: string }).type}` });
        }
      } catch (err) {
        sendResponse({ ok: false, error: (err as Error).message });
      }
    })();
    return true; // keep the message channel open for async sendResponse
  },
);
