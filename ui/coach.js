import { SYSTEM_PROMPT } from './coach-prompt.js';
import { CROSS_MODEL_SYSTEM_PROMPT } from './cross-model-prompt.js';
import { runSingleShotWithPolish, runFullAgentic, runInlineCritic } from './agents.js';

const $ = (id) => document.getElementById(id);
const KEY_STORE = 'winning-writing.coach.apikey';
const MODEL_STORE = 'winning-writing.coach.model';
const MODE_STORE = 'winning-writing.coach.mode';
const ABOUT_STORE = 'winning-writing.coach.about-me';
const SEARCH_STORE = 'winning-writing.coach.search-enabled';
const HUMANIZE_STORE = 'winning-writing.coach.humanize-enabled';
const REVIEW_STORE = 'winning-writing.coach.review-enabled';
const REVIEW_MODEL_STORE = 'winning-writing.coach.review-model';

// ---------- Init ----------

function loadStored() {
  $('api-key').value = localStorage.getItem(KEY_STORE) || '';
  const storedModel = localStorage.getItem(MODEL_STORE);
  if (storedModel) $('model').value = storedModel;
  const storedMode = localStorage.getItem(MODE_STORE);
  if (storedMode) $('mode').value = storedMode;
  const storedAbout = localStorage.getItem(ABOUT_STORE);
  if (storedAbout) $('about-me').value = storedAbout;
  const search = localStorage.getItem(SEARCH_STORE);
  if (search === 'false') $('enable-search').checked = false;
  const humanize = localStorage.getItem(HUMANIZE_STORE);
  if (humanize === 'true') $('enable-humanize').checked = true;
  const review = localStorage.getItem(REVIEW_STORE);
  if (review === 'false') $('enable-cross-review').checked = false;
  const storedReviewer = localStorage.getItem(REVIEW_MODEL_STORE);
  if (storedReviewer) $('reviewer-model').value = storedReviewer;
}

function persistKey() {
  const k = $('api-key').value.trim();
  if (k) localStorage.setItem(KEY_STORE, k);
}
function persistModel() { localStorage.setItem(MODEL_STORE, $('model').value); }
function persistMode() { localStorage.setItem(MODE_STORE, $('mode').value); }
function persistAbout() { localStorage.setItem(ABOUT_STORE, $('about-me').value); }
function persistSearch() { localStorage.setItem(SEARCH_STORE, $('enable-search').checked ? 'true' : 'false'); }
function persistHumanize() { localStorage.setItem(HUMANIZE_STORE, $('enable-humanize').checked ? 'true' : 'false'); }
function persistReview() { localStorage.setItem(REVIEW_STORE, $('enable-cross-review').checked ? 'true' : 'false'); }
function persistReviewModel() { localStorage.setItem(REVIEW_MODEL_STORE, $('reviewer-model').value); }

async function loadAboutFromFile() {
  try {
    const res = await fetch('../context/about-me.md');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    $('about-me').value = text;
    persistAbout();
    setStatus('Loaded context/about-me.md', 'ok');
  } catch (err) {
    setStatus(
      'Could not load context/about-me.md (make sure you\'re running from a server, not file://). Paste your about-me below instead.',
      'warn'
    );
  }
}

function clearAbout() {
  $('about-me').value = '';
  persistAbout();
  setStatus('About-me cleared', 'ok');
}

// ---------- Build user message ----------

function buildUserMessage() {
  const recipient = $('recipient').value.trim();
  const ask = $('ask').value.trim();
  const aboutMe = $('about-me').value.trim();
  const draft = $('draft-input').value.trim();

  if (!recipient) throw new Error('Tell Coach who you\'re emailing.');
  if (!ask) throw new Error('Tell Coach what you want from them.');

  let msg = `# Recipient\n${recipient}\n`;

  if ($('enable-search').checked) {
    msg += `\nUse the web_search tool to research them before drafting. Aim for 3–5 searches: their LinkedIn / company bio, recent podcasts, recent posts, recent news. Cite every claim with a URL.\n`;
  } else {
    msg += `\n(Web search is disabled — work only from what's in your training data and what's in this prompt. If you don't know something, leave it out.)\n`;
  }

  msg += `\n# About me (the sender)\n`;
  msg += aboutMe ? aboutMe : '(The user did not provide an about-me. Note this as your first flag — recommend they add one before sending.)';
  msg += `\n\n# What I want\n${ask}\n`;

  if (draft) {
    msg += `\n# Existing draft\nCritique line-by-line first, then produce the rewrite in the "Email" section.\n\n${draft}\n`;
  } else {
    msg += `\n# Mode\nNo draft provided — write the email from scratch using the pipeline above.\n`;
  }

  if ($('enable-humanize').checked) {
    msg += `\n[humanize: on]\nApply the humanize pass to the final email per the system prompt — shorten 10-20%, contractions, and exactly one harmless micro-typo. Skip if the recipient is formal.\n`;
  }

  return msg;
}

