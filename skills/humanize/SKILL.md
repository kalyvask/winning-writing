---
name: humanize
description: Makes a draft read like a real human typed it — not edited the polish out, just adds the asymmetry, light contractions, and occasional one-character typo a person actually leaves in. Use when a draft is technically correct but reads polished beyond plausibility, when the user wants to "rough it up," "make it more human," "less AI-clean," "add typos." Triggers on "humanize," "rough it up," "less polished," "add typos," "more casual," "sounds too clean."
---

# Humanize

Source: `points/ai-writing-rules.md` and the centaur-writer thesis. The point of this skill is the inverse of every other skill in this repo — most of them sharpen, this one *de-sharpens* deliberately.

## The premise

A perfect email is suspicious. Real people:
- Use contractions inconsistently ("it's" once, "it is" once in the same email — humans aren't consistent)
- Drop articles in a hurry ("just landed in SF, heading to the office")
- Leave one micro-typo per ~300 words (not a spelling error — a homophone, a missing space, a doubled word)
- Vary sentence punctuation (sometimes a period where a comma would be cleaner)
- Use parentheses or em-dashes inconsistently (well, em-dashes are banned now — but the *inconsistency* is what reads human)
- Repeat a word from the previous sentence sometimes (real attention drift)

A model output is *too clean*. This skill leaves real-person residue in.

## Two modes

### Mode 1 — Shorten + roughen (default)
Take the draft and:
1. Cut 10–20% of the words
2. Convert 60–70% of "I am / it is / they are / cannot" to contractions
3. Drop 1–2 articles where context allows ("the" or "a") — only where a human would naturally elide
4. Pick ONE place to leave a single micro-typo (see types below)
5. Vary one sentence's punctuation in a slightly imperfect way (a period instead of a comma; a sentence fragment)

### Mode 2 — Roughen only (preserve length)
Same as above, no length cut.

## Approved typo types (one per ~300 words, never more)

A typo here is a *signal of humanness*, not carelessness. The wrong typo is worse than no typo. Use only one of these per email:

- **Missing space:** "tothe" or "i'll" with lowercase i (a phone-thumbs slip)
- **Doubled small word:** "to to" or "the the" (auto-correct miss, classic)
- **Homophone slip:** "your" for "you're" (only in a casual context — never in a formal application)
- **Dropped period at end of a sentence in the middle of a paragraph** (one place, not the last sentence)
- **Single-character drop:** "thats" instead of "that's" (one place only)

**Never use:** misspelled common words, mangled names, mangled numbers, garbled URLs, broken capitalization at sentence start. Those are real errors. The goal is "human" not "drunk."

## Approved contraction rules

- "I am" → "I'm" (always, except in formal opening)
- "it is" → "it's" (most of the time)
- "they are" → "they're" (always when casual)
- "cannot" → "can't" (always — "cannot" is a corporate tell)
- "do not" → "don't" (always when casual)
- "would not" → "wouldn't" (always)
- "I will" → "I'll" (most of the time, but mix in "I will" once for emphasis)

## Article-drop patterns (use sparingly — one or two)

- "I'll come to your office" → "I'll come to your office" (no change — articles before possessives stay)
- "I sent you the proposal" → "Sent you the proposal" (drop subject, keep article)
- "I'm thinking about a pivot" → "Thinking about a pivot" (drop subject, keep article)
- "Just got back from London — let's talk Tuesday" → fine as-is

The pattern: drop the *subject pronoun* in casual openers, not articles. That's how humans actually shortcut.

## When NOT to humanize

- **Cold emails to formal recipients** (judges, regulators, journalism editors at top publications). Polished is correct here.
- **Gratitude notes.** They should already be in the user's voice — humanizing further means the user wrote it themselves.
- **Op-eds.** Editors reject typos. Polish is the price of publication.
- **Job application cover letters at large companies** if the company is famously formal.
- **Anything where the recipient is paid to evaluate writing quality** (book editors, MFA professors).

For everything else — startup CEO outreach, peer-to-peer networking emails, Substack drafts, Slack updates — humanizing is appropriate.

## Output format

```
## Original
[the input draft]

## Humanized
[the rewritten draft, with the changes]

## What changed
- Cut [N] words (X% reduction)
- Contractions: [list]
- Article drops: [list]
- Micro-typo introduced: [the typo, where, why this type]
- Punctuation variation: [where, what changed]

## Read aloud
Read the humanized version aloud. Does it sound like the user texting a friend? If yes, ship. If it sounds like AI's "casual mode" (forced informality), back off — over-roughened reads worse than over-polished.
```

## The litmus test

A friend reading the email blind should think *"yeah, that's how Alex writes when he's in a hurry"* — not *"this email has a typo, was Alex drunk?"* If the second reaction is plausible, the typo is wrong; pick a different one or skip.

The goal isn't *errors*. The goal is the texture of a real person typing on a real keyboard while half-listening to a podcast.
