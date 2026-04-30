# Winning Writing

A toolkit for writing things people actually read — based on Stanford GSB's *Winning Writing* (Glenn Kramon, GSBGEN 352) and Rachel Konrad's cold-outreach guest lectures.

## About

A draft-critique toolkit built from Glenn Kramon's *Winning Writing* at Stanford GSB and Rachel Konrad's cold-outreach guest lectures. Four pieces: distilled rules in `points/`, eleven focused Claude skills in `skills/`, two context-priming files in `context/`, and a single-page browser tool in `ui/` that scores any draft against the rubric and builds a critique prompt for Claude.

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
| `gratitude-note-coach` | Thank-you notes, recommendation letters, recognition messages |
| `winning-writing-critic` | Grading any draft against the full rubric and returning a rewrite |

### Cold-outreach pipeline (run in order)

| Skill | When it triggers |
|-------|------------------|
| `recipient-research` | Builds a dossier on the person you're emailing — LinkedIn, podcasts, recent news, distinctive personal details |
| `connection-finder` | Cross-references the dossier and your `about-me.md` for specific, genuine "like you" hooks |
| `fun-angle` | Finds the dry, self-deprecating, or unexpected line that makes the email memorable — subject lines, openers, sign-offs |

### Surgical edits

| Skill | When it triggers |
|-------|------------------|
| `concision-drill` | Cutting a draft to a target word count without losing substance |
| `jargon-killer` | Scrubbing banned words and AI tells |
| `bluf-rewriter` | Re-organizing so the bottom line is up front |

Each skill has a `SKILL.md` with frontmatter, a checklist, and pointers back to the relevant `points/` file.

## The context files

The single highest-leverage thing you can do with Claude — takes 20 minutes once.

```
context/
├── about-me.md          who you are, what you're working on (brief Claude like a new colleague)
└── voice-and-style.md   how you write — tone, banned phrases, sample paragraphs
```

In Cowork, set Settings → Cowork → Edit Global Instructions to: *"Before every task, read everything in my context files."* From then on every session starts with Claude knowing your voice.

## The UI

Open [`ui/index.html`](ui/index.html) in any browser. No build, no server, no install.

Features:
- **Audience input first** — name the reader before you write (Kramon's rule 2). Feeds into every heuristic and the Claude prompt.
- Paste a draft, pick a mode (cold-email / op-ed / pitch / gratitude / general)
- Live word count and reading time
- Banned-jargon and AI-tell highlighter with categorized hits
- Mode-specific pre-send checklist
- Heuristics: **BLUF, Story, Rhythm (anti-choppy), Audience** — scored 0–10 with a one-line note each
- "Copy critique prompt" — builds a Claude-ready prompt with the audience, draft, mode, and rules, copied to clipboard
- Six-word summary scratchpad
- Key-principles panel — all 75 principles, grouped by category, editable in `ui/data.js`

Designed to deploy as-is to GitHub Pages.

## Sources

- Glenn Kramon's *Winning Writing* (GSBGEN 352.1), Stanford GSB
- Rachel Konrad's guest lectures on cold outreach
- Heidi Roizen's mailing rules
- Adam Bryant on writing about yourself
- Nicholas Kristof's columns and op-ed advice
- Katie Kingsbury (NYT Opinion) on what gets published

## License

MIT.
