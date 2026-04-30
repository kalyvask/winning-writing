import { BANNED_WORDS, MODES, SAMPLE_DRAFTS, PRINCIPLES } from './data.js';

const $ = (id) => document.getElementById(id);

const state = {
  mode: 'cold-email',
  draft: '',
};

// ---------- Mode tabs ----------

function renderModeTabs() {
  const tabs = $('mode-tabs');
  tabs.innerHTML = '';
  for (const [key, m] of Object.entries(MODES)) {
    const btn = document.createElement('button');
    btn.className = 'tab' + (key === state.mode ? ' active' : '');
    btn.textContent = m.label;
    btn.onclick = () => {
      state.mode = key;
      renderModeTabs();
      renderChecklist();
      renderTargetLabel();
      analyze();
    };
    tabs.appendChild(btn);
  }
}

function renderTargetLabel() {
  $('target-label').textContent = MODES[state.mode].targetWordsLabel;
}

// ---------- Checklist ----------

function renderChecklist() {
  const list = $('checklist');
  list.innerHTML = '';
  MODES[state.mode].checklist.forEach((item, i) => {
    const id = `check-${state.mode}-${i}`;
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" id="${id}">
      <label for="${id}">${item}</label>
    `;
    list.appendChild(li);
  });
}

// ---------- Analysis ----------

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function findBannedHits(text) {
  const lower = text.toLowerCase();
  const hits = [];

  // Single-word jargon
  for (const word of BANNED_WORDS.jargon) {
    const re = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = [...text.matchAll(re)];
    if (matches.length) {
      hits.push({
        category: 'Jargon',
        match: word,
        count: matches.length,
        note: 'Replace with plain English or cut',
      });
    }
  }

  // Wordy phrases (with replacements)
  for (const { find, replace } of BANNED_WORDS.wordyPhrases) {
    const matches = [...text.matchAll(find)];
    if (matches.length) {
      hits.push({
        category: 'Wordy phrase',
        match: matches[0][0],
        count: matches.length,
        note: `→ "${replace}"`,
      });
    }
  }

  // AI tells
  for (const { find, label } of BANNED_WORDS.aiTells) {
    const matches = [...text.matchAll(find)];
    if (matches.length) {
      hits.push({
        category: 'AI tell',
        match: matches[0][0],
        count: matches.length,
        note: label,
      });
    }
  }

  // Cold-email-specific killers
  if (state.mode === 'cold-email') {
    for (const { find, label } of BANNED_WORDS.coldEmailKillers) {
      const matches = [...text.matchAll(find)];
      if (matches.length) {
        hits.push({
          category: 'Cold-email killer',
          match: matches[0][0],
          count: matches.length,
          note: label,
        });
      }
    }
  }

  return hits;
}

function highlightDraft(text, hits) {
  // Build a set of regex patterns and highlight matches in HTML.
  let html = escapeHtml(text);
  const patterns = new Set();

  for (const word of BANNED_WORDS.jargon) {
    patterns.add(`\\b${word}\\b`);
  }
  for (const { find } of BANNED_WORDS.wordyPhrases) {
    patterns.add(find.source);
  }
  for (const { find } of BANNED_WORDS.aiTells) {
    patterns.add(find.source);
  }
  if (state.mode === 'cold-email') {
    for (const { find } of BANNED_WORDS.coldEmailKillers) {
      patterns.add(find.source);
    }
  }

  for (const p of patterns) {
    const re = new RegExp(p, 'gi');
    html = html.replace(re, (m) => `<mark>${m}</mark>`);
  }

  return html.replace(/\n/g, '<br>');
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function detectBLUF(text) {
  // Strip "Subject:" line and any greeting line ("Hi X,", "Dear X:") so we look at the
  // first real body sentence.
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const bodyLines = lines.filter((l) => {
    if (/^subject\s*:/i.test(l)) return false;
    if (/^(hi|hello|hey|dear|to)\b[^\n]{0,40}[,:]?\s*$/i.test(l)) return false;
    return true;
  });
  const body = bodyLines.join(' ');
  const firstSentence = (body.split(/[.!?]\s/)[0] || '').toLowerCase().trim();
  if (!firstSentence) return { score: 0, note: 'No content yet' };

  const throatClearers = [
    /^(i hope|i wanted|i am writing|i would like to|in this|over the past|as you (know|are aware)|i'm reaching out|my name is)/i,
    /^(hi|hello|hey|dear)\b/i,
    /^(currently|at the moment|today|recently)/i,
    /^(some thoughts|a few thoughts|just (wanted|reaching))/i,
  ];
  if (throatClearers.some((re) => re.test(firstSentence))) {
    return { score: 3, note: 'First sentence reads as throat-clearing or greeting, not the bottom line' };
  }
  if (firstSentence.length < 20) {
    return { score: 5, note: 'First sentence is short — make sure it carries the main point' };
  }
  return { score: 9, note: 'First sentence looks substantive — verify it states the actual conclusion' };
}

function detectStory(text) {
  // Heuristic: do we see a year, a place, or a sensory detail?
  const hasYear = /\b(19|20)\d{2}\b/.test(text);
  const hasMonth = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(text);
  const hasDialogue = /["'"][^"'"]{6,}["'"]/.test(text);
  const score =
    (hasYear ? 3 : 0) +
    (hasMonth ? 2 : 0) +
    (hasDialogue ? 4 : 0);
  let note = '';
  if (score === 0) note = 'No date, place, or dialogue detected — story may be abstract';
  else if (score < 5) note = 'Some specifics — could go more cinematic';
  else note = 'Has cinematic specifics';
  return { score: Math.min(10, score + 1), note };
}

function analyze() {
  const text = state.draft;
  const wordCount = countWords(text);
  const target = MODES[state.mode].targetWords;
  const overTarget = Math.max(0, wordCount - target);

  $('word-count').textContent = wordCount;
  $('reading-time').textContent = Math.max(1, Math.ceil(wordCount / 250));

  const wcEl = $('word-count-card');
  wcEl.classList.remove('warn', 'bad', 'good');
  if (wordCount === 0) wcEl.classList.add('warn');
  else if (overTarget > target * 0.25) wcEl.classList.add('bad');
  else if (overTarget > 0) wcEl.classList.add('warn');
  else wcEl.classList.add('good');

  const hits = findBannedHits(text);
  const totalHits = hits.reduce((a, b) => a + b.count, 0);
  $('jargon-count').textContent = totalHits;
  const jcEl = $('jargon-count-card');
  jcEl.classList.remove('warn', 'bad', 'good');
  if (totalHits === 0) jcEl.classList.add('good');
  else if (totalHits < 3) jcEl.classList.add('warn');
  else jcEl.classList.add('bad');

  // Render hits list
  const hitsList = $('jargon-hits');
  hitsList.innerHTML = '';
  if (hits.length === 0) {
    hitsList.innerHTML = '<li class="empty">No banned words detected. Run the rest of the checklist.</li>';
  } else {
    for (const h of hits) {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="cat cat-${h.category.toLowerCase().replace(/[^a-z]/g, '-')}">${h.category}</span>
        <strong>${escapeHtml(h.match)}</strong>
        <span class="count">×${h.count}</span>
        <span class="note">${escapeHtml(h.note)}</span>
      `;
      hitsList.appendChild(li);
    }
  }

  // Highlighted preview
  $('highlighted').innerHTML = text ? highlightDraft(text, hits) : '<em class="empty">Paste a draft above to see highlights.</em>';

  // BLUF score
  const bluf = detectBLUF(text);
  $('bluf-score').textContent = `${bluf.score}/10`;
  $('bluf-score-inline').textContent = `${bluf.score}/10`;
  $('bluf-note').textContent = bluf.note;

  // Story score
  const story = detectStory(text);
  $('story-score').textContent = `${story.score}/10`;
  $('story-note').textContent = story.note;

  // Six-word counter
  const six = $('six-word-input').value.trim();
  const sixCount = six ? six.split(/\s+/).length : 0;
  $('six-count').textContent = sixCount;
  $('six-count').className = sixCount === 6 ? 'good' : sixCount > 0 ? 'warn' : '';
}

