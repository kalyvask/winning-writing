import { SYSTEM_PROMPT } from './coach-prompt.js';

const $ = (id) => document.getElementById(id);
const KEY_STORE = 'winning-writing.coach.apikey';
const MODEL_STORE = 'winning-writing.coach.model';
const ABOUT_STORE = 'winning-writing.coach.about-me';

// ---------- Init ----------

function loadStored() {
  $('api-key').value = localStorage.getItem(KEY_STORE) || '';
  const storedModel = localStorage.getItem(MODEL_STORE);
  if (storedModel) $('model').value = storedModel;
  const storedAbout = localStorage.getItem(ABOUT_STORE);
  if (storedAbout) $('about-me').value = storedAbout;
}

function persistKey() {
  const k = $('api-key').value.trim();
  if (k) localStorage.setItem(KEY_STORE, k);
}
function persistModel() {
  localStorage.setItem(MODEL_STORE, $('model').value);
}
function persistAbout() {
  localStorage.setItem(ABOUT_STORE, $('about-me').value);
}

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

// ---------- Build user message ----------

function buildUserMessage() {
  const r = {
    name: $('r-name').value.trim(),
    role: $('r-role').value.trim(),
    links: $('r-links').value.trim(),
    context: $('r-context').value.trim(),
  };
  const aboutMe = $('about-me').value.trim();
  const ask = $('ask').value.trim();
  const whyNow = $('why-now').value.trim();
  const offer = $('offer').value.trim();
  const draft = $('draft-input').value.trim();

  if (!r.name || !r.role || !ask) {
    throw new Error('Please fill in: recipient name, role, and your ask.');
  }
  if (!aboutMe) {
    throw new Error('Please add a brief about-me (or click "Load from context/about-me.md").');
  }

  let msg = `# Recipient\n`;
  msg += `**Name:** ${r.name}\n`;
  msg += `**Role / company:** ${r.role}\n`;
  if (r.links) msg += `**Public links:**\n${r.links}\n\n`;
  if (r.context) msg += `**Context the user gathered:**\n${r.context}\n\n`;

  msg += `\n# About me (the sender)\n${aboutMe}\n`;

  msg += `\n# The ask\n${ask}\n`;
  if (whyNow) msg += `\n**Why now:** ${whyNow}\n`;
  if (offer) msg += `\n**Offer in return:** ${offer}\n`;

  if (draft) {
    msg += `\n# Existing draft\nThe user has a draft. Critique it line-by-line first, then produce the rewrite in the "Email" section.\n\n${draft}\n`;
  } else {
    msg += `\n# Mode\nNo draft provided — write the email from scratch using the pipeline above.\n`;
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
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
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
    throw new Error(`Anthropic API ${res.status}: ${errBody.slice(0, 500)}`);
  }
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  return { text, usage: data.usage };
}

// ---------- Render ----------

function setStatus(msg, kind = '') {
  const el = $('status');
  el.textContent = msg;
  el.className = `status ${kind}`;
}

function setHint(msg) {
  $('output-hint').textContent = msg;
}

function renderMarkdown(md) {
  // Minimal markdown renderer — headings, bold, italic, lists, tables, hr, code, paragraphs.
  const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = md.split(/\r?\n/);
  let html = '';
  let inUL = false;
  let inOL = false;
  let inTable = false;
  let tableRows = [];
  let inCode = false;
  let codeBuf = [];
  let para = [];

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
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    return s;
  }

  for (const raw of lines) {
    const line = raw;

    // Code fences
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

    // Tables — pipe-delimited
    if (/^\|.+\|/.test(line)) {
      flushPara(); flushUL(); flushOL();
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (!inTable) inTable = true;
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headings
    const h = line.match(/^(#{1,6})\s+(.*)/);
    if (h) {
      flushPara(); flushUL(); flushOL();
      const level = Math.min(h[1].length + 1, 6);
      html += `<h${level}>${inlineFmt(h[2])}</h${level}>\n`;
      continue;
    }
    // HR
    if (/^---+$/.test(line.trim())) {
      flushPara(); flushUL(); flushOL();
      html += '<hr>\n';
      continue;
    }
    // OL
    const ol = line.match(/^\s*\d+\.\s+(.*)/);
    if (ol) {
      flushPara(); flushUL();
      if (!inOL) { html += '<ol>\n'; inOL = true; }
      html += `<li>${inlineFmt(ol[1])}</li>\n`;
      continue;
    }
    // UL
    const ul = line.match(/^\s*[-*]\s+(.*)/);
    if (ul) {
      flushPara(); flushOL();
      if (!inUL) { html += '<ul>\n'; inUL = true; }
      html += `<li>${inlineFmt(ul[1])}</li>\n`;
      continue;
    }
    // Blank line
    if (line.trim() === '') {
      flushPara(); flushUL(); flushOL();
      continue;
    }
    // Paragraph
    para.push(line);
  }
  flushPara(); flushUL(); flushOL(); flushTable();
  if (inCode) html += `<pre><code>${escape(codeBuf.join('\n'))}</code></pre>`;
  return html;
}

function renderOutput(text) {
  $('output').innerHTML = renderMarkdown(text);
  $('raw').textContent = text;
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
  setHint('Calling Claude — typically 10–25 seconds…');
  setStatus('Calling Claude…', 'ok');

  try {
    persistKey();
    persistModel();
    persistAbout();
    const t0 = performance.now();
    const { text, usage } = await callClaude(userMessage);
    const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
    renderOutput(text);
    const u = usage || {};
    setStatus(
      `Done in ${elapsed}s · ${u.input_tokens || '?'} in / ${u.output_tokens || '?'} out tokens`,
      'ok'
    );
  } catch (err) {
    setStatus(err.message, 'err');
    setHint('Failed. See status above. Common fixes: check API key, check internet, try a different model.');
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
  $('api-key').addEventListener('change', persistKey);
  $('model').addEventListener('change', persistModel);
  $('about-me').addEventListener('change', persistAbout);
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
