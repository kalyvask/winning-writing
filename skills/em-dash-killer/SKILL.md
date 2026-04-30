---
name: em-dash-killer
description: Removes em-dashes (—) and double-hyphens (--) from a draft, replacing each with a comma, period, parenthesis, or colon. Use when the user wants to scrub em-dashes specifically, when a draft was written by an AI and needs de-AI-ifying, or when the user says "no em-dashes," "remove em-dashes," "kill the dashes," "this looks like AI." Triggers on "em-dash," "em dash," "—", "remove dashes," "no dashes," "AI tell."
---

# Em-dash killer

Source: `points/ai-writing-rules.md` (em-dash rule).

## Why this exists

In 2026 the em-dash is the **#1 AI tell**. Models love them. Humans use them sparingly. A draft with twelve em-dashes per page is a confession that an AI wrote it.

The point of this skill is not to ban the em-dash everywhere. It's to scrub them aggressively in formats where they don't belong (email, memo, Slack, status update) and trim them in formats where one or two is fine (op-ed, essay, long-form post).

## Format rules

| Format | Em-dashes allowed |
|--------|-------------------|
| Cold email | **Zero** |
| Memo / status update | **Zero** |
| Slack message | **Zero** |
| LinkedIn post | One, max |
| Op-ed / essay | One per page (~250 words), max two |
| Substack post | One per major section break |

If the count is over the limit, scrub.

## Substitution table

| Pattern | Rewrite options |
|---------|-----------------|
| `X — Y` (parenthetical aside) | `X (Y)` or `X, Y,` or `X: Y` |
| `X — and Y` (continuing thought) | `X. And Y.` or `X, and Y` |
| `X — Y — Z` (interrupted clause) | `X, Y, Z` (commas) or `X. Y. Z.` (sentences) |
| `If — and only if — Z` | `If, and only if, Z` |
| `I built X — A, B, C — from scratch` | `I built X from scratch: A, B, C.` |
| `She said — wait, did she?` | `She said. Wait, did she?` |
| `It's not just X — it's Y` (AI tic) | Cut entirely. Rewrite without the construction. |

The right substitution depends on what the em-dash was *doing*:

- **Aside / clarification** → parenthesis or colon
- **List or apposition** → colon
- **Tone shift / interruption** → period (start a new sentence)
- **Connective ("and so")** → "and," "so," or comma

## Output format

Two passes:

### Pass 1 — Inventory
```
Em-dashes found: N
Double-hyphens found: N
Total: N
```

For each occurrence, return:
```
Line N: "the original sentence with the —"
  Function: aside | apposition | tone-shift | connective
  Rewrite: "the rewritten sentence"
```

### Pass 2 — Clean draft
The full text with every em-dash replaced. No commentary in this section, just the clean text.

## When NOT to remove

- Inside a direct quote from someone else (preserve their punctuation)
- Inside dialogue if the speaker would naturally pause that way
- Inside a code block, file path, or URL
- Inside a quoted citation (e.g., a book title rendered with em-dash)

If unsure, ask the user.

## The litmus test

Read the rewrite aloud. Does the prose sound *more* like a human typing on a keyboard than the original? If yes, ship. If the rewrite reads worse (jagged, robotic), back off — try a different substitution from the table above.

The goal is human prose, not punctuation purity.
