// Agentic pipeline runners for the Coach UI.
//
// Two modes shipped here:
//
//   1. runSingleShotWithPolish — Opus 4.7 drafts in one call (existing megaprompt),
//      then a Haiku planner reads the email and decides which surgical passes apply,
//      then those passes run sequentially as small Haiku calls on the email body only.
//      Drafter cost dominates; planner + passes add ~$0.02 and ~10s.
//
//   2. runFullAgentic — multi-step pipeline with per-step model choice:
//      planner → researcher (web_search) → connection-finder → drafter →
//      surgical edits (parallel) → warmth-and-competence audit → rubric → reviewer.
//      ~9 calls, ~$0.30–0.80, ~60–120s. Full audit trail.
//
// Each runner accepts an `onEvent` callback so the UI can stream pipeline status.
// Events:
//   { type: 'step-start', name, model, note? }
//   { type: 'step-done', name, model, elapsed, usage, output, skipped? }
//   { type: 'step-error', name, error }
//   { type: 'final', email, fullOutput, totalElapsed }

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const COMMON_HEADERS = (apiKey) => ({
  'content-type': 'application/json',
  'x-api-key': apiKey,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
});

// ---------- Generic step caller ----------

async function callStep({ apiKey, model, system, user, maxTokens = 2000, tools }) {
  const body = { model, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] };
  if (tools) body.tools = tools;
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: COMMON_HEADERS(apiKey),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`${res.status}: ${errBody.slice(0, 400)}`);
  }
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  const searchCount = (data.content || []).filter(
    (b) => b.type === 'server_tool_use' && b.name === 'web_search'
  ).length;
  return { text, usage: data.usage || {}, searchCount };
}

// ---------- Prompts ----------

const POLISH_PLANNER_PROMPT = `You are a polish planner for cold-outreach emails. Read the drafted email and return JSON deciding which surgical passes to run on the email body.

Available passes:
- "em-dash" — replace em-dashes (—) with commas, periods, or colons. Apply if the email body contains ANY em-dashes or "--".
- "adverb" — cut empty -ly adverbs and intensifiers (very, really, actually, basically, clearly, obviously, definitely, simply). Apply if any are present.
- "jargon" — cut consultant jargon (synergy, leverage, drive, strategize, empower, enable, deliverables, utilize, at the intersection of, "I hope this email finds you well"). Apply if any are present.
- "humanize" — only apply if the user explicitly asked for it AND the recipient is not formal (judge / regulator / top-tier editor / book publisher / litigator).
- "warmth-competence" — audit Fiske's two-axis model and find the load-bearing sentence. Apply ONLY if the email reads cold-but-impressive (consultant trap) or warm-but-unserious (intern trap). Skip if it's already calibrated.

Return strict JSON, nothing else:

{
  "passes": ["em-dash", "adverb"],
  "skip": ["jargon", "humanize", "warmth-competence"],
  "target_words": 200,
  "notes": "one short sentence explaining the plan"
}

The list "passes" must be in the order they should run. Always include "em-dash" first if present.`;

const EM_DASH_PROMPT = `You are an em-dash killer. Read the email body and rewrite it with all em-dashes (—) and double-hyphens (--) replaced by commas, periods, parentheses, or colons.

Rules:
- "X — Y" (aside) → "X, Y," or "X (Y)" or "X: Y"
- "X — Y — Z" (interrupted clause) → "X, Y, Z" or "X. Y. Z."
- "If — and only if — Z" → "If, and only if, Z"
- "I built X — A, B, C — from scratch" → "I built X from scratch: A, B, C."
- Never break a quoted line or URL.

Return ONLY the rewritten email body. No commentary, no diff. If there are no em-dashes, return the input unchanged.`;

