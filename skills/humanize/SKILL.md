---
name: humanize
description: Makes a draft read like a real human typed it — adds asymmetry, light contractions, and (rarely) one safe typo. Use only when a draft is technically correct but reads polished beyond plausibility, when the user wants to "rough it up," "make it more human," or "less AI-clean." Does NOT run on high-stakes writing (see "When NOT to humanize"). Triggers on "humanize," "rough it up," "less polished," "more casual," "sounds too clean."
---

# Humanize

Source: `points/ai-writing-rules.md` and the centaur-writer thesis. The point of this skill is the inverse of every other skill in this repo — most of them sharpen, this one *de-sharpens* deliberately.

**Operator note (2026-05-07):** Dialed back from the original aggressive setting (too many typos and missing words landed in finals), then re-tuned for a middle ground: a few safe roughening moves are still welcome even in short pieces. The bias is "fewer types of typos, but still some texture" — not "skip everything."

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
5. Optionally combine two short adjacent paragraphs into one (or keep an aside on the same line instead of breaking) — humans don't always hit return where AI does
6. Apply at most ONE safe typo (see below). Pieces under ~150 words: max 1 typo. Pieces over 300 words: still max 2 typos total. Never accumulate.

### Mode 2 — Roughen only (preserve length)
Same as above, no length cut.

## Safe roughening moves (use freely, even in short pieces)

These are not typos — they are rhythm choices that read as a real person rather than a model. Apply 1–2 per piece without worry:

- **Subject-pronoun drop** in a casual opener ("Just landed in SF" instead of "I just landed in SF")
- **Paragraph compression** — combine two short adjacent paragraphs that AI defaulted to splitting (humans don't always hit return at every clause break)
- **Mixed contractions** — use "I'm" most places but leave one "I am" somewhere for inconsistency
- **One sentence-fragment** where a full sentence would also work
- **Replace one comma with a period** (or vice versa) where both would scan

## Approved typo types (use sparingly — see counts above)

Only these types qualify as safe typos. Pick ONE for short pieces, at most TWO across longer pieces.

- **Doubled small word:** "to to" or "the the" or "and and" (auto-correct miss, classic — readers parse past it)
- **Missing space inside a contraction or compound:** "i'll" with lowercase i (a phone-thumbs slip)
- **Missing terminal period** — drop the period on the *very last* sentence of the piece only. Never mid-paragraph. This reads as "sent in a hurry," not as broken parsing.

That's it. The three above are the only approved typo types.

**NEVER use:**
- Homophone slips ("your"/"you're," "their"/"there"). High-evaluation readers flag these as illiteracy.
- Dropped period **mid-paragraph or mid-piece**. Only the very last period of the whole piece can drop; anywhere else reads as broken parsing.
- Single-character drop ("thats" for "that's"). Reads as carelessness.
- Misspelled common words, mangled names, mangled numbers, garbled URLs.
- Broken capitalization at sentence start (mid-piece — lowercase opener of an email is a separate stylistic choice and is fine if the user does it consistently).
- **Dropped articles, negations, subjects, verbs, or any content-bearing word.** Missing words are not informalisms — they are damage. The reader cannot recover the meaning.

The wrong typo is worse than no typo. **When uncertain, skip the typo (but still apply the safe rhythm moves above).**

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
- **GitHub READMEs and other fact-checkable public surfaces** that name specific people, products, or numbers.

For all of the above, the skill should output the original draft unchanged and explicitly note: *"Skipped humanize — high-stakes context."*

Substack drafts, Slack messages, peer-to-peer cold emails to startup CEOs, and similar lower-stakes writing are fair game — apply the safe rhythm moves and (optionally) one typo per the counts above. The under-200-words skip rule from the previous version is removed: short pieces can still have one safe typo + rhythm moves.

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
- [ ] No mid-paragraph dropped periods (only the very last sentence may drop its period)
- [ ] At most one typo per ~150 words; max two across the whole piece
- [ ] Reads as "in a hurry," not "drunk" or "sloppy"
```

## The litmus test

A friend reading the email blind should think *"yeah, that's how they write when they're in a hurry"* — not *"this email has a typo, were they drunk?"* and never *"did they finish this sentence?"*

If a missing word makes the meaning ambiguous, it is damage, not humanity. Reject the change.

The goal isn't *errors*. The goal is the texture of a real person typing on a real keyboard while half-listening to a podcast — but a person who still proofread once before hitting send.

## For the GitHub auto-push agent

If this skill is being chained with an auto-publish agent (e.g., one that pushes to GitHub or sends email): add a separate proofread pass after humanize that checks for missing required words and unsafe typos. Do not trust this skill's output to be ready-to-publish without that review.
