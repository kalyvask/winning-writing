# Winning Writing

> An LLM-powered writing coach. Tell it who you're emailing and who you are; Claude runs the full *Winning Writing* pipeline — research, connection, draft, rubric — using the rules from Stanford GSB's GSBGEN 352 (Glenn Kramon) and Rachel Konrad's cold-outreach lectures.

## How it works in one sentence

You feed in a recipient + an "about you" + an ask. **Claude reads all the skills and principles in this repo as its system prompt**, runs through them in order, and returns a complete cold-outreach package: dossier synthesis → connection angles → subject lines → drafted email → 12-dimension rubric score → flags to verify before sending.

The rules are not in the model's training — they're loaded from `skills/` and `points/` at runtime. That's the whole point: Glenn Kramon's class is opinionated, the banned-word list is enforced, and the LLM follows *those* rules, not its own median instincts.

## About

Four pieces:

- **`points/`** — distilled rules and frameworks. The "what."
- **`skills/`** — 19 focused Claude skills (`SKILL.md` files). The "how."
- **`context/`** — `about-me.md` + `voice-and-style.md` so Claude writes in your voice, not generic AI voice
- **`ui/`** — two browser pages: an **offline draft critic** for fast feedback, and a **Claude-powered Coach** that runs the full pipeline against the live API

Built because most cold emails, op-eds, and memos read the same — hedged, jargon-heavy, AI-flavored. The principles here are opinionated and the banned-word list is enforced. I drafted with Claude as a sparring partner, then rewrote every line by hand so it doesn't sound like one. If you spot a "delve," a "tapestry," or five short sentences in a row, open an issue — that's the bug this repo exists to prevent.

## What's in here

```
context/   Two priming files (about-me.md, voice-and-style.md) — point Claude at these once
points/    Distilled rules and frameworks (the "what")
skills/    Claude skills you can invoke from Claude Code or Cowork (the "how")
ui/        Browser-based draft critique tool — no install required
```

## The points

Eight reference docs, each focused on one slice of the course:

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

## Configure for your own use

Both files in `context/` ship as templates with placeholders like `[Your name]`. To make this toolkit yours:

1. Edit `context/about-me.md` — replace every placeholder with the real thing. The more specific (named companies, real numbers, actual side projects), the higher the leverage.
2. Edit `context/voice-and-style.md` — keep the structure, but swap each "Sample paragraph" block for a paragraph you've written that you'd be happy to be cloned from. The "What's working" notes teach Claude *why* a paragraph lands.
3. Drop your own drafts anywhere — the UI's Draft Critic takes pasted text and never reads from disk. The Coach reads only `context/about-me.md` (or what you paste into the form).
4. Want an `outputs/` or `drafts/` folder of your own work? Add it to `.gitignore` first if your fork is public.

The `points/` and `skills/` files are course material and rules — leave them alone unless you want to fork the rules themselves.

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