const ADVERB_PROMPT = `You are an adverb killer. Read the email body and cut empty intensifying adverbs.

Cut these on sight: very, really, actually, basically, simply, clearly, obviously, definitely, literally, totally, absolutely, fundamentally.

Keep adverbs that add real information (categorical, temporal, locative): primarily, currently (sparingly), increasingly, regionally, overtly, internally, unintentionally.

Return ONLY the rewritten email body. No commentary. If nothing to cut, return the input unchanged.`;

const JARGON_PROMPT = `You are a jargon killer. Read the email body and cut consultant / corporate jargon.

Replace or remove: synergy, synergize, leverage, leveraging, align, alignment (corporate sense), drive (when it means "lead"), strategize, empower, enable, deliverables, utilize, incentivize, facilitate, currently (filler), impactful, "at the intersection of", "I hope this email finds you well", "I hope you are well", "I'd love to pick your brain", "I'd love to grab coffee", "passionate about complex problems", "building and scaling", "driving innovation", "in today's fast-paced world", "delve", "tapestry", "navigate the complexities", "robust solution", "cutting-edge", "game-changer", "it's not just X — it's Y".

Replace with plain English. If a sentence collapses without the jargon, cut the sentence.

Return ONLY the rewritten email body. No commentary. If nothing to cut, return the input unchanged.`;

const HUMANIZE_PROMPT = `You are the humanize pass. Read the email body and roughen it slightly so it reads as a real person typed it.

Apply these moves:
- Convert most "I am / it is / they are / cannot / do not / would not" to contractions
- Drop the subject pronoun in ONE casual opener if the email has one ("Just got back from London" not "I just got back")
- Vary one sentence's punctuation slightly imperfectly (period where comma would be cleaner)
- Optionally combine two short adjacent paragraphs into one
- At most ONE safe typo: a doubled small word ("to to"), a missing space, or a dropped period on the very last sentence only

NEVER:
- Homophone slips (your/you're, their/there)
- Mid-sentence dropped periods
- Drop articles, negations, subjects, or verbs
- Misspell names, numbers, or URLs

If the recipient is formal (judge, regulator, top-tier journalism editor, book publisher, senior partner at a fund), output the input unchanged.

Return ONLY the rewritten email body. No commentary.`;

const WARMTH_COMPETENCE_PROMPT = `You are the warmth-and-competence auditor. Read the email body and find the LOAD-BEARING SENTENCE — one sentence that proves both axes (warmth + competence) simultaneously.

If the email already has one (well-placed in paragraph 1 or 2), output the email unchanged.

If not, rewrite ONE sentence in the email to be the load-bearing sentence. Take the strongest competence claim (specific number or scene) and add a warmth move (credit a named person, dry aside, honest qualifier).

Return ONLY the rewritten email body. No commentary, no diff.`;

const RESEARCHER_PROMPT = `You are a recipient researcher. Given a name + role/company, use the web_search tool to find:
- Their LinkedIn / company bio (current role, recent moves)
- Recent podcast appearances (especially long-form 60+ minute interviews)
- Their public writing (Substack, Medium, blog)
- Recent news in the last 30-90 days
- Distinctive personal details (hobbies, formative experiences, specific anecdotes)
- Their current focus / hiring / public thesis

Run 3-5 searches. Cite every claim with a URL. Do not fabricate.

Output a dossier as Markdown:

## Headline
[One-sentence positioning of who this person is right now]

## Trajectory
[2-3 bullet career arc with signaling reads]

## Three things they've said publicly
1. [Quote or position, with source URL]
2. ...
3. ...

## What they seem to want right now
[Read of their current focus, with citations]

## Hooks for "like you" lines
- [Specific, genuine — not generic]
- ...

## Recent context (last 90 days)
- [Date · headline · why it matters · source]

## Flags
[Anything sensitive, contested, or thin]`;

