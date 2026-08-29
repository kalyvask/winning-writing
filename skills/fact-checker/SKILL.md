---
name: fact-checker
description: Verifies every checkable claim in a draft before it goes out — numbers, names, titles, dates, quotes, company facts, and citations. Separates what was verified from what could not be checked from what is wrong, and never lets an unverifiable claim pass as verified. Use before sending anything with a number or a named person in it: cold emails, exec memos, op-eds, bios, LinkedIn posts, PRDs, launch docs, press responses. Triggers on "fact-check this," "verify these numbers," "did I make this up," "check my claims," "is this accurate," or as the final gate after any drafting skill.
---

# Fact checker

Source: `points/ai-writing-rules.md` (section 2, Accuracy), `points/exec-memo-rules.md` (rules 4 and 7, on numbers and citation), `points/named-failure-modes.md`.

## Why this exists

Every other skill in this repo makes the writing better. This one keeps it true. Those are different jobs and the second one is worth more, because style problems cost you a reader and accuracy problems cost you the relationship.

One invented number, one misattributed quote, one wrong job title — and every other number in the document becomes suspect. Credibility is a budget you spend once.

The two failure modes this catches:

- **The model made it up.** LLMs fabricate confidently: invented statistics, plausible-sounding quotes attributed to real people, dates that fit the narrative. Fluency is not evidence.
- **You knew it once and it changed.** Headcounts, funding rounds, job titles, pricing, product names. True in March, wrong in August. Stale facts read exactly like fabricated ones to the person who knows.

## What counts as a checkable claim

Extract **every** instance of:

| Type | Examples |
|---|---|
| Numbers | percentages, dollar amounts, headcounts, dates, durations, rankings, sample sizes |
| Named people | spelling, current employer, current title, pronouns if stated |
| Organizations | company name spelling, what they actually do, funding, ownership |
| Quotes | exact wording, who said it, where, when |
| Citations | does the linked source exist, and does it say what you claim |
| Superlatives | "first," "only," "largest," "fastest" — these are factual claims, not adjectives |
| Implied claims | "since we launched" (did you?), "our fastest-growing segment" (is it?) |

Superlatives and implied claims are the ones writers forget are checkable. Treat them as claims.

## Procedure

1. **Extract.** List every checkable claim as a separate row before verifying anything. Quote the exact span from the draft. Do not paraphrase — the wording is what ships.
2. **Classify the source of each claim.** One of: user-supplied, model-generated, or inherited from an earlier draft. **Model-generated claims get the harshest scrutiny** — that is where fabrication lives.
3. **Verify.** Use web search for anything public. For internal claims (your own metrics), you cannot verify — say so, and ask the user for the source.
4. **Report** in the table below.
5. **Rewrite the failures.** For every ✗ and every ?, propose the specific replacement line.

## The output table

Always return this. One row per claim, most severe first.

| Claim (quoted) | Type | Status | What's actually true | Fix |
|---|---|---|---|---|
| "raised $40M Series B" | number | ✗ wrong | $28M Series B, Mar 2026 | "raised a $28M Series B" |
| "our fastest-growing segment" | implied | ? unverifiable | internal metric — no public source | ask user for the query, or cut |
| "VP of Engineering" | title | ✓ verified | current per company site | — |

Status values, and they are not interchangeable:

- **✓ verified** — you found an independent source that confirms it. Name the source.
- **? unverifiable** — you could not confirm it. **This is not a pass.** It means the user must confirm it or cut it.
- **✗ wrong** — you found a source that contradicts it. Give the correct value.
- **⚠ stale-risk** — confirmed, but from a source old enough that it may have changed (funding, headcount, titles). Flag the date of your source.

## Hard rules

- **Never upgrade ? to ✓ because the claim seems plausible.** Plausibility is exactly what fabrication optimizes for.
- **Never let a quote pass without locating it.** If you cannot find the exact wording, the quote is either misremembered or invented. Both are fatal. Paraphrase and drop the quotation marks, or cut it.
- **A number with no provenance is a liability even when correct.** Per `exec-memo-rules.md`, cite at the point of use.
- **If the user supplied the number, say so and stop.** You are not calling the user a liar; you are marking which claims rest on their authority rather than a source. That distinction is the whole product.
- **Do not silently fix.** Show what was wrong. The user needs to know their draft had an error, not just receive a clean version — otherwise they learn nothing and repeat it.
- **Round-number tell:** claims like "10x," "50%," "3x faster" that are suspiciously clean deserve extra scrutiny. Real measurements are rarely round.

## When you finish

Hand back:

1. **The table**, most severe first.
2. **A one-line verdict**: *"Safe to send"* only if there are zero ✗ and zero ?. Otherwise *"N claims need your confirmation before this goes out."*
3. **The rewritten lines** for every ✗ and ?.
4. **The single riskiest claim** — the one that would cost the most if wrong, even if you verified it. Name it so the user reads that line one more time.

## Composes with

- `cross-model-review` — run fact-checker **first**. A cross-model gate that passes a fabricated statistic has passed a broken email.
- `winning-writing-critic` — style grading; independent of truth.
- `recipient-research` — supplies the dossier this skill verifies claims against.
- `humanize` — must run **before** this one. Never humanize after fact-checking; the rewrite can reintroduce an unverified specific.

## The test

For every number and name in the draft, could you name where it came from, out loud, if the recipient asked? If not, it is not ready — however good it sounds.
