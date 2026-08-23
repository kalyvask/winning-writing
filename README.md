# Winning Writing

[![eval](https://github.com/kalyvask/winning-writing/actions/workflows/eval.yml/badge.svg)](https://github.com/kalyvask/winning-writing/actions/workflows/eval.yml)

> 30 Claude skills for cold outreach, op-eds, pitches, press inquiries, bios, exec memos, performance reviews, spoken-delivery talks, and reply-rate tracking. Distilled from Stanford GSB's *Winning Writing* (Glenn Kramon, GSBGEN 352), Rachel Konrad's cold-outreach lectures, and Andrew Ross Sorkin's reporter playbook. Run them from Claude Code, from Cowork, from a three-mode browser Coach with a span-level inline critic and refinement chat, or from a Chrome side panel that imports the active Gmail compose.

## The shortest path

Install as a Claude Code plugin — two commands, no clone:

```
/plugin marketplace add kalyvask/winning-writing
/plugin install winning-writing
```

Skills become available as `/winning-writing:<skill-name>` and update when the plugin version bumps. Or install by copying, if you want to edit the skills as your own:

```bash
git clone https://github.com/kalyvask/winning-writing
cp -r winning-writing/skills/* ~/.claude/skills/
```

Either way: open Claude Code (or Cowork), drop a draft into the chat, and say *"critique this cold email"* — Claude auto-triggers `cold-email-coach`, runs the rubric, calls in `recipient-research`, `connection-finder`, `tell-them-something-new`, `style-tells`, `humanize`, and whichever else applies. The skills compose. No UI to open, nothing to paste between windows.

To try the offline Draft Critic without installing anything: [kalyvask.github.io/winning-writing](https://kalyvask.github.io/winning-writing/) — runs entirely client-side, no API key, pastes never leave your machine.

## Four ways to use this

The same skills power all four. Pick whichever fits where you already work.

### 1. Claude Code (recommended)

Skills live at `~/.claude/skills/`. Claude auto-triggers them based on what you're doing. You can chain them by name (*"now run `humanize` on the result"*), inspect each `SKILL.md` to see exactly what it does, and edit any one of them to your taste. Web search, file editing, and multi-step orchestration all happen in-process.

### 2. Cowork (desktop, no terminal)

Point Cowork at the repo folder. The skills get picked up automatically. Set Settings → Cowork → Edit Global Instructions to *"Before every task, read everything in my `context/` files."* Same pipeline, no command line.

### 3. The browser UI

`ui/coach.html` ships with a mode selector. Pick how much orchestration you want:

| Mode | Calls | Time | Est. cost | What it does |
|---|---|---|---|---|
| **Single-shot + polish** *(default)* | 2–5 | 40–90s | $0.12–0.18 | Opus 4.8 drafts in one call; a Haiku planner reads the email and decides which surgical passes to run (style-tells, humanize, warmth-and-competence); only the relevant passes execute. The planner is the agent — it routes around skills that aren't needed. |
| **Full agentic** | 7–10 | 60–150s | $0.30–0.80 | Per-step pipeline: researcher (Sonnet + `web_search`) → connection-finder (Sonnet) → drafter (Opus 4.8) → surgical edits (Haiku, parallel) → warmth + competence audit (Sonnet) → rubric scorer (Sonnet). Every step is a separate call with its own prompt and model. Streaming trace shows latency + tokens per step and an "Inspect output" details block for each. |
| **Single-shot** | 1 | 30–80s | $0.10 | Original behavior. One Opus call with the full megaprompt. Fast and cheap but the routing is invisible. |

Single-shot is one call with embedded instructions. The other two route between agents explicitly: single-shot+polish has a planner deciding what to apply; full-agentic chains specialized agents into a final output. Both stream to the UI so you can audit each step.

Beyond the three pipeline modes, the Coach also ships a **span-level inline critic** that highlights specific words and sentences against the rule library, with Accept / Reject / Snooze per flag and a refinement chat for multi-turn iteration. See [The UI](#the-ui-optional) below.

### 4. Chrome extensions — pick by where you compose

> **Composing in Gmail or LinkedIn? → [`inline-coach`](inline-coach/)**
> **Critiquing a cold email from the Gmail side panel? → [`side-panel-coach`](side-panel-coach/)**

Two MV3 extensions, same bundled rule library, different surfaces. Install one or both.

- **[`inline-coach/`](inline-coach/)** — auto-attaches to Gmail compose AND LinkedIn DM surfaces (overlay bubble, full-page thread, InMail). Recipient parsing, connection-angle suggestions, S.H.I.T. pre-send checklist. Cold-email intent. Vite + React + TS; `npm run build` once before loading.
- **[`side-panel-coach/`](side-panel-coach/)** — opens in Chrome's side panel when you click the toolbar icon. One-click import of the active Gmail compose. Cold-email critic (the rule loader supports all six intents; the panel UI doesn't expose a picker yet — use the Coach UI for other intents), opt-in pre-send gate, opt-in "Live from GitHub" rule source. Gmail only. Vanilla JS, no build step.

API key in `chrome.storage.local`; calls go browser-direct to `api.anthropic.com`. No backend on either. Load unpacked from `chrome://extensions`.

## How it works in one sentence

Claude reads the skills and principles in this repo as its operating system, runs through them in order on whatever draft or pitch you bring, and returns a complete cold-outreach package: dossier synthesis → connection angles → subject lines → drafted email → 12-dimension rubric score → flags to verify before sending.

The rules are not in the model's training — they're loaded from `skills/` and `points/` at runtime. That's the whole point: Glenn Kramon's class is opinionated, the banned-word list is enforced, and the LLM follows *those* rules, not its own median instincts.

## About

Five pieces:

- **`points/`** — distilled rules and frameworks. The "what."
- **`skills/`** — 30 focused Claude skills (`SKILL.md` files). The "how."
- **`context/`** — `about-me.md` + `voice-and-style.md` so Claude writes in your voice, not generic AI voice. Update them incrementally via `voice-update --source manual` (one rule at a time), `voice-update --source memory` (batch pull from Claude Code's auto-memory), or `voice-update --source sent-mail` (audit recent Gmail sent mail against the voice file).
- **`ui/`** — optional browser pages: an offline draft critic, and a Claude-powered Coach with a span-level inline critic and refinement chat. Not needed if you're already in Claude Code.
- **`side-panel-coach/`** and **`inline-coach/`** — two Chrome MV3 extensions backed by the same rule library. `side-panel-coach` opens in Chrome's side panel on click and supports multiple critic intents; `inline-coach` auto-attaches to Gmail and LinkedIn compose surfaces. Personal-use, load unpacked.

Built because most cold emails, op-eds, and memos read the same — hedged, jargon-heavy, AI-flavored. The principles here are opinionated and the banned-word list is enforced. I drafted with Claude as a sparring partner, then rewrote every line by hand so it doesn't sound like one. If you spot a "delve," a "tapestry," or five short sentences in a row, open an issue — that's the bug this repo exists to prevent.

## Personalize this for your own use

If you forked or cloned this repo, do these seven steps in order before running anything. The whole point of the toolkit is that Claude critiques *your* writing against *your* voice — until you fill in the context files, every output is generic.

1. **Install the skills.** Fastest: `/plugin marketplace add kalyvask/winning-writing` then `/plugin install winning-writing` in Claude Code. For a personalized fork, copy instead: `cp -r skills/* ~/.claude/skills/` on macOS/Linux; copy `skills\*` into `%USERPROFILE%\.claude\skills\` on Windows — copied skills are yours to edit. (Skip this step if you're using Cowork — point Cowork at the repo folder and it picks them up.)

2. **Edit `context/about-me.md`.** Open the file and replace every bracketed placeholder with the real thing. Look for: `[Your name]`, `[role / title]`, `[the thing you're working on right now]`, `[N years]` of prior experience, `[the through-line that makes your career make sense]`, your **Primary focus** / **Secondary** / **Public output** bullets, the "How I think" paragraph, the five "What you (Claude) should know" bullets, and your contact line. Be specific — named companies, real numbers, actual side projects. Generic in, generic out.

3. **Edit `context/voice-and-style.md`.** Keep the structure (Posture, Sentence structure, Words I like, Banned words, AI tells, Format preferences, Length targets) — those are the rules. Replace the four **Sample paragraph** blocks with three or four paragraphs of your own writing you'd be happy to be cloned from. Leave the "What's working" notes — they teach Claude *why* a paragraph lands. Add or remove banned words to match your taste.

4. **Tell Claude to read your context on every task.** In Claude Code, add this to your project `CLAUDE.md`: *"Before every task, read everything in my `context/` files."* In Cowork, set the same line in Settings → Cowork → Edit Global Instructions. From now on every session starts with Claude knowing your voice.

5. **Drop drafts into a gitignored folder.** Create `drafts/` (or `outputs/`) at the repo root and put any work-in-progress there. Both folders are already in `.gitignore`, as are any files matching `*.draft.md` or `*.private.md`. Nothing in those paths will ever be committed.

6. **(Optional) Set your Anthropic API key for the Coach UI or the Chrome extension.** Skip this step entirely if you're using Claude Code or Cowork — those don't need a separate key. If you do want the UI or the extension: get a key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys). For the UI, paste it into the API field on first load (persists in localStorage on your machine only), or drop it into a gitignored `ui/.local-key.js` file. For the extension, paste it into the panel's Settings (persists in `chrome.storage.local`). The repo ships with no keys.

7. **(Optional) Install one of the Chrome extensions.** Open `chrome://extensions`, toggle Developer mode, click Load unpacked, point at `side-panel-coach/` for the side-panel UX or build `inline-coach/` first (`npm install && npm run build` inside it, then load `dist/`) for the auto-attaching inline UX. Pin the icon. Full instructions in [`side-panel-coach/README.md`](side-panel-coach/README.md) and [`inline-coach/README.md`](inline-coach/README.md).

Done. Open Claude Code and try *"draft me a cold email to [person] asking for [thing]"* — Claude will run the full pipeline.

## What's in here

```
context/             Two priming files (about-me.md, voice-and-style.md) — point Claude at these once
points/              Distilled rules and frameworks (the "what")
skills/              Claude skills you can invoke from Claude Code or Cowork (the "how")
bundles.json         Canonical intent bundles — which points/skills each critic intent loads.
                     Shared by the Coach UI, the side-panel extension, and the eval harness.
tools/               sync-rules.mjs regenerates the extension's bundled rule snapshot from
                     bundles.json + points/ + skills/; --check mode gates CI on drift.
                     jargon-coverage.mjs reports how much of the canonical banned-word
                     list (points/banned-jargon.md) each code-side copy actually covers.
ui/                  Optional browser entry point — Draft Critic + LLM Coach with inline critic
side-panel-coach/    Chrome MV3 extension — Coach in the Gmail side panel. Vanilla JS,
                     no build step. Cold-email critic, pre-send gate, opt-in
                     GitHub live-fetch.
inline-coach/        Chrome MV3 extension that auto-attaches to Gmail AND LinkedIn
                     compose surfaces (overlay bubble, full-page thread, InMail). Vite +
                     React + TS, calls Anthropic from the service worker.
eval/                Regression harness — node eval/run.mjs replays a golden corpus against the live critic

catalog/             STANDALONE variant, not in the critic path. A mode-aware single skill
                     with 42 rules tagged per mode (cold-email, memo, essay, profile,
                     readme, linkedin-post) in catalog/rules/catalog.json. Nothing in
                     bundles.json or either extension loads it — the Coach and the
                     extensions read points/ + skills/ instead. Exercised only by
                     skill-evals/. Keep, wire in, or fold into points/ — but know that
                     editing a rule here does not change what the critic does.
skill-evals/         Broader regression suite covering the catalog skill plus cold-email,
                     pm-evaluator, pm-prd-drafter. 105 fixtures, deterministic matchers.
```

## The points

Fourteen reference docs, each focused on one slice of the source material:

| File | Covers |
|------|--------|
| [core-rules.md](points/core-rules.md) | The 15 foundational rules (BLUF, audience, concision, warmth) |
| [banned-jargon.md](points/banned-jargon.md) | Words and phrases to kill on sight, with replacements |
| [frameworks.md](points/frameworks.md) | BLUF, S.H.I.T., 7-part pitch, op-ed structure, gratitude formula |
| [cold-email-rules.md](points/cold-email-rules.md) | Konrad's 10 rules + Heidi Roizen's mailing rules |
| [exec-memo-rules.md](points/exec-memo-rules.md) | Decision-memo rules: TL;DR up front, one ask per memo, named decision criterion, sourced numbers, early-failure signal, the 60-second test, plus format mechanics from Alper & Kluger's Memo on Memos (informative headers, verb-first recommendations, 5-sentence/17-word readability targets) |
| [performance-review-rules.md](points/performance-review-rules.md) | Performance-review rules from Kramon: letter to the person not about them, lead with what you like then what you would like, near-term + long-term goals (including their next job), colleague feedback as multiplier, no psychoanalyzing or ambushing, close with thank-you, the house-on-fire test |
| [speech-rules.md](points/speech-rules.md) | Speech and talk-delivery rules from Kramon Session 8 ("Wowing the Crowd"): write the closing line first, repeat the main thought, one story, the Sparkline (alternate "what is" with "what could be"), audience-size adjustments, three opening + closing archetypes, pre-talk checklist |
| [delivery-rules.md](points/delivery-rules.md) | Spoken-delivery mechanics from Kluger & Alper's Strategic Communication (GSBGEN 315/515): the three Vs (verbal/vocal/visual), the four derailers with fixes (tactical pause, end-low inflection), Q&A answer structures (lead with the answer), nerve management, the record-and-review loop |
| [kramon-master.md](points/kramon-master.md) | Full Kramon reference, all four sessions |
| [examples-and-critiques.md](points/examples-and-critiques.md) | Model letters, op-ed headlines, before/after rewrites |
| [ai-writing-rules.md](points/ai-writing-rules.md) | How to use AI without sounding like AI ("centaur" mode) |
| [pre-send-checklist.md](points/pre-send-checklist.md) | The single checklist to run before hitting send |
| [named-failure-modes.md](points/named-failure-modes.md) | 14 named cold-email failure modes (vague ask, credentials dump, generic personalization, AI-tell prose) — what to fix, not just where you scored low |
| [plain-technical-english.md](points/plain-technical-english.md) | **Opt-in, narrow scope.** Precision rules for instructions, runbooks, and risk sections — one term per thing, no phrasal verbs, condition before action, command before consequence, sentence caps by text type. Deliberately fights the persuasive-writing skills; the file leads with when *not* to use it. Inspired by the ASD-STE100 controlled-language approach |

## The skills

Drop the `skills/` directory into `~/.claude/skills/` (or your Cowork folder) and Claude auto-triggers the right skill for the task. **All flows below run from Claude Code or Cowork — the UI is one entry point, not a requirement.**

### Drafting and critique

| Skill | When it triggers |
|-------|------------------|
| `cold-email-coach` | Drafting or critiquing a cold email, LinkedIn DM, intro request |
| `op-ed-coach` | Drafting an op-ed, opinion piece, or LinkedIn long-form |
| `pitch-coach` | VC pitch, internal pitch, six-word product summary, mission statement |
| `pitch-memo` | Text-first investor memo for pre-seed and seed founders — Constine's 15 questions |
| `speech-coach` | Drafts and critiques speeches, keynotes, lightning talks, demo-day pitches, all-hands, panel openers, wedding toasts — anything delivered aloud. The 12 wowing-the-crowd rules from Kramon Session 8: closing line written first, main thought repeated, one story, no bullet slides, the end matters more than the beginning |
| `gratitude-note-coach` | Thank-you notes, recommendation letters, recognition messages |
| `dealing-with-reporters` | Crisis comms + press inquiries — Sorkin's 11 rules + AP attribution. Names the Sorkin (litigation-first) vs. Tylenol/Kramon (trust-first) school tension explicitly. |
| `yourself-story` | Bios, LinkedIn About, intro slides, "tell me about yourself" — Bryant + Weinstein + the six Kramon model bios |
| `performance-review-coach` | Drafting or critiquing an annual review, mid-year check-in, self-review, 360 feedback, or peer review. Catches the four classic failure modes: written-about-them, lead-with-the-negative, ambush, and psychoanalysis. Includes a "reframe the blunt manager line" kit for the in-meeting verbal version too. |
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
| `style-tells` | Scrubs the three surface tells that flag prose as AI-generated, padded, or jargon-heavy. Three targets behind one skill: `--target em-dashes\|adverbs\|jargon\|all`. Em-dashes (the #1 AI tell in 2026), empty intensifiers and -ly adverbs, the Silicon Valley / consultant kill-list plus AI-tell phrases. |
| `rhythm-killer` | Fixes the two sentence-rhythm tells that mark prose as AI-generated even after surface tells are scrubbed. Two targets behind one skill: `--target fragment-chain\|uniform-length\|all`. fragment-chain catches three or more short sentences back-to-back; uniform-length catches consecutive sentences within ~2 words of each other, especially with parallel structure ("You X. You Y. You Z."). |
| `vividness` | Pushes a draft from abstract toward concrete at two scales. `--mode noun-level\|scene-level\|both`. Noun-level replaces "dog" with "German shepherd," "many" with "47 of 100." Scene-level turns "I was angry" into body signal + room + dialogue + moment. The "could a director recreate this?" test. |
| `compression` | Cuts to a target word count and/or kills redundancy. `--mode target-count\|redundancy\|both`, `--target-words N`. Target-count hits a specific number (200 for cold email, 6 for product summary). Redundancy catches phrases the verb or context already implied ("going forward," "as I mentioned," "reduce so they are smaller," "free gift"). |
| `headline-as-claim` | Rewriting slide titles, section headings, and subject lines from category labels into bold arguable claims |
| `humanize` | Roughening up a too-clean draft — contractions, dropped subjects, the occasional safe typo. Skips automatically on high-stakes pieces. |
| `bluf-rewriter` | Re-organizing so the bottom line is up front |
| `warmth-and-competence` | Auditing on Fiske's two-axis model and finding the one sentence that proves both axes |
| `pick-a-lane` | Diagnosing drafts that tell three half-stories instead of one full one. Cuts whole stories, not just words. |
| `irrelevant-detail-killer` | Cuts cinematic details that are vivid but don't serve the main point. The third-pass refinement after pick-a-lane and vividness. |
| `feedback-rephraser` | Rewrites blunt downward or peer feedback (perf reviews, 1:1 talking points, Slack DMs) as "what I like + what I would like" focused on the work, ideally phrased as a question. Catches trait-attacks, stop-without-replacement, psychoanalysis, and declared-not-asked patterns. |

### Maintaining your voice over time

The skill below grows your `context/` files incrementally, so the toolkit gets smarter about you with each session instead of staying frozen at whatever you wrote on day one. Always proposes a diff first — never auto-writes.

| Skill | When it triggers |
|-------|------------------|
| `voice-update` | Updates `context/voice-and-style.md` or `context/about-me.md` from one of three sources, picked via `--source manual\|memory\|sent-mail`. **manual:** one dictated rule, sample, or career fact ("save this," "remember this style"). **memory:** batch pull from Claude Code's auto-memory in `~/.claude/projects/<slug>/memory/`, with citation per addition. **sent-mail:** reads the last 20–50 sent Gmail messages via the connected Gmail MCP, returns confirmations / drift candidates / new patterns. Routes style notes to `voice-and-style.md` and identity/career notes to `about-me.md`. Per-file approval, not batched. |

Auto-learning from every draft is intentionally not supported — it would reinforce AI-tells the model rationalized away. Manual merge with diff approval is the right shape. The sent-mail source is the exception: sent mail is ground truth, not a draft the model talked you into.

### Closing the outcome loop

The rest of the toolkit asks "is this email well-written?" The skill below asks the only question that actually matters: "did the email get a reply, and what did the messages that replied have in common?"

| Skill | When it triggers |
|-------|------------------|
| `sent-mail-outcome-tracker` | Reads cold-outreach sent mail and the matching inbound threads, classifies each by outcome (meeting / intro / substantive / decline / deferral / no reply), surfaces the patterns that correlate with replies (subject length, named connection, ask specificity, day-of-week), names the `named-failure-modes.md` patterns over-represented in the no-reply set, and proposes one concrete experiment to run on the next ten messages. Read-only over Gmail. Anonymizes recipients by role. Use when the user says "did my cold emails get replies," "what's my reply rate," "track outcomes," or "/sent-mail-outcome-tracker." |

Composes with `voice-update --source sent-mail` (which audits voice files against sent mail). This skill produces outcome data; voice-update proposes voice updates if the patterns are strong enough. The eval harness measures critic recall against a golden corpus; this skill measures whether the resulting emails actually reach their intended outcome. Both belong, and they answer different questions.

Each skill has a `SKILL.md` with frontmatter, a checklist, and pointers back to the relevant `points/` file.

## The context files

The single highest-leverage thing you can do with Claude — takes 20 minutes once.

```
context/
├── about-me.md          who you are, what you're working on (brief Claude like a new colleague)
└── voice-and-style.md   how you write — tone, banned phrases, sample paragraphs
```

In Claude Code, add to your project `CLAUDE.md`: *"Before every task, read everything in my `context/` files."* In Cowork, set the same string in Settings → Cowork → Edit Global Instructions. From then on every session starts with Claude knowing your voice.

## The UI (optional)

Two browser pages. Useful if you don't live in Claude Code. Every skill the UI invokes is also installable directly into Claude Code or Cowork. The Coach page (`ui/coach.html`) runs an agentic pipeline with per-step model choice and a streaming trace; see *Four ways to use this* above for the mode breakdown.

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

### Page 2 — `ui/coach.html` — LLM-powered Coach

Runs Claude end-to-end from the browser. Same capability is available natively in Claude Code.

**You fill in:**
1. Recipient — name, role, links, anything you've read about them
2. About you — auto-loaded from `context/about-me.md` or pasted inline
3. The ask — what you want, why now, what you can offer
4. (Optional) Existing draft — Coach critiques line-by-line, then rewrites
5. **Mode** — single-shot + polish (default), full agentic, or single-shot (see the mode table under *Four ways to use this* above)

The pipeline implementation lives in [`ui/agents.js`](ui/agents.js); per-step prompts are co-located with the runners. Claude calls happen browser-direct to `api.anthropic.com`. **Your API key sits in localStorage on your machine and is never sent anywhere else.**

#### Inline critic + refinement chat

The **Critique inline** button makes one Sonnet call (rule library cached as the system block) and returns span-level annotations — each with a `quote`, `severity`, `category`, one-sentence `why`, `suggested` rewrite, and a `rule_source` pointing at the exact `points/` or `skills/` file. A **Critic intent** dropdown picks the rule bundle (`cold-email`, `exec-memo`, `performance-review`, `op-ed`, `pitch`, `general`); each loads a different mix of `points/` docs and surgical skills, and the choice persists across reloads.

The annotated viewer paints severity-coded highlights. Hover a span for the rule card, click to pin it. Each card carries **Accept / Reject / Snooze** — Accept edits a working draft (the original stays untouched until **Apply to draft input**). Unmatched quotes (model quote not found verbatim) are surfaced rather than dropped.

A **refinement chat** below the viewer takes plain-English follow-ups (*"cut 30 words," "move the ask earlier"*): rewrites update the working draft, questions return a short evaluation. **Re-critique** re-runs the critic on the refined draft. If **About me** is filled in, it's passed as an additional cached voice block so the critic doesn't flag your settled style and rewrites stay in your voice.

The rule library loads at runtime from `points/*.md` and the surgical skills' SKILL.md files. **Edit a rule file, refresh, the critic reflects the change** — no prompt rewrite, no code change.

#### Diff view

After Accepting flags (or a refinement rewrite), **Show diff** opens a side-by-side view: deletions struck through in red on the left, additions highlighted green on the right. Hover any change for the rule that fired; an **Edits applied** sidebar lists each accepted edit with its rule source. Computed with a word-level LCS; **Copy diff (markdown)** produces a shareable before/after block.

#### Setup

1. Get an Anthropic API key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Serve the repo root over HTTP so the Coach can fetch the rule library: `python -m http.server 8770` **from the repo root** (not from `ui/`). Open `http://localhost:8770/ui/coach.html`.
3. Paste your key into the API field. It persists across sessions.
4. Pick a model — Sonnet 4.6 is the default (fast + good); Opus 4.8 for the highest quality; Haiku 4.5 for cheap.

#### For local dev

Drop a gitignored file at `ui/.local-key.js`:

```js
export const LOCAL_API_KEY = 'sk-ant-...';
```

Coach auto-loads it when the API key field is empty. The file is in `.gitignore` so it never enters the repo. The repo ships with **no API keys**.

Designed to deploy as-is to GitHub Pages (the offline page).

## The Chrome extensions

> **Composing in Gmail or LinkedIn? → [`inline-coach`](inline-coach/) auto-attaches inline**
> **Critiquing a cold email from the Gmail side panel? → [`side-panel-coach`](side-panel-coach/)**

Two MV3 extensions, same rule library, different surfaces. Install one or both — they don't share storage or state.

### `inline-coach` — auto-attaches to Gmail and LinkedIn compose

Lives inline next to every compose box. Auto-attaches to Gmail compose dialogs and the three LinkedIn DM surfaces (overlay bubble, full-page thread reply, InMail modal). Re-anchors as LinkedIn pushState-navigates between feed, messaging, and profile views. Recipient parsing, connection-angle suggestions, S.H.I.T. pre-send checklist. Cold-email intent only at the moment. TypeScript + Vite + React + Tailwind.

**Build and install**

```
cd inline-coach
npm install
npm run build
```

Then load `inline-coach/dist/` as an unpacked extension. Full walkthrough in [`inline-coach/README.md`](inline-coach/README.md).

### `side-panel-coach` — cold-email critic in the side panel

Opens in Chrome's side panel when you click the toolbar icon. Same prompt-cached rule library, same Accept / Reject / Refine flow as the Coach UI, with one-click import of the active Gmail compose body. The reason to reach for this one: opt-in pre-send gate that intercepts Send + Cmd/Enter, opt-in GitHub live-fetch rule mode. The panel runs the cold-email intent; the underlying rule loader supports all six intents (an intent picker in the panel is a planned follow-up — use the Coach UI's dropdown meanwhile). Gmail only.

**What's in the bundle**

```
side-panel-coach/
├── manifest.json          MV3 manifest, sidePanel + storage + scripting
├── background.js          Service worker — routes get-compose-text
├── content-script.js      Reads the Gmail compose body (stable role/aria selectors)
├── sidepanel.html / .css / .js   The panel itself
├── lib/agents.js          runInlineCritic + runRefinementTurn (mirror of ui/agents.js)
├── lib/skill-loader.js    Dual-mode loader (chrome.runtime.getURL inside the extension,
│                          relative paths in a browser tab for preview testing)
└── rules/                 Generated snapshot of bundles.json + the points/ docs and
                           skills/ SKILL.md files it references. Regenerate with
                           node tools/sync-rules.mjs; CI fails on drift.
```

**Install (unpacked, personal use)**

1. Open `chrome://extensions`, toggle **Developer mode**, click **Load unpacked**, point at `side-panel-coach/`
2. Pin the extension icon
3. Click it → side panel opens; in **Settings**, paste your `sk-ant-...` key (stored in `chrome.storage.local`)
4. Open Gmail, start a Compose, click **Import from Gmail compose** in the panel, then **Critique**

Full install + usage walkthrough in [`side-panel-coach/README.md`](side-panel-coach/README.md).

### Settings shipped

- **Rule source** — `Bundled snapshot` or `Live from GitHub`. Live mode pulls from `raw.githubusercontent.com/<owner>/<repo>/<branch>/points/...` and `skills/.../SKILL.md` with a 1-hour cache (chrome.storage.local) and a manual Refresh button. Falls back to the bundled snapshot on any network failure. The summary line under each critique badges which mode fired.
- **Pre-send gate** — opt-in toggle. When on, intercepts both the Send button click and Cmd/Ctrl+Enter on `mail.google.com`; runs the `cross-model-review` skill against the rule library; shows a blocking modal with named failures + likely counter-question + Fix / Send-anyway. The modal is a positioned-fixed overlay; it does not modify Gmail's compose DOM.
- **Voice profile** — a textarea for a few sentences in your own voice plus phrases you'd never use. The critic uses it to avoid flagging your settled style; the refiner uses it to keep rewrites sounding like you. Stored in `chrome.storage.sync` so it follows your Chrome profile across devices (8 KB hard limit per item; the panel surfaces a live char counter and refuses to save above 7 KB).

### Storage layout

Non-secret preferences (model, send-interception toggle, voice profile) live in `chrome.storage.sync` so they follow your Chrome profile across devices. The Anthropic API key stays in `chrome.storage.local` — secrets are never synced. A one-time migration on first boot after upgrading copies any existing local preferences into sync.

### What it does NOT do (yet)

- **Inline highlights directly inside Gmail's compose body.** The side panel is the highlight surface; the compose body itself is untouched. In-compose highlights require iteration against Gmail's live contenteditable (autosave fights modifications, span offsets drift on scroll/resize), which is the next dedicated build.
- **Reply-thread context** — the import grabs the body, not the quoted thread.

Each of those is a follow-up sized similar to the v1 itself.

## The eval harness

`eval/` ships a regression harness for the inline critic. A small golden corpus of drafts with declared expected flags, replayed against the live Anthropic API with the full rule library loaded. Each case asserts recall and (optionally) a clean-draft tolerance, so when you edit a rule in `points/` or `skills/` you can tell whether anything regressed.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
node eval/run.mjs
```

A full 6-case run is ~$0.05-0.10 with prompt caching on the rule library. Exit code 0 = all pass, 1 = at least one case failed its threshold. Add cases as JSON in `eval/corpus/`. Full schema and authoring guidance in [`eval/README.md`](eval/README.md).

Wired to GitHub Actions at [`.github/workflows/eval.yml`](.github/workflows/eval.yml). The workflow runs on every push and pull request that touches `skills/`, `points/`, `eval/`, `ui/agents.js`, or `side-panel-coach/lib/`. README-only edits skip the run so the API budget stays bounded. The badge at the top of this file reflects the most recent main-branch status. Set `ANTHROPIC_API_KEY` as a repo secret to enable the gate.

The harness loads the rule library **per case-intent**, caching by intent across the run — so a corpus that mixes `cold-email` and `exec-memo` cases works in one pass without re-fetching the cold-email bundle for every case. Set the env var `INTENT` to override the default fallback for cases that don't declare their own `intent`.

The harness reads the same canonical `bundles.json` as the browser loaders, so intent composition can't drift between eval and production. The critic prompt and loader logic are still mirrored (not shared) because of the ES-modules-in-Node configuration — keep those in sync when either changes. `node tools/sync-rules.mjs --check` runs in CI before the eval and fails the build if the extension's bundled rule snapshot drifts from the canonical sources.

## Sources

- Glenn Kramon's *Winning Writing* (GSBGEN 352.1), Stanford GSB
- Allison Kluger and Burt Alper's *Strategic Communication* (GSBGEN 315/515), Stanford GSB — delivery mechanics, derailers, Q&A structures, and the Memo on Memos
- Nancy Duarte's *Resonate* (the Sparkline, structure-before-slides) and *Slidedocs*
- Mary Munter and Lynn Russell's *Guide to Presentations* (the AIM framework)
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
