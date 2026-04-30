# Skills

Eight Claude skills for *Winning Writing*. Each is a focused tool — invoked when you're working on that specific kind of writing.

## Install

### Claude Code (CLI)
```bash
cp -r skills/* ~/.claude/skills/
```

### Claude Cowork (desktop)
1. Open the folder you've pointed Cowork at
2. Drop the `skills/` directory inside it (or merge with an existing `skills/` folder)
3. Restart the session

Each skill has frontmatter that tells Claude when to auto-invoke it.

## The eight skills

| Skill | Triggers when |
|-------|---------------|
| [cold-email-coach](cold-email-coach/SKILL.md) | Drafting or critiquing a cold email, LinkedIn DM, intro request |
| [op-ed-coach](op-ed-coach/SKILL.md) | Drafting an op-ed, opinion piece, or LinkedIn long-form |
| [pitch-coach](pitch-coach/SKILL.md) | VC pitch, internal pitch, six-word product summary, mission statement |
| [gratitude-note-coach](gratitude-note-coach/SKILL.md) | Thank-you notes, recommendation letters, recognition |
| [concision-drill](concision-drill/SKILL.md) | Cutting a draft to a target word count without losing substance |
| [jargon-killer](jargon-killer/SKILL.md) | Scrubbing banned words and replacing them |
| [bluf-rewriter](bluf-rewriter/SKILL.md) | Re-organizing so the bottom line is up front |
| [winning-writing-critic](winning-writing-critic/SKILL.md) | Grading any draft against the full rubric and rewriting |

## How they fit together

Most skills point back to `points/` for the source rules. The critic skill orchestrates the others — it's the one to invoke when you don't know which specialized skill applies.