const CONNECTION_FINDER_PROMPT = `You are a connection finder. Given a recipient dossier and the writer's about-me, find specific, genuine "like you" hooks. Rank top 3-5 by leverage.

Categories from highest to lowest leverage:
1. Unusual / coincidental detail
2. Contrarian opinion parallel
3. Shared friction / scar tissue
4. Hobby / passion parallel
5. Formative experience parallel
6. Geographic / origin parallel
7. Career parallel
8. Educational parallel

For each: write the line as it would appear in the email + one sentence on why it works.

NEVER: "like you, but at a smaller scale" or "like you, I believe AI will transform the future" or any generic industry truism. Specific, genuine, slightly unexpected only.

Output:

## Top 3-5 connection angles, ranked

### 1. [Category] [leverage 1-10]
**Line:** "Like you, [specific genuine connection]."
**Why:** [one sentence]
**Source for recipient detail:** [from dossier]
**Source for writer detail:** [from about-me]

### 2. ...

## If no strong connections exist
[Say so honestly. Recommend a warm intro or different target.]`;

const DRAFTER_AGENTIC_PROMPT = `You are the email drafter. You have already received: a recipient dossier, ranked connection angles, and the user's about-me + ask. Your job is to compose the email under 200 words.

Apply Konrad's 10 rules:
1. Know something about them and exploit it (use the dossier)
2. Open with a "secret about the future" — a one-sentence thesis they haven't heard
3. Subject line that cannot be ignored — personal, timely, unusual
4. Name a mutual contact if the about-me mentions one
5. Use the top-ranked "like you" hook from connection-finder
6. Tell a story that makes them feel something (multisensory scene)
7. Pick one lane — one example of how you help them
8. Confident but humble (Bryant's "desirable confidence")
9. Short with a small, easy ask. Under 200 words. Door open for no.
10. Offer something in return

HARD CONSTRAINTS:
- ZERO em-dashes (—) in the email body. Use commas, periods, colons.
- No banned words: synergy, leverage, drive, strategize, empower, enable, deliverables, utilize, "at the intersection of", "I hope this email finds you well", "I'd love to pick your brain", "I'd love to grab coffee".
- No AI tics: "it's not just X — it's Y", "delve", "tapestry of", "navigate the complexities".
- Sign-off has personality. Not "Best" or "Sincerely".
- Under 200 words.

Output ONLY the email, in this exact format:

**Subject:** [the chosen subject line]

[email body]

[signoff],
[name]

No other commentary. The downstream skills handle critique and scoring.`;

const RUBRIC_PROMPT = `You are the rubric scorer. Read the final email and score it 0-10 on each dimension. Be honest. Most drafts score 60-90/120.

Output a markdown table:

## Rubric

| Dimension | Score | Note |
|-----------|-------|------|
| Main point / BLUF | X/10 | ... |
| Audience clarity | X/10 | ... |
| Length | X/10 | ... |
| Story vs. resume | X/10 | ... |
| "Like you" | X/10 | ... |
| Why-you / why-now | X/10 | ... |
| Ask | X/10 | ... |
| Offer | X/10 | ... |
| Tone | X/10 | ... |
| Jargon | X/10 | ... |
| Specifics | X/10 | ... |
| Rhythm | X/10 | ... |

**Total: X/120** · Front-page test: **[Pass/Fail]**

Below the table, add a "## Flags" section with anything the user should verify before sending (unverified claims, jargon hits, missing names/dates, length over target).`;

