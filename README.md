# Winning Writing

> 28 Claude skills for cold outreach, op-eds, pitches, press inquiries, and bios. Distilled from Stanford GSB's *Winning Writing* (Glenn Kramon, GSBGEN 352), Rachel Konrad's cold-outreach lectures, and Andrew Ross Sorkin's reporter playbook. Run them from Claude Code, from Cowork, or from a three-mode browser Coach that streams every step.

## The shortest path

```bash
git clone https://github.com/kalyvask/winning-writing
cp -r winning-writing/skills/* ~/.claude/skills/
```

Open Claude Code (or Cowork), drop a draft into the chat, and say *"critique this cold email"* — Claude auto-triggers `cold-email-coach`, runs the rubric, calls in `recipient-research`, `connection-finder`, `tell-them-something-new`, `em-dash-killer`, `humanize`, and whichever else applies. The skills compose. No UI to open, nothing to paste between windows.

## Three ways to use this

The same skills power all three. Pick whichever fits where you already work.

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

**Claude Code is still the most powerful path** — it auto-routes between all 25 skills based on what you're doing, has tool access for file edits, and skips the browser entirely. The Coach UI exists for people who want a form, plus now an agentic pipeline they can inspect step by step.

## How it works in one sentence

Claude reads the skills and principles in this repo as its operating system, runs through them in order on whatever draft or pitch you bring, and returns a complete cold-outreach package: dossier synthesis → connection angles → subject lines → drafted email → 12-dimension rubric score → flags to verify before sending.

The rules are not in the model's training — they're loaded from `skills/` and `points/` at runtime. That's the whole point: Glenn Kramon's class is opinionated, the banned-word list is enforced, and the LLM follows *those* rules, not its own median instincts.

## About

Four pieces:

- **`points/`** — distilled rules and frameworks. The "what."
- **`skills/`** — 28 focused Claude skills (`SKILL.md` files). The "how."
- **`context/`** — `about-me.md` + `voice-and-style.md` so Claude writes in your voice, not generic AI voice. Update them incrementally via `voice-commit` (manual merge) or `voice-consolidator` (batch pull from Claude Code's auto-memory) instead of editing by hand.
- **`ui/`** — optional browser pages: an offline draft critic, and a Claude-powered Coach. Not needed if you're already in Claude Code.

Built because most cold emails, op-eds, and memos read the same — hedged, jargon-heavy, AI-flavored. The principles here are opinionated and the banned-word list is enforced. I drafted with Claude as a sparring partner, then rewrote every line by hand so it doesn't sound like one. If you spot a "delve," a "tapestry," or five short sentences in a row, open an issue — that's the bug this repo exists to prevent.

## Personalize this for your own use

If you forked or cloned this repo, do these six steps in order before running anything. The whole point of the toolkit is that Claude critiques *your* writing against *your* voice — until you fill in the context files, every output is generic.

1. **Install the skills.** `cp -r skills/* ~/.claude/skills/` on macOS/Linux; copy `skills\*` into `%USERPROFILE%\.claude\skills\` on Windows. Each skill is a self-contained `SKILL.md` — Claude Code loads them on next session start. (Skip this step if you're using Cowork — point Cowork at the repo folder and it picks them up.)

2. **Edit `context/about-me.md`.** Open the file and replace every bracketed placeholder with the real thing. Look for: `[Your name]`, `[role / title]`, `[the thing you're working on right now]`, `[N years]` of prior experience, `[the through-line that makes your career make sense]`, your **Primary focus** / **Secondary** / **Public output** bullets, the "How I think" paragraph, the five "What you (Claude) should know" bullets, and your contact line. Be specific — named companies, real numbers, actual side projects. Generic in, generic out.

3. **Edit `context/voice-and-style.md`.** Keep the structure (Posture, Sentence structure, Words I like, Banned words, AI tells, Format preferences, Length targets) — those are the rules. Replace the four **Sample paragraph** blocks with three or four paragraphs of your own writing you'd be happy to be cloned from. Leave the "What's working" notes — they teach Claude *why* a paragraph lands. Add or remove banned words to match your taste.

4. **Tell Claude to read your context on every task.** In Claude Code, add this to your project `CLAUDE.md`: *"Before every task, read everything in my `context/` files."* In Cowork, set the same line in Settings → Cowork → Edit Global Instructions. From now on every session starts with Claude knowing your voice.

5. **Drop drafts into a gitignored folder.** Create `drafts/` (or `outputs/`) at the repo root and put any work-in-progress there. Both folders are already in `.gitignore`, as are any files matching `*.draft.md` or `*.private.md`. Nothing in those paths will ever be committed.

6. **(Optional) Set your Anthropic API key for the Coach UI.** Skip this step entirely if you're using Claude Code or Cowork — the UI exists for people who want a form, not a terminal. If you do want the UI: the `ui/coach.html` page calls `api.anthropic.com` directly. Get a key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys), paste it into the API field on first load (persists in localStorage on your machine only), or drop it into a gitignored `ui/.local-key.js` file. The repo ships with no keys.

Done. Open Claude Code and try *"draft me a cold email to [person] asking for [thing]"* — Claude will run the full pipeline.

## What's in here

```
context/   Two priming files (about-me.md, voice-and-style.md) — point Claude at these once
points/    Distilled rules and frameworks (the "what")
skills/    Claude skills you can invoke from Claude Code or Cowork (the "how")
ui/        Optional browser entry point — not required for any flow
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
| `pick-a-lane` | Diagnosing drafts that tell three half-stories instead of one full one. Cuts whole stories, not just words. The Scrimshaw card-counter before/after is the canonical example. |

### Maintaining your voice over time

The two skills below grow your `context/` files incrementally, so the toolkit gets smarter about you with each session instead of staying frozen at whatever you wrote on day one. Both always propose a diff first — they never auto-write.

| Skill | When it triggers |
|-------|------------------|
| `voice-commit` | Manual one-off merge — when you say "save this to my voice file," "remember this style," "this isn't how I write." Routes style notes to `voice-and-style.md` and identity/career notes to `about-me.md` |
| `voice-consolidator` | Batch pull from Claude Code's auto-memory — when you say "consolidate my voice" or "what has Claude learned about my style?" Reads `~/.claude/projects/<project>/memory/` and proposes merges with citation |

The pattern is borrowed from chief-of-staff's `/commit` slash command (structured user-triggered logging) and llm-wiki's `UPDATE_PROMPT` (preserve old, merge new, flag contradictions). Auto-learning from every draft is intentionally not supported — it would reinforce AI-tells the model rationalized away. Manual merge with diff approval is the right shape.

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

#### Setup

1. Get an Anthropic API key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Open `ui/coach.html` in a browser (served via any HTTP server — `python -m http.server 8770` from `ui/` works)
3. Paste your key into the API field. It persists across sessions.
4. Pick a model — Sonnet 4.6 is the default (fast + good); Opus 4.7 for the highest quality; Haiku 4.5 for cheap.

#### For local dev

Drop a gitignored file at `ui/.local-key.js`:

```js
export const LOCAL_API_KEY = 'sk-ant-...';
```

Coach auto-loads it when the API key field is empty. The file is in `.gitignore` so it never enters the repo. The repo ships with **no API keys**.

Designed to deploy as-is to GitHub Pages (the offline page).

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
- Gabrielle Scrimshaw and the other Kramon class model bios (Legendy, McPhillips, Houston, Hanno, Gupta)

## License

MIT.
