# Winning Writing

> 31 Claude skills for cold outreach, op-eds, pitches, press inquiries, and bios. Distilled from Stanford GSB's *Winning Writing* (Glenn Kramon, GSBGEN 352), Rachel Konrad's cold-outreach lectures, and Andrew Ross Sorkin's reporter playbook. Run them from Claude Code, from Cowork, from a three-mode browser Coach with a span-level inline critic and refinement chat, or from a Chrome side panel that imports the active Gmail compose.

## The shortest path

```bash
git clone https://github.com/kalyvask/winning-writing
cp -r winning-writing/skills/* ~/.claude/skills/
```

Open Claude Code (or Cowork), drop a draft into the chat, and say *"critique this cold email"* — Claude auto-triggers `cold-email-coach`, runs the rubric, calls in `recipient-research`, `connection-finder`, `tell-them-something-new`, `em-dash-killer`, `humanize`, and whichever else applies. The skills compose. No UI to open, nothing to paste between windows.

## Four ways to use this

The same skills power all four. Pick whichever fits where you already work.

### 1. Claude Code (recommended — fastest, most powerful)

Skills live at `~/.claude/skills/`. Claude auto-triggers them based on what you're doing. You can chain them by name (*"now run `humanize` on the result"*), inspect each `SKILL.md` to see exactly what it does, and edit any one of them to your taste. Web search, file editing, and multi-step orchestration all happen in-process — there's nothing the UI does that Claude Code doesn't do better.

### 2. Cowork (desktop, no terminal)

Point Cowork at the repo folder. The skills get picked up automatically. Set Settings → Cowork → Edit Global Instructions to *"Before every task, read everything in my `context/` files."* Same pipeline, no command line.

### 3. The browser UI (now an agentic pipeline of its own)

`ui/coach.html` ships with a mode selector. Pick how much orchestration you want:

| Mode | Calls | Time | Est. cost | What it does |
|---|---|---|---|---|
| **Single-shot + polish** *(default)* | 2–5 | 40–90s | $0.12–0.18 | Opus 4.7 drafts in one call; a Haiku planner reads the email and decides which surgical passes to run (em-dash, adverb, jargon, humanize, warmth-competence); only the relevant passes execute. The planner is the agent — it routes around skills that aren't needed. |
| **Full agentic** | 7–10 | 60–150s | $0.30–0.80 | Per-step pipeline: researcher (Sonnet + `web_search`) → connection-finder (Sonnet) → drafter (Opus 4.7) → surgical edits (Haiku, parallel) → warmth + competence audit (Sonnet) → rubric scorer (Sonnet). Every step is a separate call with its own prompt and model. Streaming trace shows latency + tokens per step and an "Inspect output" details block for each. |
| **Single-shot** | 1 | 30–80s | $0.10 | Original behavior. One Opus call with the full megaprompt. Fast and cheap but the routing is invisible. |

The single-shot mode is one call with embedded instructions — it's not really agentic, it just looks like one big prompt to the model. The two new modes route between agents explicitly: single-shot+polish has a planner deciding what to apply, full-agentic has a chain of specialized agents composing into a final output. Both stream to the UI in real time so you can audit each step.

**Claude Code is still the most powerful path** — it auto-routes between all 31 skills based on what you're doing, has tool access for file edits, and skips the browser entirely. The Coach UI exists for people who want a form, plus now an agentic pipeline they can inspect step by step.

