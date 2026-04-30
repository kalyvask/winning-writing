---
name: jargon-killer
description: Scans a draft for banned words, AI tells, and consultant jargon, then replaces them with plain English. Use when the user wants a "jargon scrub," asks "is this too corporate," or has a draft full of words like "leverage," "synergy," "drive," "empower," "delve," "tapestry," "navigate the complexities." Triggers on "jargon," "buzzwords," "make this less corporate," "AI-sounding," "sounds like ChatGPT."
---

# Jargon killer

Source: `points/banned-jargon.md`. Read it before running.

## What this skill does

Two passes:

1. **Find** — every banned word, AI tell, and wordy phrase in the draft
2. **Replace** — with the shortest, plainest alternative

If a sentence collapses when you remove the jargon, the sentence was probably empty. Cut it.

## The kill list

### Silicon Valley / academic jargon (always)
`currently`, `synergy`, `synergize`, `leverage`, `align`, `drive`, `strategize`, `empower`, `enable`, `deliverables`, `utilize`, `incentivize`, `facilitate`, `impact`, `at the intersection of`, `driving innovation`, `building and scaling`, `passionate about complex problems`

### Grammar errors
`irregardless` → regardless
`literally` (when used metaphorically)
`ironic` (when you mean coincidental)

### Wordy phrases (replace)
| ❌ | ✅ |
|---|---|
| In the event that | If |
| Concerning the matter of | About |
| I came to the realization that | I realized |
| We are investigating | We're investigating |
| Negative impacts | Harm |
| Positive impacts | Benefits |
| Sorry for the delay | Thanks for your patience |
| I think maybe we should | Let's |
| What works best for you? | A specific proposal |
| Utilize | Use |
| In today's fast-paced world | (delete) |
| I hope this email finds you well | (delete) |
| Just wanted to check in | (delete or replace with real content) |

### AI tells (scrub)
- *"It's not just X — it's Y."* (most common AI tic)
- *"In today's [adjective] world"*
- *"Delve into"*
- *"Navigate the complexities of"*
- *"Tapestry of"*
- *"Robust solution"*
- *"Cutting-edge"*
- *"Game-changer"*
- Em-dashes used as a tic (one or two per page is fine — twelve is a tell)
- Tricolons everywhere ("X, Y, and Z" three times in three sentences)
- Hedge-then-commit: *"While there are many considerations, ultimately…"*

### Cold-email-specific killers
- *"I hope you are well"*
- *"My name is X"*
- *"Good morning"* / *"Good afternoon"* (timezone unknown)
- *"I'd love to pick your brain"*
- *"I'd love to grab coffee"*
- *"Like you, but at a vastly smaller scale"*
- *"Just following up"*

## Output format

For each hit, return:

```
Line N: "the original sentence with the jargon"
  Banned: <word/phrase>
  Replace with: "the rewritten sentence"
  Or cut entirely if: <reason>
```

Then return the full clean draft at the bottom.

## Before/after example

❌ *"Currently, we are leveraging our cross-functional synergies to drive impact at the intersection of strategy, product, and execution."*

✅ *"We're using the team's range to ship product faster."*

(Word count: 22 → 11. Same meaning. No buzzwords.)

## The litmus test

After cleaning: read the draft to a smart 14-year-old. If they understand it, you're done. If they ask *"what does that mean?"* — go again.

## When the user pushes back

Common: *"but my industry uses these words."*

Response: *"Your industry says them. Your readers tune them out. The people who get read are the ones who don't sound like everyone else."*