// ---------- Critique prompt builder ----------

function buildCritiquePrompt() {
  const m = MODES[state.mode];
  const refs = m.pointsRefs.map((r) => `- ${r}`).join('\n');
  return `You are a Winning Writing critic. Grade and rewrite the draft below using the rules from Stanford GSB's Winning Writing course (Glenn Kramon + Rachel Konrad).

Mode: ${m.label}
Target length: ${m.targetWordsLabel}

Reference material (in points/):
${refs}

Apply this rubric — score each 0–10:
1. Main point in first sentence (BLUF)
2. Audience clarity
3. Length vs. target
4. Story vs. resume (cinematic specifics: date, place, sensory detail)
5. "Like you" / connection (if applicable)
6. Why-you and why-now
7. Ask is small + specific, with door open for no
8. Offering something, not just taking
9. Tone — warm, human, confident-but-humble, "on toes"
10. Jargon — banned words, AI tells, wordy phrases (deduct heavily)
11. Specifics — real names, real numbers, real interviews
12. Sentence rhythm
13. Front-page-of-NYT test (pass/fail)

Output format:
## Score
[Each dimension : N/10]
Total: N/130

## Critique (top 3 issues, in priority order)
For each: quote the failing line, explain why it fails, suggest the fix.

## Rewrite
[The clean version, under target length]

## What changed (3 bullets)

---

DRAFT:

${state.draft || '(paste your draft above first)'}`;
}

async function copyCritiquePrompt() {
  const prompt = buildCritiquePrompt();
  try {
    await navigator.clipboard.writeText(prompt);
    flashButton('copy-critique', 'Copied to clipboard ✓');
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = prompt;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    flashButton('copy-critique', 'Copied (fallback) ✓');
  }
}

function flashButton(id, msg) {
  const btn = $(id);
  const orig = btn.textContent;
  btn.textContent = msg;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = orig;
    btn.disabled = false;
  }, 1800);
}

function loadSample() {
  const sample = SAMPLE_DRAFTS[state.mode];
  $('draft').value = sample;
  state.draft = sample;
  analyze();
}

function clearDraft() {
  $('draft').value = '';
  state.draft = '';
  analyze();
}

// ---------- Wire up ----------

function renderPrinciples() {
  const root = $('principles');
  if (!root) return;
  root.innerHTML = '';
  PRINCIPLES.forEach((group, gi) => {
    const details = document.createElement('details');
    if (gi === 0) details.open = true;
    const summary = document.createElement('summary');
    summary.innerHTML = `<strong>${escapeHtml(group.category)}</strong> <span class="src">${escapeHtml(group.source)}</span>`;
    details.appendChild(summary);
    const ol = document.createElement('ol');
    group.items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      ol.appendChild(li);
    });
    details.appendChild(ol);
    root.appendChild(details);
  });
}

function init() {
  renderModeTabs();
  renderChecklist();
  renderTargetLabel();
  renderPrinciples();

  $('draft').addEventListener('input', (e) => {
    state.draft = e.target.value;
    analyze();
  });
  $('six-word-input').addEventListener('input', analyze);
  $('copy-critique').addEventListener('click', copyCritiquePrompt);
  $('load-sample').addEventListener('click', loadSample);
  $('clear-draft').addEventListener('click', clearDraft);

  analyze();
}

document.addEventListener('DOMContentLoaded', init);
