---
name: kill-redundancy
description: Detects and cuts phrases where one half implies the other — "going forward," "moving forward," "currently writing this email to you," "reduce the size of the team so they are smaller." Different from concision-drill (which cuts throat-clearing) and adverb-killer (which cuts empty intensifiers). This skill catches a specific failure: a qualifier that adds nothing because the verb or context already implies it. Use when a draft reads as wordy in a way that's hard to point at — long without any obvious filler. Triggers on "going forward," "moving forward," "wordy," "redundant," "tighten this," "too many words," "say it twice."
---

# Kill redundancy

Source: Glenn Kramon's *Winning Writing* class — the May 14 2026 session exercise on cutting "make / be / has," plus the corollary rule on tag-along phrases that say what the verb already said.

## The pattern this skill catches

A specific kind of wordiness: a qualifier that survives in the draft because it *feels* like it adds information when in fact it adds nothing. The verb or the surrounding context already implies it.

Three flavors:

### 1. Verb-implied direction
*"Going forward"* and *"moving forward"* after a future-tense verb. *"We will improve security going forward"* — *"will"* already places the action in the future. *"Going forward"* is redundant.

### 2. Self-referential meta-commentary
*"I am currently writing this email to you"* — the reader is reading it; they know. *"As I mentioned earlier"* when you're saying it twice anyway. *"This piece will argue that"* when the next sentence is the argument.

### 3. Verb-implied result
*"We had to reduce the size of our engineering teams so that they are smaller, faster, and nimbler."* — reducing the size *makes* them smaller. The "so that they are smaller" repeats what the verb already did. Same with *"increase the number of customers so that we have more customers."*

## When this skill differs from siblings

- **`concision-drill`** cuts throat-clearing, hedges, and filler that has no clear function (*"In this piece I will argue,"* *"some considerations on,"* *"it might be argued that"*).
- **`adverb-killer`** cuts empty intensifying adverbs (*very, really, actually, basically, clearly*).
- **`jargon-killer`** cuts buzzwords (*synergy, leverage, drive, strategize*).
- **`kill-redundancy`** catches a different pattern: a phrase that is *legible English doing real grammatical work* but is *redundant with the rest of the sentence*. The fix isn't to swap a buzzword for a clean word; it's to delete the phrase entirely.

The four skills compose. Run them in this order on a wordy draft: jargon-killer → adverb-killer → kill-redundancy → concision-drill.

## The catalog of redundancy patterns

### Direction tags
| ❌ Redundant | ✅ Fixed |
|---|---|
| We promise better security going forward. | We promise better security. |
| Moving forward, we'll offer encryption. | We'll offer encryption. |
| In the future, all our hires will be technical. | All our hires will be technical. |
| From this point onward, we'll improve. | We'll improve. |

The future tense already does the work. Add a tag only if you're contrasting with the past (*"unlike last quarter, we'll publish monthly going forward"* — fine).

### Self-referential meta-commentary
| ❌ Redundant | ✅ Fixed |
|---|---|
| I am currently writing this email to you. | (cut — the reader is reading it) |
| As I said earlier, X. | X. |
| As I mentioned in my last email, X. | X. (if the recipient remembers, no need; if they don't, repeating "as I mentioned" sounds passive-aggressive) |
| The purpose of this memo is to argue that X. | X. (just argue it) |
| What I will demonstrate in this section is X. | X. (then demonstrate it) |

### Verb-implied result
| ❌ Redundant | ✅ Fixed |
|---|---|
| Reduce the size of teams so they are smaller. | Reduce the team. |
| Increase headcount so we have more people. | Increase headcount. |
| Lower the price so it costs less. | Lower the price. |
| Shorten the meeting so it's not as long. | Shorten the meeting. |
| Speed up the rollout so it's faster. | Speed up the rollout. |

If the verb names the action, the result is implied. Stop describing the result.

### Tautological qualifiers
| ❌ Redundant | ✅ Fixed |
|---|---|
| 9am in the morning | 9am |
| Free gift | Gift |
| New innovation | Innovation |
| Past history | History |
| Future plans | Plans |
| End result | Result |
| Final outcome | Outcome |
| Unexpected surprise | Surprise |
| Personal opinion | Opinion |
| Each individual person | Each person |
| Advance planning | Planning |
| Joint collaboration | Collaboration |
| Period of time | Period |

The adjective and the noun are saying the same thing. Cut the adjective.

### Doubled qualification
| ❌ Redundant | ✅ Fixed |
|---|---|
| I will definitely commit. | I will commit. |
| It's absolutely critical. | It's critical. |
| Completely unique. | Unique. |
| Totally finished. | Finished. |
| Fully comprehensive. | Comprehensive. |

If the noun or verb is absolute, the intensifier is redundant.

### Restating the obvious
| ❌ Redundant | ✅ Fixed |
|---|---|
| Free of charge | Free |
| At a price of $100 | $100 |
| In the month of November | In November |
| The country of Greece | Greece |
| Despite the fact that | Although |
| In light of the fact that | Because |
| For the purpose of | To |

## The two-question test for any phrase

For every phrase in a draft, ask:

1. **Does this phrase add information not already implied by the verb, the subject, or the surrounding sentence?**
2. **If I cut this phrase, what changes?**

If 1 is no and 2 is "nothing changes" — cut.

## How to run the pass

### Pass 1 — Scan for tags
Search the draft for *going forward, moving forward, in the future, currently, as I mentioned, as I said, as we discussed.* Each one is a candidate to cut.

### Pass 2 — Scan for verb-result restatements
For each verb, ask: does the next clause merely describe the result of the verb? *"Reduce X so Y is smaller"* — cut the *"so Y is smaller."*

### Pass 3 — Scan for tautological adjectives
*free gift, new innovation, past history, end result* — cut the adjective.

### Pass 4 — Scan for doubled qualifiers
*definitely commit, absolutely critical, completely unique, totally finished* — cut the intensifier.

### Pass 5 — Read aloud
Anything that lands twice in your ear lands twice in the reader's ear. Cut the second landing.

## Output format

```
## Redundancy hits

| Line | Pattern | Original | Fixed |
|---|---|---|---|
| N | direction tag | "going forward, we'll improve" | "we'll improve" |
| N | self-referential | "as I said earlier, X" | "X" |
| N | verb-implied result | "reduce so they are smaller" | "reduce" |
| N | tautological | "free gift" | "gift" |

## Cleaned draft
[The full draft with all redundancy cuts applied.]

## Word count
Original: N words → Cleaned: N words (X% reduction)
```

## When NOT to use this skill

- **Legal writing** where the tag-alongs may be load-bearing for precision. *"For the avoidance of doubt"* sometimes does work in a contract that *"to be clear"* doesn't.
- **Poetry, song lyrics, deliberate rhetoric.** Repetition is the device. *"In the past, in the present, going forward"* may be intentional parallelism.
- **Casual chat / Slack** where a small amount of redundancy reads warmer than terse. *"Just wanted to say"* in a thank-you note may earn its place.

## The Kramon rule

> *"Every sentence you write, ask yourself: am I being repetitive? That's the way to improve your writing."*

Most drafts have two to five redundancy hits per paragraph. The most over-written drafts have one every sentence. Run this pass after `jargon-killer` and `adverb-killer` for the cleanest result.
