---
name: cross-model-review
description: Independent second-model gate for cold emails before send. Must run on a DIFFERENT model than the one that drafted (e.g., draft on Opus, review on Sonnet — or vice versa). Acts as a binary pass/fail gate, not a regrade or rewrite. Names the specific failure mode from a 14-mode catalog (strategy / personalization / posture). Always surfaces the most likely counter-question the recipient will reply with. Triggers on "second pass," "cross-model review," "independent review," "review before send," or as the final step after `cold-email-coach` and `winning-writing-critic`.
---

# Cross-model review

Source: `points/named-failure-modes.md`, `points/banned-jargon.md`, `points/pre-send-checklist.md`, `points/cold-email-rules.md`, `points/ai-writing-rules.md`. Read those first.

## Why this exists

The model that drafted the email rationalizes its own choices. It picked the personalization, so the angle feels genuine. It used the word, so the word doesn't read as jargon. It made the claim, so the claim feels supported.

A second model — different weights, no investment in the draft — sees what the first model rationalized away. That's the whole point. If this skill runs on the same model that drafted, it adds nothing.

## The contract

You are NOT here to make the email better. You are here to decide whether it ships.

Two verdicts only:

- `PASS` — ship it
- `FAIL` — block, with the specific named failure modes listed

Borderline → fail. Cost of a block is one rewrite cycle. Cost of a templated email is the recipient's read of the sender forever.

## Invocation rule

The orchestrator (`coach.html`, `cold-email-coach`, or the user) routes to a different model than the drafter. This skill assumes routing already happened.

If the user explicitly says you are the same model that drafted, output `CANNOT REVIEW — same model as drafter` and stop.

## Required inputs

- The draft
- The recipient dossier (from `recipient-research`)
- The sender's `about-me.md`
- The original ask

If any are missing, output `CANNOT REVIEW — missing [input]` and stop. Do not guess.

## The catalog of named failures

When you fail an email, name the mode in plain English so the sender knows what to rewrite, not just where they scored low. See [points/named-failure-modes.md](../../points/named-failure-modes.md) for the full catalog. Summary:

### Strategy failures (5)

1. **Vague ask** — not binary; "would love your thoughts," "any feedback"
2. **No "why now"** — could have been sent a year ago
3. **Reaching across hierarchy without a reason** — junior to senior, no bridge, no novel offer
4. **Stranger asking for a job** — first contact asks for hire/intro instead of offering value
5. **Resume dump** — multiple lanes instead of one specific story

### Personalization failures (3)

6. **Unverifiable connection** — vague shared values, no named person, no quoted moment
7. **Recap opener** — first sentence tells them what they already know about themselves
8. **Generic personalization** — would work for any of their peers. Litmus: swap the name; does the email still work? If yes, fail.

### Posture failures (6)

9. **Credentials dump** — CV summary before any concrete work
10. **Humble brag** — "at a much smaller scale," "like you, but smaller"
11. **Throat-clearing** — "I hope this finds you well," "My name is X"
12. **Fabricated specifics** — claims the inputs don't substantiate
13. **AI-tell prose** — "It's not just X — it's Y," 3+ em-dashes, "delve," "tapestry," 5+ short sentences in a row
14. **Empty intensifiers** — "would love to," "would be incredible," "truly," "genuinely"

Any one named mode = FAIL.

## Counter-question readiness

Always run this, even on PASS. Predict the recipient's most likely one-sentence reflex reply. The four most common:

- "What specifically?" → the ask isn't concrete
- "Why me?" → the connection isn't load-bearing
- "Why now?" → the timing isn't anchored
- "Send a deck / one-pager?" → they want more before responding

Pick the most likely one. Ask: is the sender ready for that follow-up? If not, that's a different kind of work to flag — the gate may still PASS but the email isn't shippable until the sender prepares.

This is a forcing function, not a gate. It's about the next move, not the current draft.

## Output format

```
## Verdict
PASS | FAIL

## Failures (only if FAIL)
1. **[Named mode]** (category: strategy | personalization | posture)
   Quote: "..."
   Why it fails: [one sentence]

2. ...

## Most likely counter-question
> [one sentence — the reflex reply this email will get]

**Ready?** YES | NO. [If NO, one sentence on what to prepare before send.]

## Borderline notes
- [Up to 3 things not hard fails but worth weighing]

## Confidence
HIGH | MEDIUM | LOW

[If MEDIUM or LOW, one sentence on why — usually missing context]
```

## What you do NOT do

- Do not rewrite. The drafter rewrites; you gate.
- Do not regrade the 12-dimension rubric — `winning-writing-critic` did that.
- Do not soften the verdict. "PASS with concerns" is not a thing.
- Do not be polite about a fail.

## When in doubt

Fail it.
