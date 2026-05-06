# Winning Writing

> An LLM-powered writing coach. Tell it who you're emailing and who you are; Claude runs the full *Winning Writing* pipeline — research, connection, draft, rubric — using the rules from Stanford GSB's GSBGEN 352 (Glenn Kramon) and Rachel Konrad's cold-outreach lectures.

## How it works in one sentence

You feed in a recipient + an "about you" + an ask. **Claude reads all the skills and principles in this repo as its system prompt**, runs through them in order, and returns a complete cold-outreach package: dossier synthesis → connection angles → subject lines → drafted email → 12-dimension rubric score → flags to verify before sending.

The rules are not in the model's training — they're loaded from `skills/` and `points/` at runtime. That's the whole point: Glenn Kramon's class is opinionated, the banned-word list is enforced, and the LLM follows *those* rules, not its own median instincts.

## About

Four pieces:

- **`points/`** — distilled rules and frameworks. The "what."
- **`skills/`** — 20 focused Claude skills (`SKILL.md` files). The "how."
- **`context/`** — `about-me.md` + `voice-and-style.md` so Claude writes in your voice, not generic AI voice
- **`ui/`** — two browser pages: an **offline draft critic** for fast feedback, and a **Claude-powered Coach** that runs the full pipeline against the live API

Built because most cold emails, op-eds, and memos read the same — hedged, jargon-heavy, AI-flavored. The principles here are opinionated and the banned-word list is enforced. I drafted with Claude as a sparring partner, then rewrote every line by hand so it doesn't sound like one. If you spot a "delve," a "tapestry," or five short sentences in a row, open an issue — that's the bug this repo exists to prevent.

## Personalize this for your own use

If you forked or cloned this repo, do these seven steps in order before running anything. The whole point of the toolkit is that Claude critiques *your* writing against *your* voice — until you fill in the context files, every output is generic.

1. **Edit `context/about-me.md`.** Open the file and replace every bracketed placeholder with the real thing. Look for: `[Your name]`, `[role / title]`, `[the thing you're working on right now]`, `[N years]` of prior experience, `[the through-line that makes your career make sense]`, your **Primary focus** / **Secondary** / **Public output** bullets, the "How I think" paragraph, the five "What you (Claude) should know" bullets (speed, AI workflow, editorial preference, what you read, how you want pushback), and your contact line at the bottom. Be specific — named companies, real numbers, actual side projects. Generic in, generic out.

2. **Edit `context/voice-and-style.md`.** Keep the structure (Posture, Sentence structure, Words I like, Banned words, AI tells, Format preferences, Length targets) — those are the rules. Replace the four **Sample paragraph** blocks (`Sample 1` analytical-with-a-number, `Sample 2` narrative-with-a-scene, `Sample 3` pitching-yourself, `Sample 4` closing-line-of-a-memo) with three or four paragraphs of your own writing you'd be happy to be cloned from. Leave the "What's working" notes — they teach Claude *why* a paragraph lands. Add or remove banned words to match your taste.

3. **Drop drafts into a gitignored folder.** Create `drafts/` (or `outputs/`) at the repo root and put any work-in-progress there. Both folders are already in `.gitignore`, as are any files matching `*.draft.md` or `*.private.md`. Nothing in those paths will ever be committed.

4. **Install the Claude skills.** Copy the `skills/` directory into `~/.claude/skills/` (or your Cowork plugins folder) so Claude auto-triggers the right skill when you draft. On macOS/Linux: `cp -r skills/* ~/.claude/skills/`. On Windows: copy `skills\*` into `%USERPROFILE%\.claude\skills\`. Each skill is a self-contained `SKILL.md` with frontmatter — Claude Code loads them on next session start.

5. **Tell Claude to read your context on every task.** In Cowork, set Settings → Cowork → Edit Global Instructions to: *"Before every task, read everything in my `context/` files."* In Claude Code, add the same line to your project `CLAUDE.md`. From now on every session starts with Claude knowing your voice.

6. **Set your Anthropic API key for the Coach UI.** The `ui/coach.html` page calls `api.anthropic.com` directly. Get a key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) and paste it into the API field on first load (it persists in browser localStorage on your machine only). For local dev, drop the key into a gitignored file at `ui/.local-key.js` as `export const LOCAL_API_KEY = 'sk-ant-...';` — Coach auto-loads it. The repo ships with no keys. The offline `ui/index.html` Draft Critic needs no key.

7. **Confirm what stays local.** Once you've edited them, `context/about-me.md` and `context/voice-and-style.md` contain personal information — if your fork is public, decide whether to commit your filled-in versions or add them to `.gitignore` first. Already gitignored: `drafts/`, `outputs/`, `*.draft.md`, `*.private.md`, `ui/.local-key.js`, all `.env*` files. The `points/` and `skills/` files are course material — leave them alone unless you want to fork the rules themselves.

Done. Now open `ui/index.html` for offline critique or `ui/coach.html` for the live Claude pipeline.

## What's in here

```
context/   Two priming files (about-me.md, voice-and-style.md) — point Claude at these once
points/    Distilled rules and frameworks (the "what")
skills/    Claude skills you can invoke from Claude Code or Cowork (the "how")
ui/        Browser-based draft critique tool — no install required
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

