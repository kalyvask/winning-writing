---
name: adverb-killer
description: Cuts adverbs that don't earn their place — the -ly words and intensifiers that pad a sentence without adding meaning. Implements Stephen King's "the road to hell is paved with adverbs" rule and Kramon's "adverbs ending in -ly are usually unnecessary; cut them." Use when a draft is bloated with "really," "very," "actually," "basically," "literally," "definitely," "clearly," "obviously," or any -ly modifier that the verb already implies. Triggers on "adverbs," "kill the adverbs," "too many qualifiers," "make it tighter," "King-style edit."
---

# Adverb killer

Source: `points/core-rules.md` rule 5 (be shorter), `points/banned-jargon.md` (wordy phrases), and Stephen King's *On Writing*: *"The adverb is not your friend. The road to hell is paved with adverbs."*

## The premise

Most adverbs are evidence the verb wasn't strong enough. *"She walked quickly"* → *"she rushed."* *"He smiled broadly"* → *"he grinned."* *"It is very important"* → *"it matters."*

Adverbs also leak the writer's anxiety: *"clearly,"* *"obviously,"* *"of course"* are tells that the writer is afraid the reader won't agree. Kill them — let the argument stand on its own.

## The three categories to cut

### 1. Empty intensifiers (cut on sight, ~95% of the time)

These add no information. The sentence reads stronger without them.

| Cut | Why |
|---|---|
| `very` | If "very" makes a difference, the adjective was wrong. *"Very tired"* → "exhausted." |
| `really` | Same problem. *"Really fast"* → "fast" or "blistering." |
| `actually` | Almost always pure throat-clearing. |
| `basically` | Filler. Cut. |
| `literally` | If used metaphorically, cut. If literal, you don't need to say so. |
| `definitely` | Hedge dressed up as confidence. Just say it. |
| `clearly` | The reader decides what's clear. Don't tell them. |
| `obviously` | Same problem, plus condescending. |
| `essentially` | Filler. |
| `simply` | Often patronizing. Cut. |
| `quite` | British, weak. Cut. |
| `rather` | Hedge. Cut. |
| `somewhat` | Hedge. Cut or commit. |
| `pretty` (as in "pretty good") | Cut — softens the claim. |
| `truly` | If you have to say "truly," they don't believe you. |
| `genuinely` | Same. |
| `arguably` | Then make the argument. |

### 2. Adverbs the verb already implies (rewrite the verb)

| ❌ Adverb + weak verb | ✅ Stronger verb |
|---|---|
| walked quickly | rushed, sprinted, hurried |
| said loudly | shouted, barked |
| said quietly | whispered, murmured |
| smiled broadly | grinned, beamed |
| held tightly | clutched, gripped |
| ran very fast | sprinted |
| looked carefully | examined, scrutinized |
| ate quickly | wolfed down, devoured |

### 3. Sentence-starting adverbs (almost always cut)

| Cut | Replacement |
|---|---|
| `Importantly,` | (cut — if it's important, the sentence shows it) |
| `Notably,` | (cut) |
| `Interestingly,` | (cut — let the reader decide) |
| `Surprisingly,` | (cut — same) |
| `Frankly,` | (cut — what were you being before?) |
| `Honestly,` | (cut — same) |
| `Crucially,` | (cut — if it's crucial, write a stronger sentence) |
| `Ultimately,` | (cut — usually filler) |
| `Fundamentally,` | (cut) |

## Adverbs to keep (the 5% that earn their place)

Adverbs aren't outlawed. Some genuinely add information. Keep them when:

- **They specify when, where, or how-much that the verb can't carry.** *"She arrived early"* — the adverb is the whole point. *"He works remotely"* — categorical, not stylistic.
- **They preserve a deliberate cadence.** *"He walked slowly, then faster, then ran"* — the slow→faster contrast does work.
- **They are the joke.** *"She, very politely, told him to fuck off."* The collision is the point.
- **In dialogue.** Real people say "really" and "actually" and "basically." Strip them in narration; keep them in spoken lines.
- **In specifications.** *"The query runs roughly twice as fast"* — "roughly" carries epistemic weight.

If you can't articulate why an adverb earns its place, cut it.

## How to run the pass

### Pass 1 — Inventory
Scan the draft. For every word ending in `-ly` and every word in the empty-intensifier list, mark it. Count.

### Pass 2 — Categorize
For each one, decide:
- **Empty intensifier** → cut
- **Verb-implied** → rewrite the verb, drop the adverb
- **Earns its place** → keep, with a one-line reason

### Pass 3 — Rewrite
Apply the cuts.

### Pass 4 — Read aloud
Did the prose get tighter and stronger? If yes, ship. If something now reads flat, the adverb was doing real work — put it back.

## Output format

```
## Inventory
[N] adverbs / intensifiers found.

## Cuts
1. Line X: "the original sentence"
   → "the rewritten sentence"
   Removed: <word> (category: empty intensifier / verb-implied / sentence-starter)

2. ...

## Kept (with reason)
- "she arrived early" — the adverb is the point (specifies when)
- "the query runs roughly twice as fast" — epistemic hedge, earns its place

## Clean draft
[The full text with cuts applied]
```

## The litmus test

Take any sentence you're unsure about. Read it twice — once with the adverb, once without. If the version without sounds *worse*, keep the adverb. If it sounds the same or better, the adverb was padding. Cut.

## When NOT to run

- **Direct quotes from someone else** — preserve their words verbatim, even if they used "really" eight times
- **Dialogue in fiction or scene-writing** — adverbs are how people actually talk
- **Legal or technical specs where the adverb has precise meaning** ("approximately," "substantially," "materially" can have legal weight)
- **Poetry, song lyrics, or rhythm-driven prose** — sometimes a "softly" is doing musical work

## The Kramon rule

> *"Adverbs ending in -ly are often unnecessary in writing; cut them."*

The default is delete. The burden of proof is on the adverb to justify its existence.
