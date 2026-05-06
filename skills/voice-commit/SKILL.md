---
name: voice-commit
description: Manually merge a new voice pattern, banned word, sample paragraph, or career fact into `context/voice-and-style.md` or `context/about-me.md`. Use when the user says "save this to my voice file," "remember this style," "this isn't how I write," "voice-commit," or "/voice-commit." Always proposes a diff and requires approval before writing — never auto-writes. Routes style notes to voice-and-style.md and identity/career notes to about-me.md.
---

# Voice commit

Source of truth: `context/voice-and-style.md` and `context/about-me.md`. The skill that lets the user incrementally teach the toolkit their voice without manually editing the files.

## Why this exists

The context files are the single highest-leverage input to every Coach output. When the user notices something about their voice that isn't captured (a phrase they use, a word they hate, a new project, a formative experience), this skill captures it without forcing them to open the file and figure out where it goes.

Auto-learning from every draft is a trap — if a Coach output drifted toward AI-tells, learning from it would reinforce the bad pattern. The fix: manual user-triggered merge with diff approval. Borrowed from chief-of-staff's `/commit` slash command pattern and llm-wiki's UPDATE_PROMPT merge logic.

## Inputs

One of:

1. **A paragraph the user wrote** that they liked — a positive sample to add to `voice-and-style.md`
2. **A rewrite the user did** of a Coach output — usually means the original had an AI-tell or wrong-voice phrase; capture both the bad pattern (for AI tells / banned words) and the good rewrite (for sample paragraphs)
3. **A general note about style** — "I never use 'leverage,'" "I prefer first person," "I don't use semicolons"
4. **A career fact** — new job, new project, new credential, new public output (this routes to `about-me.md`)
5. **An identity fact** — where they grew up, formative experience, hobby, language, distinctive trait (also `about-me.md`)

If the input is ambiguous (e.g., "save this" with no context), ask one clarifying question before proceeding.

## The merge philosophy (from llm-wiki UPDATE_PROMPT)

When merging into the file:

1. **Preserve old content** — never delete an existing rule, sample, or fact without explicit user approval
2. **Add new info in the right section** — don't dump it at the end of the file
3. **Flag contradictions** — if the new info contradicts existing content (e.g., "actually I do use semicolons sometimes" when the file says "I avoid semicolons"), call it out and ask the user which version is correct
4. **Don't paraphrase** — when adding a sample paragraph, a quote, or a banned word, use the user's exact words. The voice file IS their voice; preserve it verbatim.
5. **Cite source if relevant** — if the input came from a specific Coach output the user critiqued, mention that briefly in a sub-bullet so future readers know why the rule exists

## Routing rules

| If the input is about... | Update this file | Section |
|---|---|---|
| A word the user uses | `voice-and-style.md` | Words I like |
| A word the user doesn't use | `voice-and-style.md` | Banned words |
| A sentence rhythm or structure | `voice-and-style.md` | Sentence structure |
| An AI tell to flag | `voice-and-style.md` | AI tells |
| A sample paragraph the user likes | `voice-and-style.md` | Sample paragraphs |
| A target length or format | `voice-and-style.md` | Length targets / Format preferences |
| A posture / register preference | `voice-and-style.md` | Posture |
| New job, project, paper, credential | `about-me.md` | Trajectory / Public output |
| Where they live, lived, hobbies, languages | `about-me.md` | Identity / How I think |
| A specific belief, thesis, or focus | `about-me.md` | Primary focus / Public output |
| What Claude should know about them | `about-me.md` | What you (Claude) should know |

## Process

1. **Identify the target file** based on the routing rules above
2. **Read the current file** in full
3. **Identify the right section** for the new info (don't append blindly)
4. **Compose the merge** as a diff — show the surrounding context (3-5 lines before/after) plus the addition
5. **Show the diff to the user** — clearly label what's being added, what's being changed (if anything), what's being flagged for contradiction
6. **Ask for approval** before writing
7. **On approval, write the file** using the Edit tool (preserves existing content; surgical change)
8. **Echo back the change** in 1-2 sentences. If the change has implications for other skills (e.g., a new banned word should also be added to `points/banned-jargon.md`), suggest the follow-up but don't do it without approval.

## What you do NOT do

- Do NOT auto-write. Always show the diff and wait for approval.
- Do NOT rewrite or paraphrase the user's exact words.
- Do NOT delete existing content without explicit approval.
- Do NOT route style notes to about-me.md or career notes to voice-and-style.md.
- Do NOT batch multiple unrelated additions into one diff. One concept per commit; the user reviews each.

## When in doubt

Ask. Better to take 10 seconds clarifying than write the wrong file or the wrong section.

## Example

**User:** "save this to my voice file: I never use 'leverage' as a verb. I'd rather say 'use' or just rewrite the sentence."

**Skill:**

1. Reads `context/voice-and-style.md`
2. Identifies the "Banned words" section
3. Proposes diff:
   ```diff
     ## Banned words
     - synergy, drive, deliverables, utilize
   + - leverage (as a verb) — use "use" or rewrite the sentence
     - "at the intersection of"
   ```
4. Shows diff to user, asks: "OK to write?"
5. On yes: writes the change, confirms, suggests "you might also want to add this to `points/banned-jargon.md` since the cold-email-coach reads from there — want me to do that too?"