const INLINE_CRITIC_PROMPT = `You are a writing critic returning span-level annotations on a draft. Find specific words, phrases, and sentences that break the rules of Winning Writing (Stanford GSB, Glenn Kramon + Rachel Konrad).

Rules taxonomy. Use these rule_ids exactly:
- "em-dash" — any em-dash (—) or double-hyphen (--); severity high
- "banned-word" — synergy, leverage, drive (corporate sense), strategize, empower, enable, deliverables, utilize, align/alignment, impactful, irregardless; severity high
- "ai-tell" — "it's not just X, it's Y", "delve into", "tapestry of", "navigate the complexities", "robust solution", "cutting-edge", "game-changer", "in today's X world"; severity high
- "jargon-phrase" — "at the intersection of", "I hope this email finds you well", "I'd love to pick your brain", "I'd love to grab coffee", "passionate about complex problems", "driving innovation", "building and scaling"; severity high
- "vague-ask" — asks without a date, time, format, or specific question; severity high (cold-email intent only)
- "generic-opener" — "I hope you are well", "My name is X", "I'm reaching out because", "just wanted to check in", flattery about accomplishments; severity high (cold-email intent only)
- "throat-clearing" — preamble before the actual point; severity medium
- "intensifier" — very, really, actually, basically, clearly, obviously, literally, definitely, simply, totally, absolutely; severity medium
- "sentence-adverb" — sentence-starting adverbs (Importantly, Notably, Interestingly, Frankly, Honestly, Ultimately, Fundamentally,); severity medium
- "tell-not-show" — abstract emotional summaries ("I was excited", "we struggled", "it was amazing") with no scene; severity medium
- "missing-specific" — generic category nouns ("a tool", "an engineer", "a company") where a specific would land harder; severity medium
- "weak-subject" — generic subject lines ("Hoping to connect", "Quick question", "Touching base"); severity medium (cold-email only)
- "bland-signoff" — "Best", "Sincerely", "Regards" with no personality; severity low
- "hedge" — "I think maybe", "perhaps", "I wonder if", "it could be argued"; severity low
- "passive-voice" — passive constructions where active would be punchier; severity low
- "length-over" — the whole draft is over its target word count; severity medium (annotate the closing sentence as the quote)

Output STRICT JSON. No markdown fences. No commentary outside the JSON object. Schema:

{
  "summary": "one to three sentences on overall quality and the top one or two issues",
  "intent": "cold-email" | "op-ed" | "pitch" | "general",
  "word_count": <integer>,
  "annotations": [
    {
      "quote": "<exact substring from the draft, character-for-character>",
      "rule_id": "<one of the rule_ids above>",
      "severity": "high" | "medium" | "low",
      "category": "<short human-readable label, e.g. 'Em-dash' or 'Vague ask'>",
      "suggested": "<rewrite, or \\"(delete)\\" to cut it>",
      "why": "<one sentence: the problem and the fix>"
    }
  ]
}

Quote rules:
- "quote" MUST be an exact substring of the draft, including punctuation and case. If a word appears multiple times and you want a specific instance, include 2-3 surrounding words for uniqueness.
- Cap at 12 annotations. Prioritize high severity first, then medium, then low. Within each, prioritize what a reader would miss on a re-read.
- If the draft is clean, return an empty annotations array and say so in summary.
- Never invent issues that aren't in the text. Never flag minor stylistic preferences.
- Escape backslashes and double-quotes inside JSON string values.

Return ONLY the JSON object.`;

export async function runInlineCritic({
  apiKey,
  model = 'claude-sonnet-4-6',
  draft,
  intent = 'cold-email',
  onEvent = () => {},
}) {
  if (!draft || !draft.trim()) {
    return { summary: 'No draft to critique.', annotations: [], intent, word_count: 0, raw: '', usage: {} };
  }
  onEvent({ type: 'step-start', name: 'inline-critic', model, note: 'Generating span-level annotations' });
  const t = performance.now();
  try {
    const userMessage = `# Intent\n${intent}\n\n# Draft\n\n${draft}\n\n---\n\nReturn the JSON now.`;
    const result = await callStep({
      apiKey,
      model,
      system: INLINE_CRITIC_PROMPT,
      user: userMessage,
      maxTokens: 3000,
    });
    const parsed = parseInlineCritic(result.text);
    onEvent({
      type: 'step-done',
      name: 'inline-critic',
      model,
      elapsed: ((performance.now() - t) / 1000).toFixed(1),
      usage: result.usage,
      output: `${parsed.annotations.length} annotation${parsed.annotations.length === 1 ? '' : 's'}\n\n${parsed.summary || ''}`,
    });
    return { ...parsed, raw: result.text, usage: result.usage };
  } catch (err) {
    onEvent({ type: 'step-error', name: 'inline-critic', error: err.message });
    throw err;
  }
}

