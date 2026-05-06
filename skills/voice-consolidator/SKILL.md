---
name: voice-consolidator
description: Bridge Claude Code's auto-memory system to winning-writing's `context/` files. Reads recent writing-related feedback memories from `~/.claude/projects/<project>/memory/` and proposes merges into `context/voice-and-style.md` and `context/about-me.md`. Use when the user says "consolidate my voice," "update from memory," "voice-consolidator," "/voice-consolidator," or "what has Claude learned about my style?" Always proposes diffs and requires approval per file before writing.
---

# Voice consolidator

Source: `context/voice-and-style.md`, `context/about-me.md`, plus the user's Claude Code auto-memory directory.

## Why this exists

Claude Code's auto-memory captures cross-conversation feedback as files like `feedback_writing_style.md` and `feedback_pm_framing.md`. Winning-writing's `context/` files are read by every Coach run. The two don't talk to each other — so insights from a session about email writing might never make it into the voice file that the next Coach session reads.

This skill is the bridge: pull from auto-memory, propose merges into context files, user approves per file.

## Where to find auto-memory

The memory dir is platform-specific. Common locations:

- macOS / Linux: `~/.claude/projects/<project-slug>/memory/`
- Windows: `%USERPROFILE%\.claude\projects\<project-slug>\memory\`

The project slug is derived from the working-directory path. Find the right one by listing `~/.claude/projects/` and matching the slug to the user's current project.

Every memory directory has a `MEMORY.md` index. Read that first — it lists every memory by file with a one-line description. Don't read the full memory contents until you've narrowed to writing-relevant ones.

If the user hasn't told you the path, ask. Don't guess and read the wrong files.

## Inputs

None required — the skill is initiated by the user saying "consolidate my voice" or similar.

Optional: the user can scope the run — "just look at the last week of memories," "only check feedback memories," "skip project memories."

## Process

1. **Find the memory dir** — ask the user if you don't know it, or check `~/.claude/projects/`
2. **Read `MEMORY.md`** — the index file
3. **Filter to writing-relevant memories** — file names matching `feedback_writing*`, `feedback_pm*`, `feedback_tone*`, `voice*`, `style*`, plus user memories that name the user's role/identity/focus that aren't already in `about-me.md`
4. **Read each relevant memory file in full** — get the actual content, not just the index hook
5. **Read current `context/voice-and-style.md` and `context/about-me.md`** in full
6. **Identify gaps** — for each memory, ask: is this insight already in the context file? If yes, skip. If no, this is a candidate for merge.
7. **Group candidates by target file** — voice-and-style.md vs. about-me.md, per the routing rules in [voice-commit/SKILL.md](../voice-commit/SKILL.md)
8. **Propose merges per file**:
   - For each file, show a single proposed diff with all candidate merges grouped
   - **Cite the source memory for each addition** — format inline as a markdown sub-bullet or trailing parenthetical
   - Flag contradictions (memory says X, context file says not-X)
9. **Ask for approval per file** — the user can approve voice-and-style.md but reject about-me.md, or vice versa. Don't bundle.
10. **On approval, write the file** using the Edit tool
11. **Suggest pruning** — for any auto-memory now superseded by the context file, suggest the user remove it from the auto-memory system to keep the index lean. (Don't auto-delete; the user prunes.)

## The merge philosophy

Same as `voice-commit`: preserve old, add new, flag contradictions, don't paraphrase. See [voice-commit/SKILL.md](../voice-commit/SKILL.md) for the full rules.

**Additional rule for this skill:** cite the source memory for every addition. The user should be able to trace each new line in `voice-and-style.md` back to a specific feedback memory. Format:

```markdown
- Banned word: "leverage" — never as a verb. (from `feedback_writing_style.md`, line 14)
```

The citation is for verifiability, not permanent record. If the user prefers a clean voice file without citations, ask — they may want to drop the citation after the diff is approved.

## What you do NOT do

- Do NOT auto-write. Always show diffs first, per file.
- Do NOT read auto-memory files outside the writing-relevant filter unless the user explicitly broadens scope. Most user memories (e.g., "user is a data scientist") are not relevant to a writing-style file.
- Do NOT delete or modify auto-memory files. That's a separate operation; this skill only reads.
- Do NOT merge memories that contradict the context files without flagging the contradiction. The user picks which version is canonical.
- Do NOT bundle voice-and-style.md and about-me.md into one diff. The user might approve one and reject the other.

## When the auto-memory has nothing new

Say so plainly. "I read 7 writing-related memories; all 7 are already reflected in your context files. Nothing to consolidate." That's a successful run, not a failure.

## When auto-memory contradicts the context file

Surface the contradiction; don't pick a side. Format:

> **Contradiction flagged:** memory `feedback_writing_style.md` says you avoid em-dashes; `voice-and-style.md` says em-dashes are okay in commentary but not in email bodies. Which is canonical?

Wait for the user to pick before merging anything related to that contradiction.

## How often to run this

The user decides. Reasonable cadences:

- **Weekly** — light touch, catches drift
- **After a major writing project** — captures patterns from intensive use
- **When the user notices Coach is missing a known preference** — targeted fix

This skill is not auto-scheduled. The user invokes it.

## Relationship to `voice-commit`

- `voice-commit` is for one-off, in-the-moment additions ("save this rule")
- `voice-consolidator` is for periodic batch updates from the auto-memory system

Same merge philosophy, different trigger and scope.
