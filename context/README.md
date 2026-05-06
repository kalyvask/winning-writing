# Context files

The single highest-leverage thing you can do with Claude — takes 20 minutes once, pays off on every session after.

Drop these two files in your Cowork folder (or anywhere Claude can read them) and add a global instruction:

> *"Before every task, read everything in my context files."*

From then on, every session starts with Claude already knowing how you think and write.

| File | What it does |
|------|--------------|
| [about-me.md](about-me.md) | Briefs Claude on who you are and what you're working on — like onboarding a new colleague, not a resume |
| [voice-and-style.md](voice-and-style.md) | Teaches Claude how you write — tone, structure, banned phrases, sample paragraphs |

Both are templates. Edit them. The specificity is the whole point — the more "you" they sound, the less generic Claude's output will be.

## Updating them over time

Editing the files by hand works but rarely happens once they're set up. Two skills grow them incrementally instead:

- **`voice-commit`** — invoke whenever you notice a voice rule that isn't captured ("save this to my voice file: I never use 'leverage' as a verb"). Proposes a diff into the right section of the right file, asks for approval, writes on yes.
- **`voice-consolidator`** — invoke periodically (weekly, after a major writing project, or when Coach is missing a known preference). Reads Claude Code's auto-memory at `~/.claude/projects/<project>/memory/` and proposes merges with source citations.

Both skills follow the same merge philosophy: preserve what's there, add what's new, flag contradictions, never paraphrase your exact words. Auto-writing is intentionally not supported — every change is approved per file before it lands.

See [`skills/voice-commit/SKILL.md`](../skills/voice-commit/SKILL.md) and [`skills/voice-consolidator/SKILL.md`](../skills/voice-consolidator/SKILL.md).
