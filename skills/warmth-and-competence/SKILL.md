---
name: warmth-and-competence
description: Audits a draft on Susan Fiske's two-axis model of social judgment — warmth (do I like and trust this person?) and competence (do I respect this person?) — and rewrites the lines that signal the wrong thing on either axis. Implements Kramon's hardest rule: "show competence AND warmth in a single sentence." Use when a draft reads cold-but-impressive (high competence, low warmth — the "consultant trap"), warm-but-unserious (high warmth, low competence — the "intern trap"), or flat on both. Triggers on "warmth," "competence," "too cold," "too eager," "not serious enough," "I sound like a consultant," "I sound like an intern," "first impression."
---

# Warmth and competence

Source: `points/core-rules.md` rule 15 ("show competence AND warmth in a single sentence" — Kramon's hardest rule). Grounded in Susan Fiske's stereotype-content model from Princeton — humans evaluate every new face on two axes: warmth (intent — friend or foe?) and competence (capability — can they actually do it?).

## The premise

Cold writing reads as cold-but-impressive. Eager writing reads as warm-but-unserious. The hardest move in business writing is to score high on both axes in the same sentence — a sentence that proves you're capable AND that the recipient is going to like working with you.

The two failure modes are equally bad and unequally visible:

- **The consultant trap (high competence, low warmth):** you sound like the smartest person in the meeting, but the recipient instinctively doesn't want you on their team. Common in MBA-trained writers, ex-management-consultants, finance veterans.

- **The intern trap (high warmth, low competence):** you sound thoughtful and friendly, but the recipient instinctively doesn't trust you to ship. Common in early-career writers, recent grads, anyone overcorrecting from the consultant trap.

The recipient registers the verdict in roughly one second. The writer never recovers in the same email.

## What signals each axis

### Warmth signals (do I want to work with this person?)

**Up:**
- Specific shared experiences ("I grew up in your hometown, too" — Konrad's "like you" rule, with a real shared detail)
- Honest self-assessment ("I'm three weeks into this and still figuring it out")
- A genuine moment of humor or vulnerability
- Acknowledging the recipient's time, not just their status
- "I'd love to hear what you think" (when genuine)
- Crediting others for things you didn't do alone
- A specific concrete detail only a real person would include
- Door-open-for-no in the ask ("I know it's a big ask, no is a perfectly fine answer")

**Down:**
- Pure transactional language ("seeking 30 minutes for X")
- Obvious flattery ("your work has been transformational")
- "Hope to leverage your network" — language that's clearly extractive
- Robotic structure ("Background: …; Ask: …; Next steps: …")
- No first-person voice — passive, third-person, or pluralized "we" when you mean "I"
- Talking about yourself non-stop with no curiosity about the recipient
- "I appreciate your time" — performative, every cold email says it

### Competence signals (do I trust this person to ship?)

**Up:**
- Specific numbers tied to specific outcomes ("$X million saved on the Y program at Z"; not "drove significant value")
- Named, real scenes ("at 2:47 a.m. last Wednesday…")
- Articulating a thesis the recipient hasn't heard
- Identifying the strongest counterargument to your own position and addressing it
- Naming the graveyard — companies that tried this before and died
- Signaling you read their primary source, not the secondary
- Showing measurement discipline ("we tracked X, Y didn't move, here's why")
- Quoting yourself in past judgment calls that turned out right
- A short list of concrete things you can do for them

**Down:**
- Buzzwords (synergy, leverage, drive, strategize, empower)
- "I'm passionate about complex problems"
- Vague claims with no specifics ("led significant initiatives")
- Adverb pile-up ("I really, definitely, fundamentally believe…")
- Self-praise without evidence
- Hedging the conclusion ("I think we might possibly be able to…")
- Citing sources without engaging with them ("As Dr. X has noted, …")
- Long preambles before the substance — "organ music" in Kramon's term
- Asking for things you should have figured out yourself

## The Kramon test

The single highest-leverage move in cold writing is finding ONE sentence that proves both axes simultaneously. Kramon: *"Show competence AND warmth in a single sentence."*

Examples that pass:

> ✅ *"I built our team's first eval pipeline for the agent product, and I'm not sure I would have if `[someone on the recipient's team]` hadn't told me at last year's conference that evals were the unsexy problem nobody was solving."*

This sentence:
- **Competence:** specific shipped work
- **Warmth:** credits a specific person, references a real conversation, admits the writer wouldn't have figured it out alone

Another:

> ✅ *"At 2:47 a.m. last Wednesday our incident bot diagnosed an outage in 90 seconds. The on-call then spent 38 minutes clicking through tools to run the rollback, which is approximately 38 minutes of my evening I'd like to get back."*

- **Competence:** specific time, specific scene, real number
- **Warmth:** dry humor, self-aware aside, doesn't take itself too seriously

Examples that fail:

> ❌ *"I'm an MBA passionate about leveraging AI to drive impact at the intersection of strategy and execution."*

- Low warmth: zero specificity, no real person visible
- Low competence: every banned word in one sentence

> ❌ *"Hi! Hope you're doing well! I LOVE your work and would absolutely love to chat about how I might fit into your team."*

- High warmth attempt: but it reads as performance, not genuine warmth
- Low competence: no proof of anything, no thesis, all enthusiasm

## How to run the pass

### Pass 1 — Score each paragraph
Read each paragraph and rate 1–5 on each axis:

| Paragraph | Warmth | Competence | Verdict |
|---|---|---|---|
| 1 | 2 | 4 | Cold-but-impressive — needs one warmth move |
| 2 | 4 | 2 | Warm-but-unserious — needs a specific number or scene |
| 3 | 3 | 3 | Flat — find the one sentence that combines both |

### Pass 2 — Find the candidate sentence
Look for any sentence that *almost* combines both axes. Often one already exists buried in the middle of the draft — the writer just didn't recognize it as the load-bearing line.

If no candidate exists, build one from material in the draft:
- Take the strongest competence sentence (a specific number or scene)
- Add a warmth move to it (named person, dry aside, credit to someone, honest qualifier)

### Pass 3 — Promote the load-bearing sentence
The combined sentence should land in the first or second paragraph of the email. It's the sentence the recipient is allowed to take away if they read nothing else.

### Pass 4 — Audit the rest for axis-misses
Find any line that signals the wrong thing:
- A line that's pure brag → soften with a credit or a qualifier
- A line that's pure flattery → cut it or replace with a specific reaction to their actual work
- A line that hedges the substance → commit; the warmth comes from honesty, not from softening

## Common rewrites

| ❌ Pure competence, no warmth | ✅ Both |
|---|---|
| "I led a $X million ML project at `[company]`." | "I led that ML team at `[company]`. The win was $X million; the lesson was that the model was the easy part." |
| "I have seven years of AI product experience." | "Seven years building AI products has taught me that most of them die in the trust-transfer step, not the model step." |

| ❌ Pure warmth, no competence | ✅ Both |
|---|---|
| "I'd love to learn from you about agent UX!" | "Your trust-calibration framing on `[their podcast]` matched what I saw shipping evals at `[my last company]`, I'd love to compare notes." |
| "I'm so passionate about this space." | "I've spent the last year writing about a gap I keep seeing (only 14% of practitioners hit measurable impact in <1 month), I think `[their company's]` GTM walks straight into it." |

## Output format

```
## Warmth-and-competence audit

| Paragraph | Warmth (1-5) | Competence (1-5) | Verdict |
|---|---|---|---|
| 1 | X | X | <flat / cold / eager / both axes high> |

## The load-bearing sentence
The single sentence that combines both axes:
"<the sentence>"

If one exists in the draft, quote it. If you built it from material, show the source lines.

## Lines flagged
- Line N: "<original>"
  Issue: <pure brag / pure flattery / hedged substance / etc.>
  Rewrite: "<the fix>"

## Clean draft
[full email with audits applied]

## What changed (3 bullets)
- <specific move>
- <specific move>
- <specific move>
```

## When NOT to run

- **Gratitude notes.** Warmth IS the deliverable; competence isn't the point.
- **Legal correspondence.** Pure competence is correct. Warmth is a distraction.
- **Internal Slack messages with peers** — over-engineering ruins them.

## The litmus test

Read the draft as if you were the recipient. Within the first 50 words, do you have a clear answer to BOTH questions:

1. *Do I trust this person to ship?* (competence)
2. *Do I want to work with this person?* (warmth)

If "yes" to both, the draft passes. If you can answer one but not the other, the draft is leaning too far on one axis. Find the sentence that fixes it and promote it forward.

## The Bryant rule

Adam Bryant called the target zone *"desirable confidence"* — high competence, calibrated warmth, no self-deprecation that begs for sympathy and no boasting that seeks applause. The center of the matrix is the goal.