Drop the `skills/` directory into `~/.claude/skills/` (or your Cowork folder) and Claude will auto-trigger the right skill for the task.

### Drafting and critique

| Skill | When it triggers |
|-------|------------------|
| `cold-email-coach` | Drafting or critiquing a cold email, LinkedIn DM, intro request |
| `op-ed-coach` | Drafting an op-ed, opinion piece, or LinkedIn long-form |
| `pitch-coach` | VC pitch, internal pitch, six-word product summary, mission statement |
| `pitch-memo` | Text-first investor memo for pre-seed and seed founders — Constine's 15 questions |
| `gratitude-note-coach` | Thank-you notes, recommendation letters, recognition messages |
| `winning-writing-critic` | Grading any draft against the full rubric and returning a rewrite |
| `cross-model-review` | Independent second-model gate before send — must run on a different model than the drafter. Names the specific failure mode from a 14-mode catalog (strategy / personalization / posture) and predicts the recipient's most likely counter-question |

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
| `headline-as-claim` | Rewriting slide titles, section headings, and subject lines from category labels into bold arguable claims |
| `humanize` | Roughening up a too-clean draft — contractions, dropped subjects, exactly one harmless micro-typo |
| `bluf-rewriter` | Re-organizing so the bottom line is up front |
| `warmth-and-competence` | Auditing on Fiske's two-axis model and finding the one sentence that proves both axes |

Each skill has a `SKILL.md` with frontmatter, a checklist, and pointers back to the relevant `points/` file.

## The context files

The single highest-leverage thing you can do with Claude — takes 20 minutes once.

```
context/
├── about-me.md          who you are, what you're working on (brief Claude like a new colleague)
└── voice-and-style.md   how you write — tone, banned phrases, sample paragraphs
```

In Cowork, set Settings → Cowork → Edit Global Instructions to: *"Before every task, read everything in my context files."* From then on every session starts with Claude knowing your voice.

## The UI — two pages

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

This is the one that runs Claude end-to-end.

**You fill in:**
1. Recipient — name, role, links, anything you've read about them
2. About you — auto-loaded from `context/about-me.md` or pasted inline
3. The ask — what you want, why now, what you can offer
4. (Optional) Existing draft — Coach critiques line-by-line, then rewrites

**Claude does:**
1. **Synthesizes a dossier** from what you provided (`recipient-research` skill)
2. **Finds connection angles** — cross-references the recipient against your about-me across 8 categories, ranked by leverage (`connection-finder` skill)
3. **Suggests three subject-line candidates** — personal, timely, unusual (`fun-angle` + `cold-email-coach`)
4. **Drafts the email** — under 200 words, all 10 Konrad rules applied
5. **Scores it** — 12-dimension rubric, total /120
6. **Flags risks** — unverified claims, jargon hits, things to do before sending

The system prompt embeds the relevant skills directly — see [`ui/coach-prompt.js`](ui/coach-prompt.js). Claude calls happen browser-direct to `api.anthropic.com`. **Your API key sits in localStorage on your machine and is never sent anywhere else.**

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
- Adam Bryant on writing about yourself ("desirable confidence")
- Nicholas Kristof's columns and op-ed advice
- Katie Kingsbury (NYT Opinion) on what gets published
- Danny Hertzberg (Base10, ex-Sequoia) on cold outreach
- Josh Constine's *Fundraising & Pitch Deck Guide* (15-question memo, forwardable blurb, slide-titles-as-claims)
- Susan Fiske (Princeton) on warmth + competence
- Stephen King's *On Writing* on adverbs

## License

MIT.