// ---------- Anthropic API ----------

async function callClaude(userMessage) {
  const apiKey = $('api-key').value.trim();
  const model = $('model').value;
  if (!apiKey) throw new Error('Paste your Anthropic API key first.');

  const body = {
    model,
    max_tokens: 6000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  };

  if ($('enable-search').checked) {
    body.tools = [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 5,
      },
    ];
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${errBody.slice(0, 600)}`);
  }
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  const searchCount = (data.content || []).filter((b) => b.type === 'server_tool_use' && b.name === 'web_search').length;
  return { text, usage: data.usage, searchCount };
}

// ---------- Cross-model reviewer ----------

function pickReviewerModel(drafterModel, reviewerSelection) {
  if (reviewerSelection !== 'auto') return reviewerSelection;
  // Auto: pick a different model than the drafter. Haiku is too small to be a reliable reviewer.
  if (drafterModel === 'claude-opus-4-7') return 'claude-sonnet-4-6';
  if (drafterModel === 'claude-sonnet-4-6') return 'claude-opus-4-7';
  if (drafterModel.startsWith('claude-haiku')) return 'claude-sonnet-4-6';
  return 'claude-sonnet-4-6';
}

async function callClaudeReviewer(originalUserMessage, drafterOutput, reviewerModel, apiKey) {
  const reviewerUserMessage = `Below are the inputs given to the drafter, then the drafter's full output. Run the gate.

# ORIGINAL INPUTS TO THE DRAFTER

${originalUserMessage}

---

# DRAFTER'S FULL OUTPUT (dossier, connection angles, subject lines, email, rubric, flags)

${drafterOutput}

---

Run the gate. Output the verdict only, in the exact format from the system prompt.`;

  const body = {
    model: reviewerModel,
    max_tokens: 2000,
    system: CROSS_MODEL_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: reviewerUserMessage }],
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Reviewer API ${res.status}: ${errBody.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  return { text, usage: data.usage };
}

function parseVerdict(reviewerText) {
  const m = reviewerText.match(/##\s*Verdict\s*\n+\s*(PASS|FAIL)/i);
  return m ? m[1].toUpperCase() : null;
}

// Pull a `## Section Name` block out of the reviewer's markdown. Returns the
// section body without the heading, or null if not found.
function extractSection(text, sectionName) {
  const re = new RegExp(`##\\s*${sectionName.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

// ---------- Em-dash post-check on the email section ----------

function checkEmDashesInEmail(md) {
  // Pull the Email section and look for em-dashes
  const m = md.match(/##\s*Email[\s\S]*?(?=\n##\s|\n#\s|$)/i);
  if (!m) return { found: 0 };
  const section = m[0];
  const dashes = (section.match(/—/g) || []).length;
  const doubleHyphens = (section.match(/--/g) || []).length;
  return { found: dashes + doubleHyphens, dashes, doubleHyphens };
}

// ---------- Pipeline trace ----------

const STEP_LABELS = {
  drafter: 'Drafter',
  'polish-planner': 'Polish planner',
  researcher: 'Researcher',
  'connection-finder': 'Connection finder',
  'em-dash-killer': 'Em-dash killer',
  'adverb-killer': 'Adverb killer',
  'jargon-killer': 'Jargon killer',
  humanize: 'Humanize',
  'warmth-and-competence': 'Warmth + competence',
  rubric: 'Rubric scorer',
};

function pipelineCardId(name) {
  return `pipe-step-${name}`;
}

function ensurePipelineVisible() {
  const sec = $('pipeline-section');
  if (sec.style.display === 'none') sec.style.display = '';
}

function clearPipeline() {
  $('pipeline-trace').innerHTML = '';
  $('pipeline-section').style.display = 'none';
}

function escapeHtmlForTrace(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function handlePipelineEvent(evt) {
  ensurePipelineVisible();
  const trace = $('pipeline-trace');
  if (evt.type === 'step-start') {
    const label = STEP_LABELS[evt.name] || evt.name;
    const card = document.createElement('div');
    card.id = pipelineCardId(evt.name);
    card.className = 'pipe-step running';
    card.innerHTML = `
      <div class="pipe-step-head">
        <span class="pipe-step-dot"></span>
        <strong>${label}</strong>
        <span class="pipe-step-model">${escapeHtmlForTrace(evt.model || '')}</span>
        <span class="pipe-step-status">running…</span>
      </div>
      ${evt.note ? `<div class="pipe-step-note">${escapeHtmlForTrace(evt.note)}</div>` : ''}
    `;
    trace.appendChild(card);
  } else if (evt.type === 'step-done') {
    const card = document.getElementById(pipelineCardId(evt.name));
    if (!card) return;
    card.classList.remove('running');
    card.classList.add(evt.skipped ? 'skipped' : 'done');
    const usage = evt.usage || {};
    const usageStr = `${usage.input_tokens || '?'} in / ${usage.output_tokens || '?'} out`;
    const search = evt.searchCount ? ` · ${evt.searchCount} search${evt.searchCount === 1 ? '' : 'es'}` : '';
    const statusEl = card.querySelector('.pipe-step-status');
    statusEl.textContent = evt.skipped ? `skipped · ${evt.elapsed}s` : `${evt.elapsed}s · ${usageStr}${search}`;
    if (evt.output) {
      const out = document.createElement('details');
      out.className = 'pipe-step-out';
      out.innerHTML = `<summary>Inspect output</summary><pre>${escapeHtmlForTrace(evt.output)}</pre>`;
      card.appendChild(out);
    }
  } else if (evt.type === 'step-error') {
    const card = document.getElementById(pipelineCardId(evt.name));
    if (!card) return;
    card.classList.remove('running');
    card.classList.add('error');
    card.querySelector('.pipe-step-status').textContent = 'error';
    const err = document.createElement('div');
    err.className = 'pipe-step-err';
    err.textContent = evt.error;
    card.appendChild(err);
  } else if (evt.type === 'final') {
    const summary = document.createElement('div');
    summary.className = 'pipe-step done';
    summary.innerHTML = `<div class="pipe-step-head"><span class="pipe-step-dot"></span><strong>Pipeline complete</strong><span class="pipe-step-status">${evt.totalElapsed}s total</span></div>`;
    trace.appendChild(summary);
  }
}

// ---------- Render ----------

function setStatus(msg, kind = '') {
  const el = $('status');
  el.textContent = msg;
  el.className = `status ${kind}`;
}

function setHint(msg) { $('output-hint').textContent = msg; }

function renderMarkdown(md) {
  const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = md.split(/\r?\n/);
  let html = '';
  let inUL = false, inOL = false, inTable = false;
  let tableRows = [], inCode = false, codeBuf = [], para = [];

  const flushPara = () => {
    if (para.length) {
      const text = para.join(' ').trim();
      if (text) html += `<p>${inlineFmt(text)}</p>\n`;
      para = [];
    }
  };
  const flushUL = () => { if (inUL) { html += '</ul>\n'; inUL = false; } };
  const flushOL = () => { if (inOL) { html += '</ol>\n'; inOL = false; } };
  const flushTable = () => {
    if (!inTable) return;
    if (tableRows.length >= 2) {
      const header = tableRows[0];
      const rows = tableRows.slice(2);
      html += '<table><thead><tr>';
      for (const c of header) html += `<th>${inlineFmt(c)}</th>`;
      html += '</tr></thead><tbody>';
      for (const r of rows) {
        html += '<tr>';
        for (const c of r) html += `<td>${inlineFmt(c)}</td>`;
        html += '</tr>';
      }
      html += '</tbody></table>';
    }
    inTable = false; tableRows = [];
  };

  function inlineFmt(s) {
    s = escape(s);
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    return s;
  }

  for (const raw of lines) {
    const line = raw;
    if (/^```/.test(line)) {
      if (inCode) {
        html += `<pre><code>${escape(codeBuf.join('\n'))}</code></pre>`;
        codeBuf = []; inCode = false;
      } else {
        flushPara(); flushUL(); flushOL(); flushTable();
        inCode = true;
      }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }

    if (/^\|.+\|/.test(line)) {
      flushPara(); flushUL(); flushOL();
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (!inTable) inTable = true;
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    const h = line.match(/^(#{1,6})\s+(.*)/);
    if (h) {
      flushPara(); flushUL(); flushOL();
      const level = Math.min(h[1].length + 1, 6);
      html += `<h${level}>${inlineFmt(h[2])}</h${level}>\n`;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      flushPara(); flushUL(); flushOL();
      html += '<hr>\n';
      continue;
    }
    const ol = line.match(/^\s*\d+\.\s+(.*)/);
    if (ol) {
      flushPara(); flushUL();
      if (!inOL) { html += '<ol>\n'; inOL = true; }
      html += `<li>${inlineFmt(ol[1])}</li>\n`;
      continue;
    }
    const ul = line.match(/^\s*[-*]\s+(.*)/);
    if (ul) {
      flushPara(); flushOL();
      if (!inUL) { html += '<ul>\n'; inUL = true; }
      html += `<li>${inlineFmt(ul[1])}</li>\n`;
      continue;
    }
    if (line.trim() === '') {
      flushPara(); flushUL(); flushOL();
      continue;
    }
    para.push(line);
  }
  flushPara(); flushUL(); flushOL(); flushTable();
  if (inCode) html += `<pre><code>${escape(codeBuf.join('\n'))}</code></pre>`;
  return html;
}

function renderVerdictBanner(reviewerText, reviewerModel, drafterModel) {
  const verdict = parseVerdict(reviewerText);
  const sameModel = reviewerModel === drafterModel;
  const sameNote = sameModel
    ? ` <em>Reviewer ran on the same model as the drafter — review may not be independent.</em>`
    : '';
  const modelLine = `<div style="font-family:var(--mono);font-size:var(--t-xs);opacity:0.7;margin-top:var(--s-1);">Drafter: <code>${drafterModel}</code> · Reviewer: <code>${reviewerModel}</code>${sameNote}</div>`;

  // Surface counter-question above the fold for both PASS and FAIL — it's the
  // most actionable piece even when the gate passes.
  const cqRaw = extractSection(reviewerText, 'Most likely counter-question');
  const cqBlock = cqRaw
    ? `<div style="margin-top:var(--s-3); padding-top:var(--s-2); border-top:1px solid currentColor; opacity:0.85;"><strong>Most likely counter-question:</strong>${renderMarkdown(cqRaw)}</div>`
    : '';

  const body = renderMarkdown(reviewerText);

  if (verdict === 'PASS') {
    return `<div class="banner good"><strong>✓ Cross-model gate: PASS</strong> — an independent model accepted the email.${modelLine}${cqBlock}<details style="margin-top:var(--s-2);"><summary style="cursor:pointer;">Reviewer details (named failure modes, borderline notes, confidence)</summary>${body}</details></div>`;
  }
  if (verdict === 'FAIL') {
    return `<div class="banner bad"><strong>✗ Cross-model gate: FAIL</strong> — an independent model blocked the email. Address the named failures below before sending.${modelLine}${body}</div>`;
  }
  return `<div class="banner warn"><strong>? Cross-model gate: verdict not parsed</strong> — reviewer output below, judge for yourself.${modelLine}${body}</div>`;
}

function extractEmailBody(blob) {
  const m = blob.match(/##\s*Email\s*\n([\s\S]*?)(?=\n##\s|$)/i);
  return m ? m[1].trim() : '';
}

function renderOutput(text, reviewerInfo) {
  const dashCheck = checkEmDashesInEmail(text);
  let warning = '';
  if (dashCheck.found > 0) {
    warning = `<div class="banner warn"><strong>⚠️ Em-dash check:</strong> Found ${dashCheck.found} em-dash${dashCheck.found > 1 ? 'es' : ''} or double-hyphen${dashCheck.found > 1 ? 's' : ''} in the email body. The model slipped, replace them with commas, periods, or colons before sending. Em-dashes are the strongest AI tell in 2026.</div>`;
  } else {
    warning = `<div class="banner good">✓ <strong>Em-dash check:</strong> Email body is clean of em-dashes.</div>`;
  }
  let verdictBanner = '';
  if (reviewerInfo) {
    verdictBanner = renderVerdictBanner(reviewerInfo.text, reviewerInfo.model, reviewerInfo.drafterModel);
  }
  $('output').innerHTML = verdictBanner + warning + renderMarkdown(text);
  $('raw').textContent = reviewerInfo ? `${text}\n\n---\n\n# REVIEWER (${reviewerInfo.model})\n\n${reviewerInfo.text}` : text;
  $('raw-toggle').style.display = '';
  $('output-hint').style.display = 'none';
  // Stash the drafted email body so the inline critic button can pick it up.
  const emailBody = extractEmailBody(text);
  inline.lastDraftedEmail = emailBody;
  $('critique-output-row').style.display = emailBody ? '' : 'none';
}

// ---------- Run ----------

async function runReviewer(userMessage, drafterOutput) {
  const drafterModel = $('model').value;
  const reviewerModel = pickReviewerModel(drafterModel, $('reviewer-model').value);
  const apiKey = $('api-key').value.trim();
  const t1 = performance.now();
  try {
    const { text: reviewerText, usage: reviewerUsage } = await callClaudeReviewer(userMessage, drafterOutput, reviewerModel, apiKey);
    const reviewerElapsed = ((performance.now() - t1) / 1000).toFixed(1);
    const ru = reviewerUsage || {};
    return {
      info: { text: reviewerText, model: reviewerModel, drafterModel },
      status: ` · gate ${reviewerElapsed}s on ${reviewerModel} (${ru.input_tokens || '?'} in / ${ru.output_tokens || '?'} out)`,
    };
  } catch (reviewerErr) {
    return { info: null, status: ` · gate failed: ${reviewerErr.message.slice(0, 120)}` };
  }
}

async function run() {
  setStatus('');
  $('output').innerHTML = '';
  $('output-hint').style.display = '';
  clearPipeline();
  setHint('Building prompt…');

  const mode = $('mode').value;

  const recipient = $('recipient').value.trim();
  const ask = $('ask').value.trim();
  if (!recipient) { setStatus('Tell Coach who you\'re emailing.', 'err'); return; }
  if (!ask) { setStatus('Tell Coach what you want from them.', 'err'); return; }

  const btn = $('run');
  btn.disabled = true;
  const orig = btn.textContent;
  btn.textContent = 'Running…';

  try {
    persistKey(); persistModel(); persistMode(); persistAbout(); persistSearch(); persistHumanize();
    persistReview(); persistReviewModel();

    const apiKey = $('api-key').value.trim();
    if (!apiKey) throw new Error('Paste your Anthropic API key first.');

    const t0 = performance.now();
    let resultText = '';
    let drafterElapsed = '?';
    let usage = {};
    let searchCount = 0;
    let userMessage = ''; // for the reviewer to see

    if (mode === 'single-shot') {
      // Existing path
      userMessage = buildUserMessage();
      setHint($('enable-search').checked
        ? 'Calling Claude with web_search enabled — typically 30–60 seconds…'
        : 'Calling Claude — typically 10–25 seconds…');
      setStatus('Calling Claude (single-shot)…', 'ok');
      const r = await callClaude(userMessage);
      resultText = r.text; usage = r.usage; searchCount = r.searchCount;
      drafterElapsed = ((performance.now() - t0) / 1000).toFixed(1);
    } else if (mode === 'single-shot-polish') {
      userMessage = buildUserMessage();
      setHint('Single-shot + polish: drafter (Opus 4.7) then planner-routed surgical passes (Haiku)…');
      setStatus('Running single-shot + polish…', 'ok');
      const r = await runSingleShotWithPolish({
        apiKey,
        drafterModel: $('model').value,
        userMessage,
        drafterSystem: SYSTEM_PROMPT,
        enableSearch: $('enable-search').checked,
        onEvent: handlePipelineEvent,
      });
      resultText = r.fullOutput;
      drafterElapsed = r.totalElapsed;
    } else if (mode === 'full-agentic') {
      const inputs = {
        recipient,
        ask,
        aboutMe: $('about-me').value.trim(),
        draft: $('draft-input').value.trim(),
        humanize: $('enable-humanize').checked,
      };
      userMessage = JSON.stringify(inputs, null, 2);
      setHint('Full agentic pipeline: researcher → connector → drafter → surgical (parallel) → warmth/competence → rubric…');
      setStatus('Running full agentic pipeline…', 'ok');
      const r = await runFullAgentic({
        apiKey,
        inputs,
        enableSearch: $('enable-search').checked,
        onEvent: handlePipelineEvent,
      });
      resultText = r.fullOutput;
      drafterElapsed = r.totalElapsed;
    } else {
      throw new Error(`Unknown mode: ${mode}`);
    }

    let reviewerInfo = null;
    let reviewerStatus = '';
    if ($('enable-cross-review').checked) {
      const drafterModel = $('model').value;
      const reviewerModel = pickReviewerModel(drafterModel, $('reviewer-model').value);
      setHint(`Pipeline done in ${drafterElapsed}s. Running independent gate on ${reviewerModel}…`);
      setStatus(`Running cross-model gate on ${reviewerModel}…`, 'ok');
      const r = await runReviewer(userMessage, resultText);
      reviewerInfo = r.info;
      reviewerStatus = r.status;
    }

    renderOutput(resultText, reviewerInfo);
    const u = usage || {};
    const totalElapsed = ((performance.now() - t0) / 1000).toFixed(1);
    const usageStr = mode === 'single-shot'
      ? ` · drafter ${drafterElapsed}s (${u.input_tokens || '?'} in / ${u.output_tokens || '?'} out · ${searchCount} web search${searchCount === 1 ? '' : 'es'})`
      : ` · pipeline ${drafterElapsed}s (see trace for per-step usage)`;
    setStatus(`Done in ${totalElapsed}s${usageStr}${reviewerStatus}`, 'ok');
  } catch (err) {
    setStatus(err.message, 'err');
    setHint('Failed. See status above. Common fixes: check API key, check internet, try a different model, or disable web search.');
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
}

// ---------- Inline coach ----------

const inline = {
  source: null,          // 'input' | 'output'
  originalDraft: '',
  workingDraft: '',
  annotations: [],       // [{id, quote, rule_id, severity, category, suggested, why, status, start, end}]
  summary: '',
  intent: 'cold-email',
  lastDraftedEmail: '',
};

let stickyCardId = null;

function resolveAnnotationOffsets() {
  const cursors = new Map();
  for (const a of inline.annotations) {
    if (a.status !== 'open') { a.start = -1; a.end = -1; continue; }
    const from = cursors.get(a.quote) || 0;
    const idx = inline.workingDraft.indexOf(a.quote, from);
    if (idx === -1) {
      a.start = -1; a.end = -1;
    } else {
      a.start = idx;
      a.end = idx + a.quote.length;
      cursors.set(a.quote, a.end);
    }
  }
}

function renderAnnotatedDraft() {
  const viewer = $('inline-coach-viewer');
  if (!inline.workingDraft) {
    viewer.innerHTML = '<p class="empty">No draft yet.</p>';
    return;
  }
  resolveAnnotationOffsets();
  const sevRank = { high: 3, medium: 2, low: 1 };
  const open = inline.annotations
    .filter((a) => a.status === 'open' && a.start >= 0)
    .sort((a, b) => a.start - b.start);
  const filtered = [];
  let lastEnd = -1;
  for (const a of open) {
    if (a.start >= lastEnd) {
      filtered.push(a);
      lastEnd = a.end;
    } else {
      const prev = filtered[filtered.length - 1];
      if (sevRank[a.severity] > sevRank[prev.severity]) {
        filtered[filtered.length - 1] = a;
        lastEnd = a.end;
      }
    }
  }
  let html = '';
  let cursor = 0;
  for (const a of filtered) {
    html += escapeHtmlForTrace(inline.workingDraft.slice(cursor, a.start));
    html += `<mark class="ann ann-${a.severity}" data-ann-id="${a.id}" tabindex="0">${escapeHtmlForTrace(inline.workingDraft.slice(a.start, a.end))}</mark>`;
    cursor = a.end;
  }
  html += escapeHtmlForTrace(inline.workingDraft.slice(cursor));
  viewer.innerHTML = html.replace(/\n/g, '<br>');
  viewer.querySelectorAll('.ann').forEach((el) => {
    el.addEventListener('mouseenter', onAnnHover);
    el.addEventListener('mouseleave', onAnnLeave);
    el.addEventListener('click', onAnnClick);
  });
  // Highlight unresolved annotations so the user knows the quote drifted.
  const unresolved = inline.annotations.filter((a) => a.status === 'open' && a.start < 0).length;
  if (unresolved > 0) {
    viewer.insertAdjacentHTML(
      'afterbegin',
      `<div class="ann-unresolved-note">${unresolved} flag${unresolved === 1 ? "" : "s"} could not be matched against the current draft (quote drift). See sidebar.</div>`
    );
  }
}

function onAnnHover(e) {
  if (stickyCardId) return;
  positionAnnCard(e.currentTarget);
}
function onAnnLeave() {
  if (stickyCardId) return;
  removeAnnCard();
}
function onAnnClick(e) {
  const el = e.currentTarget;
  if (stickyCardId === el.dataset.annId) {
    stickyCardId = null;
    removeAnnCard();
  } else {
    stickyCardId = el.dataset.annId;
    positionAnnCard(el);
  }
}

function removeAnnCard() {
  const c = document.getElementById('ann-card');
  if (c) c.remove();
}

function positionAnnCard(el) {
  const a = inline.annotations.find((x) => x.id === el.dataset.annId);
  if (!a) return;
  removeAnnCard();
  const card = document.createElement('div');
  card.id = 'ann-card';
  card.className = `ann-card ann-card-${a.severity}`;
  const suggestedHtml = a.suggested
    ? `<div class="ann-card-suggest"><span class="ann-card-label">Suggested:</span> ${escapeHtmlForTrace(a.suggested)}</div>`
    : '';
  card.innerHTML = `
    <div class="ann-card-head">
      <span class="ann-card-cat ann-card-${a.severity}">${escapeHtmlForTrace(a.category)}</span>
      <span class="ann-card-sev ann-card-sev-${a.severity}">${a.severity}</span>
    </div>
    <div class="ann-card-why">${escapeHtmlForTrace(a.why)}</div>
    ${suggestedHtml}
    <div class="ann-card-actions">
      <button class="btn btn-small" data-act="accept">Accept</button>
      <button class="btn btn-small" data-act="reject">Reject</button>
      <button class="btn btn-small" data-act="snooze">Snooze</button>
    </div>
  `;
  document.body.appendChild(card);
  const rect = el.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  let left = rect.left + window.scrollX;
  let top = rect.bottom + window.scrollY + 6;
  if (left + cardRect.width > window.innerWidth - 12) left = Math.max(12, window.innerWidth - cardRect.width - 12);
  card.style.left = `${left}px`;
  card.style.top = `${top}px`;
  card.querySelectorAll('button[data-act]').forEach((b) => {
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      handleAnnAction(a.id, b.dataset.act);
    });
  });
}

function handleAnnAction(annId, act) {
  const a = inline.annotations.find((x) => x.id === annId);
  if (!a) return;
  if (act === 'accept') {
    resolveAnnotationOffsets();
    const current = inline.annotations.find((x) => x.id === annId);
    if (current.start >= 0 && a.suggested) {
      const isDelete = /^\(?\s*delete\s*\)?$/i.test(a.suggested.trim());
      const repl = isDelete ? '' : a.suggested;
      let before = inline.workingDraft.slice(0, current.start);
      let after = inline.workingDraft.slice(current.end);
      if (isDelete) {
        before = before.replace(/\s+$/, '');
        after = after.replace(/^\s+/, '');
        if (before && after && !/[\s\n]$/.test(before) && !/^[\s\n]/.test(after)) {
          before = before + ' ';
        }
      }
      inline.workingDraft = before + repl + after;
    }
    a.status = 'accepted';
  } else if (act === 'reject') {
    a.status = 'rejected';
  } else if (act === 'snooze') {
    a.status = 'snoozed';
  }
  stickyCardId = null;
  removeAnnCard();
  renderInlineCoach();
}

function renderInlineCoach() {
  $('inline-coach-section').style.display = '';
  $('inline-coach-summary').innerHTML = inline.summary
    ? `<strong>Read:</strong> ${escapeHtmlForTrace(inline.summary)}`
    : '';
  const counts = countAnnotations();
  $('inline-coach-stats').innerHTML = `
    <strong>${counts.open}</strong> open
    · <span class="stat-high">${counts.openHigh} high</span>
    · <span class="stat-med">${counts.openMed} medium</span>
    · <span class="stat-low">${counts.openLow} low</span>
    · ${counts.accepted} accepted
    · ${counts.rejected} rejected${counts.snoozed ? ` · ${counts.snoozed} snoozed` : ''}
  `;
  renderAnnotatedDraft();
  renderInlineSidebar();
}

function countAnnotations() {
  const out = { open: 0, openHigh: 0, openMed: 0, openLow: 0, accepted: 0, rejected: 0, snoozed: 0 };
  for (const a of inline.annotations) {
    if (a.status === 'open') {
      out.open++;
      if (a.severity === 'high') out.openHigh++;
      else if (a.severity === 'medium') out.openMed++;
      else out.openLow++;
    } else if (a.status === 'accepted') out.accepted++;
    else if (a.status === 'rejected') out.rejected++;
    else if (a.status === 'snoozed') out.snoozed++;
  }
  return out;
}

function renderInlineSidebar() {
  const aside = $('inline-coach-sidebar');
  const sevRank = { high: 3, medium: 2, low: 1 };
  const open = inline.annotations
    .filter((a) => a.status === 'open')
    .sort((a, b) => sevRank[b.severity] - sevRank[a.severity]);
  if (open.length === 0) {
    aside.innerHTML = `<p class="empty">${inline.annotations.length ? 'No open flags remaining.' : 'Clean draft — no flags.'}</p>`;
    return;
  }
  let html = '<h3>Open flags</h3><ul class="ann-list">';
  for (const a of open) {
    const trunc = a.quote.length > 80 ? a.quote.slice(0, 80) + '…' : a.quote;
    const suggest = a.suggested ? `<div class="ann-list-suggest">→ ${escapeHtmlForTrace(a.suggested)}</div>` : '';
    const unresolved = a.start < 0 ? '<span class="ann-list-unresolved">unmatched</span>' : '';
    html += `
      <li class="ann-list-item ann-list-${a.severity}" data-ann-id="${a.id}">
        <div class="ann-list-head">
          <span class="ann-list-cat">${escapeHtmlForTrace(a.category)}</span>
          <span class="ann-list-sev ann-list-sev-${a.severity}">${a.severity}</span>
          ${unresolved}
        </div>
        <div class="ann-list-quote">"${escapeHtmlForTrace(trunc)}"</div>
        <div class="ann-list-why">${escapeHtmlForTrace(a.why)}</div>
        ${suggest}
        <div class="ann-list-actions">
          <button class="btn btn-small" data-act="accept" data-ann-id="${a.id}">Accept</button>
          <button class="btn btn-small" data-act="reject" data-ann-id="${a.id}">Reject</button>
          <button class="btn btn-small" data-act="snooze" data-ann-id="${a.id}">Snooze</button>
        </div>
      </li>`;
  }
  html += '</ul>';
  aside.innerHTML = html;
  aside.querySelectorAll('button[data-ann-id]').forEach((b) => {
    b.addEventListener('click', () => handleAnnAction(b.dataset.annId, b.dataset.act));
  });
}

async function runInlineCritiqueOnDraft(source) {
  persistKey();
  const apiKey = $('api-key').value.trim();
  if (!apiKey) { setStatus('Paste your Anthropic API key first.', 'err'); return; }
  const draft = source === 'input'
    ? $('draft-input').value.trim()
    : (inline.lastDraftedEmail || '').trim();
  if (!draft) {
    setStatus(source === 'input' ? 'Paste a draft in the textarea first.' : 'No drafted email to critique yet.', 'err');
    return;
  }
  const btnId = source === 'input' ? 'critique-draft-inline' : 'critique-output-inline';
  const btn = $(btnId);
  const origLabel = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = 'Critiquing…'; }
  setStatus(`Running inline critic on ${source === 'input' ? 'pasted draft' : 'drafted email'}…`, 'ok');
  try {
    const result = await runInlineCritic({
      apiKey,
      model: 'claude-sonnet-4-6',
      draft,
      intent: 'cold-email',
      onEvent: handlePipelineEvent,
    });
    inline.source = source;
    inline.originalDraft = draft;
    inline.workingDraft = draft;
    inline.summary = result.summary || '';
    inline.intent = result.intent || 'cold-email';
    inline.annotations = (result.annotations || []).map((a) => ({ ...a, status: 'open', start: -1, end: -1 }));
    renderInlineCoach();
    $('inline-coach-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    const n = inline.annotations.length;
    setStatus(`Inline critique done. ${n} flag${n === 1 ? '' : 's'}.`, 'ok');
  } catch (err) {
    setStatus(`Inline critique failed: ${err.message}`, 'err');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = origLabel; }
  }
}

function acceptAllInline() {
  resolveAnnotationOffsets();
  const opens = inline.annotations
    .filter((a) => a.status === 'open' && a.start >= 0)
    .sort((a, b) => b.start - a.start);
  for (const a of opens) {
    handleAnnAction(a.id, 'accept');
  }
}

function resetInline() {
  inline.workingDraft = inline.originalDraft;
  inline.annotations.forEach((a) => { a.status = 'open'; });
  renderInlineCoach();
}

function copyWorkingDraft() {
  if (!inline.workingDraft) return;
  navigator.clipboard.writeText(inline.workingDraft).then(
    () => setStatus('Copied working draft to clipboard.', 'ok'),
    () => setStatus('Clipboard copy failed.', 'err')
  );
}

function applyWorkingDraftToInput() {
  if (!inline.workingDraft) return;
  $('draft-input').value = inline.workingDraft;
  setStatus('Working draft copied into the draft-input field. Re-run the coach for a full pipeline pass on it.', 'ok');
}

// Close sticky card when clicking outside
document.addEventListener('click', (e) => {
  if (!stickyCardId) return;
  const card = document.getElementById('ann-card');
  if (!card) return;
  if (card.contains(e.target)) return;
  if (e.target.closest('.ann')) return;
  stickyCardId = null;
  removeAnnCard();
});

// ---------- Wire up ----------

function init() {
  loadStored();
  $('run').addEventListener('click', run);
  $('load-about').addEventListener('click', loadAboutFromFile);
  $('clear-about').addEventListener('click', clearAbout);
  $('api-key').addEventListener('change', persistKey);
  $('model').addEventListener('change', persistModel);
  $('about-me').addEventListener('change', persistAbout);
  $('enable-search').addEventListener('change', persistSearch);
  $('enable-humanize').addEventListener('change', persistHumanize);
  $('enable-cross-review').addEventListener('change', persistReview);
  $('reviewer-model').addEventListener('change', persistReviewModel);
  $('mode').addEventListener('change', persistMode);
  $('show-raw').addEventListener('click', () => {
    const r = $('raw');
    r.style.display = r.style.display === 'none' ? 'block' : 'none';
    $('show-raw').textContent = r.style.display === 'none' ? 'Show raw response' : 'Hide raw response';
  });

  $('critique-draft-inline').addEventListener('click', () => runInlineCritiqueOnDraft('input'));
  $('critique-output-inline').addEventListener('click', () => runInlineCritiqueOnDraft('output'));
  $('inline-coach-accept-all').addEventListener('click', acceptAllInline);
  $('inline-coach-reset').addEventListener('click', resetInline);
  $('inline-coach-copy').addEventListener('click', copyWorkingDraft);
  $('inline-coach-apply').addEventListener('click', applyWorkingDraftToInput);

  // Optional dev convenience: load a local-only key file (gitignored)
  import('./.local-key.js').catch(() => {}).then((m) => {
    if (m && m.LOCAL_API_KEY && !$('api-key').value) {
      $('api-key').value = m.LOCAL_API_KEY;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
