# The browser UI

Two pages. Useful if you don't live in Claude Code. Every skill the UI invokes is also installable directly into Claude Code or Cowork, so treat this as one entry point, not a requirement.

| Page | Needs | What it does |
|---|---|---|
| [`index.html`](index.html) | Nothing. Open it in a browser. | Offline Draft Critic: banned-word and AI-tell highlighter, heuristic scores, pre-send checklist, copy-a-critique-prompt |
| [`coach.html`](coach.html) | An Anthropic API key and a local HTTP server | Claude-powered Coach: drafts a cold email through an agentic pipeline, or critiques an existing draft span-by-span with Accept / Reject / Refine |

## Page 1 — `index.html` — Draft Critic (offline)

No build, no server, no API key. Runs entirely client-side; pastes never leave your machine. Deployed as-is to GitHub Pages at [kalyvask.github.io/winning-writing](https://kalyvask.github.io/winning-writing/).

- **Audience input first.** Name the reader before you write.
- **Mode picker** (cold-email / op-ed / pitch / gratitude / general) sets the target word count and the right pre-send checklist.
- Live word count and reading time.
- **Banned-jargon and AI-tell highlighter** with categorized hits. The list lives in `data.js` and is a hand-maintained copy of `points/banned-jargon.md`; `node tools/jargon-coverage.mjs` at the repo root reports drift.
- Heuristic scores for **BLUF, Story, Rhythm (anti-choppy), Audience**, 0–10 with one-line notes.
- **Copy critique prompt** builds a Claude-ready prompt with audience + draft + mode + rules and copies it to the clipboard.
- Six-word summary scratchpad.
- Key-principles panel: 18 principle groups, editable in `data.js`.

Use it for fast iterative feedback while you write.

## Page 2 — `coach.html` — LLM-powered Coach

Runs Claude end-to-end from the browser. Calls go browser-direct to `api.anthropic.com`. Your API key sits in localStorage on your machine and is never sent anywhere else.

### Setup

1. Get an Anthropic API key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).
2. Serve the **repo root** over HTTP so the Coach can fetch the rule library (`points/`, `skills/`, `bundles.json`):

   ```bash
   # from the repo root, not from ui/
   python -m http.server 8770
   ```

   Open `http://localhost:8770/ui/coach.html`.
3. Paste your key into the API field. It persists across sessions.
4. Pick a model. Sonnet 4.6 is the default (fast and good); Opus 4.8 for the highest quality; Haiku 4.5 for cheap.

For local dev, drop a gitignored file at `ui/.local-key.js`:

```js
export const LOCAL_API_KEY = 'sk-ant-...';
```

Coach auto-loads it when the API key field is empty. The repo ships with no keys.

### Drafting: the three pipeline modes

You fill in the recipient (name, role, links, anything you've read about them), about you (auto-loaded from `context/about-me.md` or pasted inline), the ask (what you want, why now, what you can offer), and optionally an existing draft. Then pick how much orchestration you want:

| Mode | Calls | Time | Est. cost | What it does |
|---|---|---|---|---|
| **Single-shot + polish** *(default)* | 2–5 | 40–90s | $0.12–0.18 | Opus 4.8 drafts in one call; a Haiku planner reads the email and decides which surgical passes to run (style-tells, humanize, warmth-and-competence); only the relevant passes execute. |
| **Full agentic** | 7–10 | 60–150s | $0.30–0.80 | Per-step pipeline: researcher (Sonnet + `web_search`) → connection-finder (Sonnet) → drafter (Opus 4.8) → surgical edits (Haiku, parallel) → warmth + competence audit (Sonnet) → rubric scorer (Sonnet). Every step is a separate call with its own prompt and model, streamed to the UI with latency and tokens per step. |
| **Single-shot** | 1 | 30–80s | $0.10 | One Opus call with the full megaprompt. Fast and cheap but the routing is invisible. |

The pipeline implementation and every per-step prompt live in [`agents.js`](agents.js). The humanize pass in the pipeline never introduces typos; the `humanize` skill's typo behaviour is opt-in via `--typo` and the pipeline does not opt in.

### Critiquing: inline critic + refinement chat

The **Critique inline** button makes one Sonnet call (rule library cached as the system block) and returns span-level annotations, each with a `quote`, `severity`, `category`, one-sentence `why`, `suggested` rewrite, and a `rule_source` pointing at the exact `points/` or `skills/` file. A **Critic intent** dropdown picks the rule bundle (`cold-email`, `exec-memo`, `performance-review`, `op-ed`, `pitch`, `general`) from `bundles.json`; the choice persists across reloads.

The annotated viewer paints severity-coded highlights. Hover a span for the rule card, click to pin it. Each card carries **Accept / Reject / Snooze**. Accept edits a working draft; the original stays untouched until **Apply to draft input**. Unmatched quotes (model quote not found verbatim) are surfaced rather than dropped.

A **refinement chat** below the viewer takes plain-English follow-ups (*"cut 30 words," "move the ask earlier"*): rewrites update the working draft, questions return a short evaluation. **Re-critique** re-runs the critic on the refined draft. If **About me** is filled in, it is passed as an additional cached voice block so the critic doesn't flag your settled style and rewrites stay in your voice.

The rule library loads at runtime from `points/*.md` and the surgical skills' `SKILL.md` files. Edit a rule file, refresh, and the critic reflects the change. No prompt rewrite, no code change.

### Diff view

After Accepting flags (or a refinement rewrite), **Show diff** opens a side-by-side view: deletions struck through on the left, additions highlighted on the right. Hover any change for the rule that fired; an **Edits applied** sidebar lists each accepted edit with its rule source. Computed with a word-level LCS. **Copy diff (markdown)** produces a shareable before/after block.

## Files

```
ui/
├── index.html / app.js / data.js     Draft Critic (offline). data.js holds the highlighter lists and principles.
├── coach.html / coach.js             Coach page and its UI logic
├── coach-prompt.js                   The single-shot megaprompt
├── cross-model-prompt.js             The cross-model review gate prompt
├── agents.js                         Every pipeline runner and per-step prompt; also the inline critic and refiner.
│                                     Mirrored verbatim into side-panel-coach/lib/agents.js by tools/sync-rules.mjs,
│                                     and imported by eval/lib/critic.mjs. Keep it free of top-level browser globals.
├── skill-loader.js                   Fetches bundles.json + points/ + skills/ and builds the rule-library block
└── styles.css
```

Regression coverage for the inline critic lives in [`../eval/`](../eval/).