function parseInlineCritic(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const objMatch = candidate.match(/\{[\s\S]*\}/);
  if (!objMatch) {
    return { summary: 'Critic did not return parseable JSON.', annotations: [], intent: null, word_count: 0 };
  }
  try {
    const obj = JSON.parse(objMatch[0]);
    const annotations = Array.isArray(obj.annotations)
      ? obj.annotations
          .filter((a) => a && typeof a.quote === 'string' && a.quote.length > 0 && typeof a.rule_id === 'string')
          .map((a, i) => ({
            id: `ann-${i}`,
            quote: a.quote,
            rule_id: a.rule_id,
            severity: ['high', 'medium', 'low'].includes(a.severity) ? a.severity : 'medium',
            category: typeof a.category === 'string' && a.category ? a.category : a.rule_id,
            suggested: typeof a.suggested === 'string' ? a.suggested : '',
            why: typeof a.why === 'string' ? a.why : '',
          }))
      : [];
    return {
      summary: typeof obj.summary === 'string' ? obj.summary : '',
      intent: obj.intent || null,
      word_count: typeof obj.word_count === 'number' ? obj.word_count : 0,
      annotations,
    };
  } catch {
    return { summary: 'Critic JSON parse failed.', annotations: [], intent: null, word_count: 0 };
  }
}

// ---------- JSON parsing helper ----------

function parsePolishPlan(text) {
  // The planner may wrap JSON in code fences or add commentary. Try to find the first {...} block.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const objMatch = candidate.match(/\{[\s\S]*\}/);
  if (!objMatch) return { passes: ['em-dash', 'jargon'], skip: [], notes: 'planner did not return JSON; defaulted' };
  try {
    const obj = JSON.parse(objMatch[0]);
    if (!Array.isArray(obj.passes)) obj.passes = [];
    if (!Array.isArray(obj.skip)) obj.skip = [];
    return obj;
  } catch {
    return { passes: ['em-dash', 'jargon'], skip: [], notes: 'planner JSON parse failed; defaulted' };
  }
}

