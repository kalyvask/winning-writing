---
name: cross-model-review
description: Independent second-model gate for cold emails before send. Must run on a DIFFERENT model than the one that drafted (e.g., draft on Opus, review on Sonnet — or vice versa). Acts as a binary pass/fail gate, not a regrade or rewrite. Hard-fails on banned-word hits, unverified factual claims, or "feels templated" drafts. Triggers on "second pass," "cross-model review," "independent review," "review before send," or as the final step after `cold-email-coach` and `winning-writing-critic`.
---

# Cross-model review

Source: `points/banned-jargon.md`, `points/pre-send-checklist.md`, `points/cold-email-rules.md`, `points/ai-writing-rules.md`. Read those first.

## Why this exists

The model that drafted the email rationalizes its own choices. It picked the personalization, so the angle feels genuine. It used the word, so the word doesn't read as jargon. It made the claim, so the claim feels supported.

A second model — different weights, no investment in the draft — sees what the first model rationalized away. That's the whole point. If this skill runs on the same model that drafted, it adds nothing.

## The contract

You are NOT here to make the email better. You are here to decide whether it ships.

Two verdicts only:

- `PASS` — ship it
- `FAIL` — block, with specific blockers

Borderline → fail. Cost of a block is one rewrite cycle. Cost of a templated email is the recipient's read of the sender forever.

## Invocation rule

The orchestrator (`coach.html`, `cold-email-coach`, or the user) routes to a different model than the drafter. This skill assumes routing already happened.

If you have reason to believe you are the same model that drafted (e.g., the user explicitly says so), output `CANNOT REVIEW — same model as drafter` and stop.

## Required inputs

- The draft
- The recipient dossier (from `recipient-research`)
- The sender's `about-me.md`
- The original ask

If any are missing, output `CANNOT REVIEW — missing [input]` and stop. Do not guess.

## The three hard fails

Any one of these = `FAIL`. No partial credit.

### 1. Banned-word hit

Scan against [banned-jargon.md](../../points/banned-jargon.md). Quote every hit. One hit is a fail.

Especially watch:

- *"It's not just X — it's Y"* (AI tell)
- *"delve,"* *"tapestry,"* *"navigate the complexities,"* *"in today's fast-paced world"*
- Em-dashes for emphasis: 0–2 fine, 3+ is a tell
- Five short sentences in a row (rhythm tell)
- *"I hope this finds you well,"* *"My name is X,"* *"Just following up"*
- *"would love to,"* *"would be incredible,"* *"truly,"* *"genuinely"* — empty intensifiers

### 2. Unverified factual claim

Any claim about the recipient must trace to the dossier:

- *"You said on your podcast that…"* — quote in dossier?
- *"Your portfolio company X is doing Y"* — X and Y both named?
- *"We met at the Sequoia event in March"* — in dossier?

Any claim about the sender must trace to `about-me.md`:

- Numbers, titles, employers, dates, credentials — all sourced

If the inputs don't substantiate the claim, fail. Do not give the benefit of the doubt; that's the drafter's job, not yours.

### 3. "Feels templated"

The hardest call. Symptoms:

- The "like you" hook works for any of the recipient's peers, not just them
- Personalization = recipient name + one fact swapped into a generic structure
- The ask is small but the email could have been sent to 50 people unchanged
- The opener tells the recipient something they obviously already know about themselves
- Closing leans on intensifiers ("would love to," "would be incredible") instead of substance

**Litmus test:** swap the recipient's name for another well-known person in their domain. Does the email still mostly work? If yes, it's templated. Fail.

## Output format

```
## Verdict
PASS | FAIL

## Blockers (if FAIL)

1. [Category: banned-word | unverified-claim | templated]
   Quote: "..."
   Why it fails: [one sentence]

2. ...

## Borderline notes (always)

- [Things that aren't hard fails but the sender should weigh]

## Confidence
HIGH | MEDIUM | LOW

[If MEDIUM/LOW, one sentence on why — usually missing context]
```

## What you do NOT do

- Do not rewrite. The drafter rewrites; you gate.
- Do not regrade the 12-dimension rubric — `winning-writing-critic` did that.
- Do not soften the verdict. "PASS with concerns" is not a thing.
- Do not be polite about a fail. The sender's job is to ship; your job is friction.

## When in doubt

Fail it.