Beyond the three pipeline modes, the Coach also ships a **span-level inline critic** that highlights specific words and sentences against the rule library, with Accept / Reject / Snooze per flag and a refinement chat for multi-turn iteration. See [The UI](#the-ui-optional-now-agentic) below.

### 4. Chrome extension (Gmail side panel)

`extension/` ships a Manifest V3 extension that puts the inline critic in the Chrome side panel next to Gmail. One click imports the active compose body; the critic runs against the same bundled rule library (5 point docs + 12 SKILL.md files snapshotted into `extension/rules/`). API key sits in `chrome.storage.local`; calls go browser-direct to `api.anthropic.com`. No backend.

Load unpacked from `chrome://extensions` — full install in [`extension/README.md`](extension/README.md).

## How it works in one sentence

Claude reads the skills and principles in this repo as its operating system, runs through them in order on whatever draft or pitch you bring, and returns a complete cold-outreach package: dossier synthesis → connection angles → subject lines → drafted email → 12-dimension rubric score → flags to verify before sending.

The rules are not in the model's training — they're loaded from `skills/` and `points/` at runtime. That's the whole point: Glenn Kramon's class is opinionated, the banned-word list is enforced, and the LLM follows *those* rules, not its own median instincts.

## About

Five pieces:

- **`points/`** — distilled rules and frameworks. The "what."
- **`skills/`** — 31 focused Claude skills (`SKILL.md` files). The "how."
- **`context/`** — `about-me.md` + `voice-and-style.md` so Claude writes in your voice, not generic AI voice. Update them incrementally via `voice-commit` (manual merge), `voice-consolidator` (batch pull from Claude Code's auto-memory), or `voice-from-sent-mail` (audit recent Gmail sent mail against the voice file).
- **`ui/`** — optional browser pages: an offline draft critic, and a Claude-powered Coach with a span-level inline critic and refinement chat. Not needed if you're already in Claude Code.
- **`extension/`** — Chrome MV3 extension that runs the inline critic in the side panel and imports the active Gmail compose. Personal-use, load unpacked.

Built because most cold emails, op-eds, and memos read the same — hedged, jargon-heavy, AI-flavored. The principles here are opinionated and the banned-word list is enforced. I drafted with Claude as a sparring partner, then rewrote every line by hand so it doesn't sound like one. If you spot a "delve," a "tapestry," or five short sentences in a row, open an issue — that's the bug this repo exists to prevent.

## Personalize this for your own use

If you forked or cloned this repo, do these seven steps in order before running anything. The whole point of the toolkit is that Claude critiques *your* writing against *your* voice — until you fill in the context files, every output is generic.

1. **Install the skills.** `cp -r skills/* ~/.claude/skills/` on macOS/Linux; copy `skills\*` into `%USERPROFILE%\.claude\skills\` on Windows. Each skill is a self-contained `SKILL.md` — Claude Code loads them on next session start. (Skip this step if you're using Cowork — point Cowork at the repo folder and it picks them up.)

2. **Edit `context/about-me.md`.** Open the file and replace every bracketed placeholder with the real thing. Look for: `[Your name]`, `[role / title]`, `[the thing you're working on right now]`, `[N years]` of prior experience, `[the through-line that makes your career make sense]`, your **Primary focus** / **Secondary** / **Public output** bullets, the "How I think" paragraph, the five "What you (Claude) should know" bullets, and your contact line. Be specific — named companies, real numbers, actual side projects. Generic in, generic out.

3. **Edit `context/voice-and-style.md`.** Keep the structure (Posture, Sentence structure, Words I like, Banned words, AI tells, Format preferences, Length targets) — those are the rules. Replace the four **Sample paragraph** blocks with three or four paragraphs of your own writing you'd be happy to be cloned from. Leave the "What's working" notes — they teach Claude *why* a paragraph lands. Add or remove banned words to match your taste.

4. **Tell Claude to read your context on every task.** In Claude Code, add this to your project `CLAUDE.md`: *"Before every task, read everything in my `context/` files."* In Cowork, set the same line in Settings → Cowork → Edit Global Instructions. From now on every session starts with Claude knowing your voice.

5. **Drop drafts into a gitignored folder.** Create `drafts/` (or `outputs/`) at the repo root and put any work-in-progress there. Both folders are already in `.gitignore`, as are any files matching `*.draft.md` or `*.private.md`. Nothing in those paths will ever be committed.

6. **(Optional) Set your Anthropic API key for the Coach UI or the Chrome extension.** Skip this step entirely if you're using Claude Code or Cowork — those don't need a separate key. If you do want the UI or the extension: get a key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys). For the UI, paste it into the API field on first load (persists in localStorage on your machine only), or drop it into a gitignored `ui/.local-key.js` file. For the extension, paste it into the panel's Settings (persists in `chrome.storage.local`). The repo ships with no keys.

7. **(Optional) Install the Chrome extension.** Open `chrome://extensions`, toggle Developer mode, click Load unpacked, point at `extension/`. Pin the icon. Click it next to Gmail and the inline critic opens in the side panel. Full instructions in [`extension/README.md`](extension/README.md).

Done. Open Claude Code and try *"draft me a cold email to [person] asking for [thing]"* — Claude will run the full pipeline.

## What's in here

```
context/   Two priming files (about-me.md, voice-and-style.md) — point Claude at these once
points/    Distilled rules and frameworks (the "what")
skills/    Claude skills you can invoke from Claude Code or Cowork (the "how")
ui/        Optional browser entry point — Draft Critic + LLM Coach with inline critic
extension/ Optional Chrome MV3 extension — Coach in the Gmail side panel
```

## The points

Nine reference docs, each focused on one slice of the course:

| File | Covers |
|------|--------|
| [core-rules.md](points/core-rules.md) | The 15 foundational rules (BLUF, audience, concision, warmth) |
| [banned-jargon.md](points/banned-jargon.md) | Words and phrases to kill on sight, with replacements |
| [frameworks.md](points/frameworks.md) | BLUF, S.H.I.T., 7-part pitch, op-ed structure, gratitude formula |
| [cold-email-rules.md](points/cold-email-rules.md) | Konrad's 10 rules + Heidi Roizen's mailing rules |
| [kramon-master.md](points/kramon-master.md) | Full Kramon reference, all four sessions |
| [examples-and-critiques.md](points/examples-and-critiques.md) | Model letters, op-ed headlines, before/after rewrites |
| [ai-writing-rules.md](points/ai-writing-rules.md) | How to use AI without sounding like AI ("centaur" mode) |
| [pre-send-checklist.md](points/pre-send-checklist.md) | The single checklist to run before hitting send |
| [named-failure-modes.md](points/named-failure-modes.md) | 14 named cold-email failure modes (vague ask, credentials dump, generic personalization, AI-tell prose) — what to fix, not just where you scored low |

## The skills

Drop the `skills/` directory into `~/.claude/skills/` (or your Cowork folder) and Claude auto-triggers the right skill for the task. **All flows below run from Claude Code or Cowork — the UI is one entry point, not a requirement.**

### Drafting and critique

| Skill | When it triggers |
|-------|------------------|
| `cold-email-coach` | Drafting or critiquing a cold email, LinkedIn DM, intro request |
| `op-ed-coach` | Drafting an op-ed, opinion piece, or LinkedIn long-form |
| `pitch-coach` | VC pitch, internal pitch, six-word product summary, mission statement |
| `pitch-memo` | Text-first investor memo for pre-seed and seed founders — Constine's 15 questions |
| `gratitude-note-coach` | Thank-you notes, recommendation letters, recognition messages |
| `dealing-with-reporters` | Crisis comms + press inquiries — Sorkin's 11 rules + AP attribution. Names the Sorkin (litigation-first) vs. Tylenol/Kramon (trust-first) school tension explicitly. |
| `yourself-story` | Bios, LinkedIn About, intro slides, "tell me about yourself" — Bryant + Weinstein + the six Kramon model bios |
| `winning-writing-critic` | Grading any draft against the full rubric and returning a rewrite |
| `cross-model-review` | Independent second-model gate before send — must run on a different model than the drafter. Names the specific failure mode from a 14-mode catalog and predicts the recipient's most likely counter-question |

### Cold-outreach pipeline (run in order)

| Skill | When it triggers |
|-------|------------------|
| `recipient-research` | Builds a dossier on the person you're emailing — LinkedIn, podcasts, recent news, distinctive personal details |
| `connection-finder` | Cross-references the dossier and your `about-me.md` for specific, genuine "like you" hooks |
| `warm-intro-finder` | Finds human bridges who can actually introduce you — investors, alumni, ex-colleagues, mentors. Includes the Constine forwardable-blurb template. |
| `graveyard-historian` | When pitching an idea, researches companies that tried it before and died — why, and who survived to talk to |
| `fun-angle` | Finds the dry, self-deprecating, or unexpected line that makes the email memorable — subject lines, openers, sign-offs |
| `tell-them-something-new` | Cuts opener sentences that recap what the recipient already knows — replace with a secret about the future |

### Surgical edits

| Skill | When it triggers |
|-------|------------------|
| `concision-drill` | Cutting a draft to a target word count without losing substance |
| `jargon-killer` | Scrubbing banned words and AI tells |
| `em-dash-killer` | Removing em-dashes — the #1 AI tell in 2026 |
| `adverb-killer` | Cutting empty -ly adverbs and intensifiers (very, really, actually, basically, clearly, obviously) |
| `be-specific` | Replacing generic category nouns with concrete ones — "dog" → German shepherd, "engineer" → John on the payments team |
| `show-dont-tell` | Turning abstract narrative summaries into vivid scenes — "I was angry" → body signal, room, dialogue, moment. The "could a director recreate this?" test. |
| `headline-as-claim` | Rewriting slide titles, section headings, and subject lines from category labels into bold arguable claims |
| `humanize` | Roughening up a too-clean draft — contractions, dropped subjects, the occasional safe typo. Skips automatically on high-stakes pieces. |
| `bluf-rewriter` | Re-organizing so the bottom line is up front |
| `warmth-and-competence` | Auditing on Fiske's two-axis model and finding the one sentence that proves both axes |
| `pick-a-lane` | Diagnosing drafts that tell three half-stories instead of one full one. Cuts whole stories, not just words. |
| `irrelevant-detail-killer` | Cuts cinematic details that are vivid but don't serve the main point. The third-pass refinement after pick-a-lane and show-don't-tell. |
| `kill-redundancy` | Cuts phrases where one half implies the other ("going forward," "as I mentioned," "reduce so they are smaller"). Distinct from jargon-killer, adverb-killer, and concision-drill. |

### Maintaining your voice over time

The two skills below grow your `context/` files incrementally, so the toolkit gets smarter about you with each session instead of staying frozen at whatever you wrote on day one. Both always propose a diff first — they never auto-write.

| Skill | When it triggers |
|-------|------------------|
| `voice-commit` | Manual one-off merge — when you say "save this to my voice file," "remember this style," "this isn't how I write." Routes style notes to `voice-and-style.md` and identity/career notes to `about-me.md` |
| `voice-consolidator` | Batch pull from Claude Code's auto-memory — when you say "consolidate my voice" or "what has Claude learned about my style?" Reads `~/.claude/projects/<project>/memory/` and proposes merges with citation |
| `voice-from-sent-mail` | Reads your last 20–50 sent Gmail messages via the connected Gmail MCP, returns three sections (confirmations / drift candidates / new patterns) against `voice-and-style.md` and `banned-jargon.md`, then proposes per-diff approval. Use when the file feels aspirational and you want it grounded in what you actually send. Composes with `voice-commit` for the writes. |

The pattern borrows from two established shapes: a structured user-triggered logging command (the user says "save this," the system writes only what's authorized), and a merge prompt that preserves old content, merges new content, and flags contradictions instead of overwriting. Auto-learning from every draft is intentionally not supported — it would reinforce AI-tells the model rationalized away. Manual merge with diff approval is the right shape. `voice-from-sent-mail` is the exception: sent mail is ground truth, not a draft the model talked you into.

Each skill has a `SKILL.md` with frontmatter, a checklist, and pointers back to the relevant `points/` file.

## The context files

The single highest-leverage thing you can do with Claude — takes 20 minutes once.

```
context/
├── about-me.md          who you are, what you're working on (brief Claude like a new colleague)
└── voice-and-style.md   how you write — tone, banned phrases, sample paragraphs
```

In Claude Code, add to your project `CLAUDE.md`: *"Before every task, read everything in my `context/` files."* In Cowork, set the same string in Settings → Cowork → Edit Global Instructions. From then on every session starts with Claude knowing your voice.

## The UI (optional, now agentic)

Two browser pages. Useful if you don't live in Claude Code. **Not required for any flow above** — every skill the UI invokes is also installable directly into Claude Code or Cowork. The Coach page (`ui/coach.html`) now runs a real agentic pipeline with per-step model choice and a streaming trace; see *Three ways to use this* above for the mode breakdown.

### Page 1 — `ui/index.html` — Draft Critic (offline)

Open in any browser. No build, no server, no API key. **Runs entirely client-side** — pastes never leave your machine.

What it does:
- **Audience input first** — name the reader before you write
- Pick a mode (cold-email / op-ed / pitch / gratitude / general) → sets the target word count and the right pre-send checklist
- Live word count + reading time
- **Banned-jargon and AI-tell highlighter** with categorized hits
- Heuristic scores: **BLUF, Story, Rhythm (anti-choppy), Audience** — 0–10 with one-line notes
- "Copy critique prompt" — builds a Claude-ready prompt with audience + draft + mode + rules, copies to clipboard so you can paste into Claude.app or anywhere else
- Six-word summary scratchpad
- Key-principles panel — 18 principle groups (over 100 individual rules), editable in `ui/data.js`

Use it for fast iterative feedback while you write.

### Page 2 — `ui/coach.html` — LLM-powered Coach with three modes

This is the one that runs Claude end-to-end from the browser. (Identical capability is available natively in Claude Code — see *Three ways to use this* above.)

**You fill in:**
1. Recipient — name, role, links, anything you've read about them
2. About you — auto-loaded from `context/about-me.md` or pasted inline
3. The ask — what you want, why now, what you can offer
4. (Optional) Existing draft — Coach critiques line-by-line, then rewrites
5. **Mode** — single-shot + polish (default), full agentic, or single-shot

**What runs depends on the mode:**

In **single-shot + polish**, Opus 4.7 drafts the full output (dossier → connections → subject lines → email → rubric) in one call. Then a Haiku planner reads the email and decides which surgical passes to apply (`em-dash-killer`, `adverb-killer`, `jargon-killer`, `humanize`, `warmth-and-competence`). Only the relevant ones run. Skipped passes show as "skipped" in the trace — that's the planner doing its job.

In **full agentic**, the pipeline is decomposed into eight specialized steps, each with its own system prompt and its own model. The researcher uses Sonnet + `web_search` to build a dossier with citations. The connection-finder cross-references it against your about-me. The drafter (Opus 4.7) composes the email from those upstream outputs. Surgical passes run in parallel (Haiku each). Warmth-and-competence audit and rubric scorer run on Sonnet. Each step renders as a card in the pipeline trace the moment it starts, turns green when done with latency + token counts, and offers an "Inspect output" details block.

In **single-shot**, one Opus call with the existing 290-line megaprompt — preserved for cost and speed.

The pipeline implementation lives in [`ui/agents.js`](ui/agents.js); per-step prompts are co-located with the runners. Claude calls happen browser-direct to `api.anthropic.com`. **Your API key sits in localStorage on your machine and is never sent anywhere else.**

#### Inline critic + refinement chat

Below the draft input (and again above the output after the pipeline runs), the Coach exposes a **Critique inline** button. One Sonnet call with the rule library cached as the system block returns span-level annotations: each one carries a `quote`, a `severity` (high / medium / low), a `category`, a one-sentence `why`, a `suggested` rewrite, and a `rule_source` pointing at the exact file in `points/` or `skills/` the rule came from.

The annotated viewer paints the draft with severity-coded highlights. Hover any span for the rule card; click for the sticky version. Each card carries **Accept / Reject / Snooze**: Accept replaces the quote in a working draft (the original stays untouched until you click **Apply to draft input**); Reject and Snooze remove the highlight without changing the text. The sidebar lists all open flags including unmatched quotes (when the model's quote doesn't appear verbatim in the draft, surfaced as "unmatched" rather than silently dropped).

Below the annotated viewer, a **refinement chat** takes plain-English follow-ups: *"cut 30 words," "move the ask earlier," "what's wrong with the opener?"*. Rewrites update the working draft and clear stale annotations; asking a question returns a 1–3 sentence evaluation styled distinctly (amber border) from rewrites (green) and errors (red). **Re-critique** runs the inline critic on the refined draft so you can see what's still broken. The same prompt-cached rule library backs every refinement turn so rewrites stay rule-compliant — every turn pays the cache-hit price (~10% of input cost) on the rule block after the first.

The rule library is loaded at runtime from `points/*.md` and the SKILL.md files of the 12 surgical skills. **Edit a rule file, refresh the page, the critic immediately reflects the change.** No prompt rewrite, no code change — the 31 skills are the live operating system, not decoration.

#### Setup

1. Get an Anthropic API key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Serve the repo root over HTTP so the Coach can fetch the rule library: `python -m http.server 8770` **from the repo root** (not from `ui/`). Open `http://localhost:8770/ui/coach.html`.
3. Paste your key into the API field. It persists across sessions.
4. Pick a model — Sonnet 4.6 is the default (fast + good); Opus 4.7 for the highest quality; Haiku 4.5 for cheap.

#### For local dev

Drop a gitignored file at `ui/.local-key.js`:

```js
export const LOCAL_API_KEY = 'sk-ant-...';
```

Coach auto-loads it when the API key field is empty. The file is in `.gitignore` so it never enters the repo. The repo ships with **no API keys**.

Designed to deploy as-is to GitHub Pages (the offline page).

## The Chrome extension

`extension/` ships a Manifest V3 extension that runs the inline critic in Chrome's side panel next to Gmail. Same prompt-cached rule library, same Accept / Reject / Refine flow as the Coach UI — but loaded by clicking the toolbar icon, with one-click import of the active compose body.

### What's in the bundle

```
extension/
├── manifest.json          MV3 manifest, sidePanel + storage + scripting
├── background.js          Service worker — routes get-compose-text
├── content-script.js      Reads the Gmail compose body (stable role/aria selectors)
├── sidepanel.html / .css / .js   The panel itself
├── lib/agents.js          runInlineCritic + runRefinementTurn (mirror of ui/agents.js)
├── lib/skill-loader.js    Dual-mode loader (chrome.runtime.getURL inside the extension,
│                          relative paths in a browser tab for preview testing)
└── rules/                 Snapshot of 5 points/ docs + 12 skills/ SKILL.md files
```

### Install (unpacked, personal use)

1. Open `chrome://extensions`, toggle **Developer mode**, click **Load unpacked**, point at `extension/`
2. Pin the extension icon
3. Click it → side panel opens; in **Settings**, paste your `sk-ant-...` key (stored in `chrome.storage.local`)
4. Open Gmail, start a Compose, click **Import from Gmail compose** in the panel, then **Critique**

Full install + usage walkthrough in [`extension/README.md`](extension/README.md).

### What it does NOT do (yet)

- Inline highlights directly inside Gmail's compose body (the panel is the surface for now)
- Send-button interception with a pre-send checklist
- Reply-thread context (the import grabs the body, not the quoted thread)
- Auto-sync rules from GitHub — `rules/` is a snapshot; refresh via the PowerShell snippet in the extension README when `points/` or `skills/` change

Each of those is a follow-up sized similar to the v1 itself.

## Sources

- Glenn Kramon's *Winning Writing* (GSBGEN 352.1), Stanford GSB
- Rachel Konrad's guest lectures on cold outreach
- Heidi Roizen's mailing rules
- Adam Bryant on writing about yourself ("desirable confidence") and the *Corner Office* interviews with 500+ CEOs
- Nicholas Kristof's columns and op-ed advice
- Katie Kingsbury (NYT Opinion) on what gets published
- Danny Hertzberg (Base10, ex-Sequoia) on cold outreach
- Josh Constine's *Fundraising & Pitch Deck Guide* (15-question memo, forwardable blurb, slide-titles-as-claims)
- Andrew Ross Sorkin (NYT *DealBook*) on dealing with reporters and crisis comms
- Associated Press attribution definitions (on the record / background / deep background)
- Susan Fiske (Princeton) on warmth + competence
- Lauren Weinstein on the two-axis frame and cinematic narrative ("could a director recreate this scene?")
- Stephen King's *On Writing* on adverbs
- Model bios and class examples discussed in Glenn Kramon's *Winning Writing* (abstracted, not reproduced — the patterns are in `skills/`, the artifacts stayed in the class)

## License

MIT.
