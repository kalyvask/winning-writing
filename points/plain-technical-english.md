# Plain technical English

Rules for the narrow case where being **unambiguous** matters more than being memorable: instructions, runbooks, incident and risk sections, and anything a non-native English speaker has to act on correctly the first time.

Inspired by the approach behind ASD-STE100 Simplified Technical English, the controlled-language standard the aerospace industry uses for maintenance documentation. The ideas below are restated for business writing with our own examples; none of that specification's text or its approved-word dictionary is reproduced here.

## Read this first — when NOT to use these rules

This file fights most of the rest of this repo, and it is supposed to. A controlled language optimizes for one reader outcome: no sentence can be understood two ways. It buys that by giving up range.

**Do not apply these rules to** cold emails, op-eds, pitches, bios, speeches, gratitude notes, or anything persuasive. There, a sentence that can only be read one way is usually a sentence nobody remembers. These rules will actively damage [vividness](../skills/vividness/SKILL.md), [fun-angle](../skills/fun-angle/SKILL.md), and [humanize](../skills/humanize/SKILL.md).

**Do apply them to:**

- Instructions and runbooks someone follows under time pressure
- The risk / mitigation section of an exec memo
- Incident write-ups and postmortems
- Anything going to a team where English is a second language for most readers
- API docs, migration guides, onboarding steps

The test for whether you are in scope: **would a misreading cost someone real time, money, or safety?** If yes, use these. If the worst case is "they don't find it interesting," you are in the other file.

## 1. One term per thing

Pick one name for each thing and never vary it. Elegant variation is a literary virtue and a technical defect.

If you call it "the pilot" in paragraph one, "the trial" in paragraph three, and "the beta" in the summary, a reader who knows the project reads three names for one thing. A reader who doesn't reads three things.

> **Don't:** We launched the pilot in March. The trial covered 200 accounts. Early beta numbers look strong.
> **Do:** We launched the pilot in March. The pilot covered 200 accounts. Early pilot numbers look strong.

The repetition will feel clumsy to you. It will feel clear to them. This is the single highest-value rule in this file, and the one writers resist most.

Corollary: **don't use one term for two things either.** If "customer" sometimes means the buyer and sometimes the end user, split the terms and say so once.

## 2. Kill phrasal verbs

A verb plus a preposition usually carries both a literal and a figurative meaning, and the reader has to guess which one you meant. Non-native readers guess wrong more often, and they guess wrong silently.

| Ambiguous | Use instead |
|---|---|
| back up (the data) | copy, archive |
| bring up (an issue) | raise, mention |
| carry out (a test) | perform, run |
| check out (the logs) | examine, review |
| cut off (access) | disconnect, revoke |
| give off (heat) | emit, release |
| hold off (the launch) | delay, postpone |
| put out (a release) | publish, ship |
| run into (a problem) | encounter |
| set up (the environment) | configure, create |
| take down (the service) | stop, disable |
| turn down (the request) | reject, decline |

One-word verbs are shorter, translate cleanly, and can't be read two ways. In persuasive writing the phrasal verb is often warmer — keep it there and drop it here.

## 3. Put the condition before the action

This is a deliberate **exception to BLUF**. Everywhere else in this repo the bottom line goes first. In an instruction, the constraint goes first — because the reader starts executing the moment they hit the verb, and a condition discovered afterward arrives too late.

> **Don't:** Restart the service if the queue depth exceeds 10,000.
> **Do:** If the queue depth exceeds 10,000, restart the service.

> **Don't:** Revoke the old key after the new key is confirmed live.
> **Do:** After the new key is confirmed live, revoke the old key.

Mark the boundary with a comma. Where the comma sits changes the meaning, so read it once more before shipping.

## 4. Warnings: command first, then the consequence

A risk note has two jobs, in this order: tell the reader what to do, then tell them what happens if they don't. Reversing it buries the instruction under the explanation.

> **Don't:** Because the migration script rewrites primary keys and any concurrent write will be silently dropped, you should stop the ingest workers first.
> **Do:** Stop the ingest workers before you run the migration. The script rewrites primary keys, and concurrent writes are dropped silently.

Naming the consequence is not optional. A reader who knows *why* a step matters follows it under pressure; a reader given a bare order improvises when the situation doesn't match the script.

## 5. One topic per paragraph, six sentences maximum

The [exec-memo format rules](exec-memo-rules.md) target roughly five sentences per paragraph on average. In this mode treat six as a hard ceiling, and add a second test: **every paragraph covers exactly one topic.**

If you can't write a header for a paragraph, it has more than one topic. Split it.

## 6. Set the sentence cap by text type

One global limit is the wrong tool. Different text types carry different loads:

| Text type | Cap | Why |
|---|---|---|
| Instructions, steps | 20 words | The reader is acting while reading |
| Descriptive, explanatory | 25 words | The reader is only reading |
| Warnings, risk notes | 20 words | Read under stress, often skimmed |

These are ceilings, not averages. A 30-word sentence in a runbook is a defect regardless of how well it reads.

## 7. Build up, don't dump

In an explanation, give one new idea per sentence and let each sentence depend on the one before it. A paragraph that introduces four concepts at once forces a re-read, and re-reads are where people quietly give up.

Say what the thing is, then what it does, then how it behaves in the case at hand — in that order. Use plain connectors (*and*, *but*, *then*, *as a result*) to signal whether what's coming is new, contrary, or consequent.

## The test

Hand it to someone who doesn't work on this and isn't a native English speaker. Ask them to tell you what to do, in order, without looking back at the document. Every place they hesitate is an ambiguity you can't see because you already know the answer.
