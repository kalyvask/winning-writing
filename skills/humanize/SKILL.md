---
name: humanize
description: Makes a draft read like a real human typed it — adds asymmetry, light contractions, and (rarely) one safe typo. Use only when a draft is technically correct but reads polished beyond plausibility, when the user wants to "rough it up," "make it more human," or "less AI-clean." Does NOT run on high-stakes writing (see "When NOT to humanize"). Triggers on "humanize," "rough it up," "less polished," "more casual," "sounds too clean."
---

# Humanize

Source: `points/ai-writing-rules.md` and the centaur-writer thesis. The point of this skill is the inverse of every other skill in this repo — most of them sharpen, this one *de-sharpens* deliberately.

**Operator note (2026-05-06):** This skill was running too hot. Too many typos and missing words landed in finals. The bias has been moved firmly toward "skip" rather than "inject." If in doubt, do nothing.

## The premise

A perfect email is suspicious. Real people:
- Use contractions inconsistently ("it's" once, "it is" once in the same email — humans aren't consistent)
- Vary sentence punctuation (sometimes a period where a comma would be cleaner)
- Use parentheses inconsistently
- Repeat a word from the previous sentence sometimes (real attention drift)

A model output is *too clean*. This skill leaves a small amount of real-person residue in. Note: residue, not damage. Missing required words and unsafe typos are damage; do not introduce them.

## Two modes

### Mode 1 — Shorten + roughen (default)
Take the draft and:
1. Cut 10–20% of the words
2. Convert most "I am / it is / they are / cannot" to contractions, but mix in one full form somewhere for inconsistency
3. Drop the *subject pronoun* in one casual opener if the draft has one (never drop articles)
4. Vary one sentence's punctuation in a slightly imperfect way (a period instead of a comma; a sentence fragment)
5. **Optional, only for pieces over 250 words and only in low-stakes mode:** introduce ONE approved typo. For shorter pieces or any high-stakes piece: skip the typo entirely.

### Mode 2 — Roughen only (preserve length)
Same as above, no length cut.

## Approved typo types (one per piece, max — and only for pieces over 250 words in low-stakes mode)

If you introduce a typo, use only one of these two safe types:

- **Doubled small word:** "to to" or "the the" or "and and" (auto-correct miss, classic — readers parse past it)
- **Missing space inside a contraction or compound:** "i'll" with lowercase i (a phone-thumbs slip)

That's it. The two above are the only approved types.

**NEVER use:**
- Homophone slips ("your"/"you're," "their"/"there"). High-evaluation readers flag these as illiteracy.
- Dropped period mid-paragraph. Reads as broken parsing, not humanity.
- Single-character drop ("thats" for "that's"). Reads as carelessness.
- Misspelled common words, mangled names, mangled numbers, garbled URLs.
- Broken capitalization at sentence start.
- **Dropped articles, negations, subjects, verbs, or any content-bearing word.** Missing words are not informalisms — they are damage. The reader cannot recover the meaning.

The wrong typo is worse than no typo. **When uncertain, skip.**

## Approved contraction rules

- "I am" → "I'm" (always, except in formal opening)
- "it is" → "it's" (most of the time)
- "they are" → "they're" (always when casual)
- "cannot" → "can't" (always — "cannot" is a corporate tell)
- "do not" → "don't" (always when casual)
- "would not" → "wouldn't" (always)
- "I will" → "I'll" (most of the time, but mix in "I will" once for emphasis)

## Subject-pronoun drop (sparingly — only one per piece)

Drop the subject pronoun in a casual opener, never the article:

- "I just got back from London" → "Just got back from London"
- "I sent you the proposal" → "Sent you the proposal"
- "I'm thinking about a pivot" → "Thinking about a pivot"

Do not drop "the," "a," "an," "to," or any other article or function word. Do not drop the subject inside a clause that already has one.

## When NOT to humanize (skip entirely — output the input unchanged)

The skill does not run on:

- **LinkedIn About sections, bios, profile pages.** These are evaluated word-by-word by recruiters.
- **Cold emails to formal recipients** (judges, regulators, journalism editors at top publications, senior partners at funds, hiring managers at named companies).
- **Job application materials** (cover letters, application short-answers, follow-up notes).
- **Op-eds and any pitch to a publication.** Editors reject typos.
- **Gratitude notes.** They should already be in the user's voice.
- **Six-word summaries** or any deliberately compressed format.
- **Anything with a fact-checkable public surface** (Substack drafts that name specific people, GitHub READMEs, anything pushed to a public repo).
- **Any piece under 200 words.** Too short for residue to read as human; reads as carelessness instead.

For all of the above, the skill should output the original draft unchanged and explicitly note: *"Skipped humanize — high-stakes context."*

## Output format

```
## Original
[the input draft]

## Humanized
[the rewritten draft, with the changes — or the original unchanged if high-stakes]

## What changed
- Cut [N] words (X% reduction) [or "no length change"]
- Contractions: [list]
- Subject-pronoun drops: [list, max 1]
- Punctuation variation: [where, what changed, max 1]
- Micro-typo introduced: [the typo, where, why this type — or "none"]
- High-stakes detected: [yes/no — if yes, no changes were applied]

## Pre-output review (required)
- [ ] Re-read the humanized version word by word
- [ ] No required words missing (subjects, verbs, articles, negations)
- [ ] No homophone slips
- [ ] At most ONE micro-typo across the whole piece
- [ ] Reads as "in a hurry," not "drunk" or "sloppy"
```

## The litmus test

A friend reading the email blind should think *"yeah, that's how they write when they're in a hurry"* — not *"this email has a typo, were they drunk?"* and never *"did they finish this sentence?"*

If a missing word makes the meaning ambiguous, it is damage, not humanity. Reject the change.

The goal isn't *errors*. The goal is the texture of a real person typing on a real keyboard while half-listening to a podcast — but a person who still proofread once before hitting send.

## For the GitHub auto-push agent

If this skill is being chained with an auto-publish agent (e.g., one that pushes to GitHub or sends email): add a separate proofread pass after humanize that checks for missing required words and unsafe typos. Do not trust this skill's output to be ready-to-publish without that review.