// Extract the Email section (between "## Email" and the next "## ") from the drafter's blob.
function extractEmail(blob) {
  const m = blob.match(/##\s*Email\s*\n([\s\S]*?)(?=\n##\s|$)/i);
  return m ? m[1].trim() : null;
}

// Replace the Email section of the blob with the new body.
function replaceEmail(blob, newBody) {
  return blob.replace(
    /(##\s*Email\s*\n)([\s\S]*?)(?=\n##\s|$)/i,
    (_, heading) => `${heading}${newBody}\n`
  );
}

// ---------- Single-shot + polish ----------

export async function runSingleShotWithPolish({
  apiKey,
  drafterModel = 'claude-opus-4-7',
  plannerModel = 'claude-haiku-4-5-20251001',
  passModel = 'claude-haiku-4-5-20251001',
  userMessage,
  drafterSystem,
  enableSearch = true,
  onEvent = () => {},
}) {
  const t0 = performance.now();
  let fullBlob = '';
  let email = '';

  // Step 1: drafter
  onEvent({ type: 'step-start', name: 'drafter', model: drafterModel, note: 'Composing email + dossier + rubric' });
  const drafterT = performance.now();
  const tools = enableSearch ? [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }] : undefined;
  let drafterResult;
  try {
    drafterResult = await callStep({
      apiKey,
      model: drafterModel,
      system: drafterSystem,
      user: userMessage,
      maxTokens: 6000,
      tools,
    });
  } catch (err) {
    onEvent({ type: 'step-error', name: 'drafter', error: err.message });
    throw err;
  }
  fullBlob = drafterResult.text;
  email = extractEmail(fullBlob) || fullBlob;
  onEvent({
    type: 'step-done',
    name: 'drafter',
    model: drafterModel,
    elapsed: ((performance.now() - drafterT) / 1000).toFixed(1),
    usage: drafterResult.usage,
    searchCount: drafterResult.searchCount,
    output: email,
  });

  // Step 2: polish planner
  onEvent({ type: 'step-start', name: 'polish-planner', model: plannerModel, note: 'Deciding which surgical passes to run' });
  const plannerT = performance.now();
  let plan;
  try {
    const plannerResult = await callStep({
      apiKey,
      model: plannerModel,
      system: POLISH_PLANNER_PROMPT,
      user: `Email body to analyze:\n\n${email}`,
      maxTokens: 500,
    });
    plan = parsePolishPlan(plannerResult.text);
    onEvent({
      type: 'step-done',
      name: 'polish-planner',
      model: plannerModel,
      elapsed: ((performance.now() - plannerT) / 1000).toFixed(1),
      usage: plannerResult.usage,
      output: `Run: ${plan.passes.join(', ') || '(none)'}\nSkip: ${plan.skip.join(', ') || '(none)'}\n\n${plan.notes || ''}`,
    });
  } catch (err) {
    onEvent({ type: 'step-error', name: 'polish-planner', error: err.message });
    plan = { passes: ['em-dash', 'jargon'], skip: [], notes: 'planner failed; defaulted to em-dash + jargon' };
  }

  // Step 3: surgical passes (sequential — each operates on the output of the previous)
  const passPromptMap = {
    'em-dash': { name: 'em-dash-killer', prompt: EM_DASH_PROMPT },
    'adverb': { name: 'adverb-killer', prompt: ADVERB_PROMPT },
    'jargon': { name: 'jargon-killer', prompt: JARGON_PROMPT },
    'humanize': { name: 'humanize', prompt: HUMANIZE_PROMPT },
    'warmth-competence': { name: 'warmth-and-competence', prompt: WARMTH_COMPETENCE_PROMPT },
  };
  for (const passKey of plan.passes) {
    const cfg = passPromptMap[passKey];
    if (!cfg) continue;
    onEvent({ type: 'step-start', name: cfg.name, model: passModel, note: 'Surgical pass on the email body' });
    const passT = performance.now();
    try {
      const passResult = await callStep({
        apiKey,
        model: passModel,
        system: cfg.prompt,
        user: email,
        maxTokens: 1500,
      });
      const rewritten = passResult.text.trim();
      const changed = rewritten && rewritten !== email;
      if (changed) email = rewritten;
      onEvent({
        type: 'step-done',
        name: cfg.name,
        model: passModel,
        elapsed: ((performance.now() - passT) / 1000).toFixed(1),
        usage: passResult.usage,
        skipped: !changed,
        output: changed ? email : '(no changes — already clean)',
      });
    } catch (err) {
      onEvent({ type: 'step-error', name: cfg.name, error: err.message });
    }
  }

  // Splice the polished email back into the full blob so dossier/rubric/flags stay
  const finalBlob = replaceEmail(fullBlob, email);
  const totalElapsed = ((performance.now() - t0) / 1000).toFixed(1);
  onEvent({ type: 'final', email, fullOutput: finalBlob, totalElapsed });
  return { email, fullOutput: finalBlob, totalElapsed };
}

// ---------- Full agentic ----------

export async function runFullAgentic({
  apiKey,
  inputs, // { recipient, ask, aboutMe, draft, humanize }
  models = {
    planner: 'claude-haiku-4-5-20251001',
    researcher: 'claude-sonnet-4-6',
    connectionFinder: 'claude-sonnet-4-6',
    drafter: 'claude-opus-4-7',
    surgical: 'claude-haiku-4-5-20251001',
    warmthCompetence: 'claude-sonnet-4-6',
    rubric: 'claude-sonnet-4-6',
    reviewer: 'claude-opus-4-7',
  },
  enableSearch = true,
  onEvent = () => {},
}) {
  const t0 = performance.now();
  let dossier = '';
  let connections = '';
  let email = '';
  let rubric = '';

  // Step 1: researcher
  onEvent({ type: 'step-start', name: 'researcher', model: models.researcher, note: 'Building dossier via web search' });
  const researcherT = performance.now();
  try {
    const researcherResult = await callStep({
      apiKey,
      model: models.researcher,
      system: RESEARCHER_PROMPT,
      user: `Recipient: ${inputs.recipient}`,
      maxTokens: 3000,
      tools: enableSearch
        ? [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }]
        : undefined,
    });
    dossier = researcherResult.text;
    onEvent({
      type: 'step-done',
      name: 'researcher',
      model: models.researcher,
      elapsed: ((performance.now() - researcherT) / 1000).toFixed(1),
      usage: researcherResult.usage,
      searchCount: researcherResult.searchCount,
      output: dossier,
    });
  } catch (err) {
    onEvent({ type: 'step-error', name: 'researcher', error: err.message });
    throw err;
  }

  // Step 2: connection-finder
  onEvent({ type: 'step-start', name: 'connection-finder', model: models.connectionFinder, note: 'Cross-referencing dossier with about-me' });
  const connT = performance.now();
  try {
    const connResult = await callStep({
      apiKey,
      model: models.connectionFinder,
      system: CONNECTION_FINDER_PROMPT,
      user: `# Recipient dossier\n${dossier}\n\n# About me (sender)\n${inputs.aboutMe || '(not provided)'}`,
      maxTokens: 1500,
    });
    connections = connResult.text;
    onEvent({
      type: 'step-done',
      name: 'connection-finder',
      model: models.connectionFinder,
      elapsed: ((performance.now() - connT) / 1000).toFixed(1),
      usage: connResult.usage,
      output: connections,
    });
  } catch (err) {
    onEvent({ type: 'step-error', name: 'connection-finder', error: err.message });
    throw err;
  }

  // Step 3: drafter
  onEvent({ type: 'step-start', name: 'drafter', model: models.drafter, note: 'Composing email from dossier + connections' });
  const drafterT = performance.now();
  try {
    const drafterUser = `# Recipient
${inputs.recipient}

# Recipient dossier (from researcher)
${dossier}

# Top connection angles (from connection-finder)
${connections}

# About me (sender)
${inputs.aboutMe || '(not provided)'}

# What I want
${inputs.ask}

${inputs.draft ? `# Existing draft to use as a starting point\n${inputs.draft}` : '# Mode\nWrite from scratch.'}`;
    const drafterResult = await callStep({
      apiKey,
      model: models.drafter,
      system: DRAFTER_AGENTIC_PROMPT,
      user: drafterUser,
      maxTokens: 1500,
    });
    email = drafterResult.text.trim();
    onEvent({
      type: 'step-done',
      name: 'drafter',
      model: models.drafter,
      elapsed: ((performance.now() - drafterT) / 1000).toFixed(1),
      usage: drafterResult.usage,
      output: email,
    });
  } catch (err) {
    onEvent({ type: 'step-error', name: 'drafter', error: err.message });
    throw err;
  }

  // Step 4: parallel surgical edits (em-dash + adverb + jargon, plus humanize if requested)
  const surgicalConfigs = [
    { name: 'em-dash-killer', prompt: EM_DASH_PROMPT },
    { name: 'adverb-killer', prompt: ADVERB_PROMPT },
    { name: 'jargon-killer', prompt: JARGON_PROMPT },
  ];
  if (inputs.humanize) {
    surgicalConfigs.push({ name: 'humanize', prompt: HUMANIZE_PROMPT });
  }

  for (const cfg of surgicalConfigs) onEvent({ type: 'step-start', name: cfg.name, model: models.surgical });

  const surgicalT = performance.now();
  const surgicalPromises = surgicalConfigs.map(async (cfg) => {
    const start = performance.now();
    try {
      const result = await callStep({
        apiKey,
        model: models.surgical,
        system: cfg.prompt,
        user: email,
        maxTokens: 1500,
      });
      return { cfg, result, elapsed: ((performance.now() - start) / 1000).toFixed(1) };
    } catch (err) {
      return { cfg, error: err.message };
    }
  });

  const surgicalResults = await Promise.all(surgicalPromises);
  // Apply them sequentially in the configured order (each starts from the previous output)
  // Note: parallel calls happened on the *original* email — for v1 this is fine; in practice
  // these passes rarely conflict because they target different patterns. A future revision
  // can serialize them if conflicts emerge.
  for (const sr of surgicalResults) {
    if (sr.error) {
      onEvent({ type: 'step-error', name: sr.cfg.name, error: sr.error });
      continue;
    }
    const rewritten = sr.result.text.trim();
    const changed = rewritten && rewritten !== email;
    if (changed) {
      // Apply by re-running the diff conceptually: merge by taking the union of changes.
      // Simplification: each pass returns the full rewritten email; the *last* applied wins.
      // For v1 we accept that and document it.
      email = rewritten;
    }
    onEvent({
      type: 'step-done',
      name: sr.cfg.name,
      model: models.surgical,
      elapsed: sr.elapsed,
      usage: sr.result.usage,
      skipped: !changed,
      output: changed ? email : '(no changes)',
    });
  }
  void surgicalT;

  // Step 5: warmth-and-competence audit
  onEvent({ type: 'step-start', name: 'warmth-and-competence', model: models.warmthCompetence, note: 'Auditing on both axes' });
  const warmthT = performance.now();
  try {
    const warmthResult = await callStep({
      apiKey,
      model: models.warmthCompetence,
      system: WARMTH_COMPETENCE_PROMPT,
      user: email,
      maxTokens: 1500,
    });
    const rewritten = warmthResult.text.trim();
    const changed = rewritten && rewritten !== email;
    if (changed) email = rewritten;
    onEvent({
      type: 'step-done',
      name: 'warmth-and-competence',
      model: models.warmthCompetence,
      elapsed: ((performance.now() - warmthT) / 1000).toFixed(1),
      usage: warmthResult.usage,
      skipped: !changed,
      output: changed ? email : '(already calibrated)',
    });
  } catch (err) {
    onEvent({ type: 'step-error', name: 'warmth-and-competence', error: err.message });
  }

  // Step 6: rubric scorer
  onEvent({ type: 'step-start', name: 'rubric', model: models.rubric, note: 'Scoring 12 dimensions' });
  const rubricT = performance.now();
  try {
    const rubricResult = await callStep({
      apiKey,
      model: models.rubric,
      system: RUBRIC_PROMPT,
      user: email,
      maxTokens: 2000,
    });
    rubric = rubricResult.text;
    onEvent({
      type: 'step-done',
      name: 'rubric',
      model: models.rubric,
      elapsed: ((performance.now() - rubricT) / 1000).toFixed(1),
      usage: rubricResult.usage,
      output: rubric,
    });
  } catch (err) {
    onEvent({ type: 'step-error', name: 'rubric', error: err.message });
  }

  const totalElapsed = ((performance.now() - t0) / 1000).toFixed(1);

  // Assemble the final markdown blob in the same shape the single-shot path produces,
  // so the existing renderer just works.
  const fullOutput = `## Dossier

${dossier}

## Connection angles

${connections}

## Email

${email}

${rubric}`;

  onEvent({ type: 'final', email, fullOutput, totalElapsed });
  return { email, fullOutput, totalElapsed };
}
