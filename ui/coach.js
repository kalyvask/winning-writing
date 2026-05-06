import { SYSTEM_PROMPT } from './coach-prompt.js';
import { CROSS_MODEL_SYSTEM_PROMPT } from './cross-model-prompt.js';

const $ = (id) => document.getElementById(id);
const KEY_STORE = 'winning-writing.coach.apikey';
const MODEL_STORE = 'winning-writing.coach.model';
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
  const body = renderMarkdown(reviewerText);

  if (verdict === 'PASS') {
    return `<div class="banner good"><strong>✓ Cross-model gate: PASS</strong> — an independent model accepted the email.${modelLine}<details style="margin-top:var(--s-2);"><summary style="cursor:pointer;">Reviewer details</summary>${body}</details></div>`;
  }
  if (verdict === 'FAIL') {
    return `<div class="banner bad"><strong>✗ Cross-model gate: FAIL</strong> — an independent model blocked the email. Address the blockers below before sending.${modelLine}${body}</div>`;
  }
  return `<div class="banner warn"><strong>? Cross-model gate: verdict not parsed</strong> — reviewer output below, judge for yourself.${modelLine}${body}</div>`;
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
}

// ---------- Run ----------

async function run() {
  setStatus('');
  $('output').innerHTML = '';
  $('output-hint').style.display = '';
  setHint('Building prompt…');
  let userMessage;
  try {
    userMessage = buildUserMessage();
  } catch (err) {
    setStatus(err.message, 'err');
    setHint('Fix the form and try again.');
    return;
  }

  const btn = $('run');
  btn.disabled = true;
  const orig = btn.textContent;
  btn.textContent = 'Running…';
  setHint($('enable-search').checked
    ? 'Calling Claude with web_search enabled — typically 30–60 seconds…'
    : 'Calling Claude — typically 10–25 seconds…');
  setStatus('Calling Claude…', 'ok');

  try {
    persistKey(); persistModel(); persistAbout(); persistSearch(); persistHumanize();
    persistReview(); persistReviewModel();
    const t0 = performance.now();
    const { text, usage, searchCount } = await callClaude(userMessage);
    const drafterElapsed = ((performance.now() - t0) / 1000).toFixed(1);

    let reviewerInfo = null;
    let reviewerStatus = '';
    if ($('enable-cross-review').checked) {
      const drafterModel = $('model').value;
      const reviewerModel = pickReviewerModel(drafterModel, $('reviewer-model').value);
      setHint(`Drafter done in ${drafterElapsed}s. Running independent gate on ${reviewerModel}…`);
      setStatus(`Drafter done. Running cross-model gate on ${reviewerModel}…`, 'ok');
      const t1 = performance.now();
      try {
        const apiKey = $('api-key').value.trim();
        const { text: reviewerText, usage: reviewerUsage } = await callClaudeReviewer(userMessage, text, reviewerModel, apiKey);
        const reviewerElapsed = ((performance.now() - t1) / 1000).toFixed(1);
        reviewerInfo = { text: reviewerText, model: reviewerModel, drafterModel };
        const ru = reviewerUsage || {};
        reviewerStatus = ` · gate ${reviewerElapsed}s on ${reviewerModel} (${ru.input_tokens || '?'} in / ${ru.output_tokens || '?'} out)`;
      } catch (reviewerErr) {
        reviewerStatus = ` · gate failed: ${reviewerErr.message.slice(0, 120)}`;
      }
    }

    renderOutput(text, reviewerInfo);
    const u = usage || {};
    const totalElapsed = ((performance.now() - t0) / 1000).toFixed(1);
    setStatus(
      `Done in ${totalElapsed}s · drafter ${drafterElapsed}s (${u.input_tokens || '?'} in / ${u.output_tokens || '?'} out · ${searchCount} web search${searchCount === 1 ? '' : 'es'})${reviewerStatus}`,
      'ok'
    );
  } catch (err) {
    setStatus(err.message, 'err');
    setHint('Failed. See status above. Common fixes: check API key, check internet, try a different model, or disable web search.');
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
}

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
  $('show-raw').addEventListener('click', () => {
    const r = $('raw');
    r.style.display = r.style.display === 'none' ? 'block' : 'none';
    $('show-raw').textContent = r.style.display === 'none' ? 'Show raw response' : 'Hide raw response';
  });

  // Optional dev convenience: load a local-only key file (gitignored)
  import('./.local-key.js').catch(() => {}).then((m) => {
    if (m && m.LOCAL_API_KEY && !$('api-key').value) {
      $('api-key').value = m.LOCAL_API_KEY;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
