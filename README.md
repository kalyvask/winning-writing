# Winning Writing

A toolkit for writing things people actually read — based on Stanford GSB's *Winning Writing* (Glenn Kramon, GSBGEN 352) and Rachel Konrad's cold-outreach guest lectures.

## What's in here

```
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

| Skill | When it triggers |
|-------|------------------|
| `cold-email-coach` | Drafting or critiquing a cold email, LinkedIn DM, intro request |
| `op-ed-coach` | Drafting an op-ed, opinion piece, or LinkedIn long-form |
| `pitch-coach` | VC pitch, internal pitch, six-word product summary, mission statement |
| `gratitude-note-coach` | Thank-you notes, recommendation letters, recognition messages |
| `concision-drill` | Cutting a draft to a target word count without losing substance |
| `jargon-killer` | Scrubbing a piece of writing for banned words and replacing them |
| `bluf-rewriter` | Re-organizing a memo, email, or update so the bottom line is up front |
| `winning-writing-critic` | Grading any draft against the full rubric and returning a rewrite |

Each skill has a `SKILL.md` with frontmatter, a checklist, and pointers back to the relevant `points/` file.

## The UI

Open [`ui/index.html`](ui/index.html) in any browser. No build, no server, no install.

Features:
- Paste a draft, pick a mode (cold-email / op-ed / pitch / gratitude / general)
- Live word count and reading time
- Banned-jargon highlighter with one-click replacements
- Mode-specific pre-send checklist
- "Copy Claude prompt" — builds a critique prompt with the right rules and copies it to your clipboard, ready to paste into Claude
- Six-word summary scratchpad

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
