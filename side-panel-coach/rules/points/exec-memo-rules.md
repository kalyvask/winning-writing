# Exec memo rules

A memo that goes up the chain: a decision to be made, a status to track, a recommendation to defend. The reader has 60 seconds. Maybe 90 if you're lucky. Their question is "what do I need to do, and how confident should I be?" — not "tell me what you know."

## Philosophy

An exec memo is a **decision artifact**, not an essay. The TL;DR is the product. Everything below it justifies the TL;DR; nothing below it introduces new asks.

If the reader stops after the first line, they should still have the headline. If they stop after the first paragraph, they should know what you want them to do.

## The 8 rules

### 1. Lead with the ask or the headline conclusion
First line is the bottom line. Not "Background:", not "Over the past quarter we've been exploring...", not "I'd like to share some thoughts on..."

Good first lines:
- "Recommend we kill X and reallocate the team to Y by end of Q3."
- "Pricing test ran 6 weeks, +12% conversion at p<0.01. Ready to roll out."
- "We are 2 weeks behind on Project Z because of a vendor outage. Mitigation: option B below."

Bad first lines:
- "I wanted to share some thoughts on..."
- "As you may know..."
- "Over the past several months..."

### 2. TL;DR is its own paragraph and answers four questions
- What do I want? (decision, approval, info)
- Why now?
- What's the recommendation?
- What's the risk if we do nothing?

Three to five sentences. If the TL;DR is longer than the rest of the memo, the memo is wrong.

### 3. One memo, one ask
If you have two asks, write two memos. Bundling them buries the second one and dilutes the first.

### 4. Number every claim you can
"Better" → "12% better on conversion, n=18,000."
"Faster" → "Median p95 dropped from 1.2s to 480ms."
"Most users" → "67% of users, n=240 in cohort."
"We learned a lot" → cut the sentence; show the learning.

If a number isn't available, name what would resolve the question: "Will run a 2-week test with 5% traffic; success bar 8% lift at p<0.05."

### 5. Name the decision criterion
Before listing options, name the criterion you're optimizing for. Not "we considered three options" but "we picked the option that maximizes Q4 paid conversion within the existing eng headcount."

Without a named criterion, the options read as a debate, not a recommendation.

### 6. Show the failure mode
For the recommended path, state how it could fail and what would tell you it's failing early. Reviewers cannot trust a recommendation that doesn't acknowledge what could go wrong.

"This is wrong if X. We'll know by [signal] within [timeframe]."

### 7. Cite once, prominently
Link to the source of every load-bearing claim — research deck, query, doc — at the point of use. Not a "References" section at the end. Reviewers can't trust a number whose provenance is two clicks away.

### 8. End with the ask repeated
The last line is the ask, stated explicitly with what you need from the reader. "Please approve by Friday so the team can start sprint planning Monday."

## What never goes in an exec memo

- Background that the reader already has. If the reader doesn't have it, link to a doc.
- "We considered many approaches" without naming them and the criterion.
- Recommendations without owners and dates.
- Adjectives doing the work of evidence ("significant," "compelling," "substantial," "robust," "comprehensive"). Cut them or name the number.
- Caveat hedges ("it's worth noting that," "interestingly," "of course"). They invert the load-bearing claim.
- A "next steps" section that's actually a wish list. Owners + dates + checkpoints, or it's not a next step.

## Anti-patterns

### The buried lede
TL;DR is missing or it's three paragraphs of context before the recommendation. Reader bails before the ask.

### The hedge stack
Every claim wrapped in "could," "may," "potentially," "we believe." The reader can't tell what you're actually claiming.

### The everything-bagel memo
Status update + decision request + brainstorm + recap. Pick one. Send three separate memos if you need to.

### The lab notebook
Walks the reader through your reasoning chronologically. Reviewers don't care how you got there; they care where you landed and how confident you are.

### The fake options table
Three "options" where two are straw men and you've already picked the third. Reviewers see through this and lose trust.

### The unsourced number
"Conversion went up 12%." From what to what? Over what window? Compared to which baseline? On which surface? Numbers without provenance read as fabricated even when they aren't.

### The trailing ask
"Thanks for considering!" instead of "Please approve by Friday so we can start Monday." The reader doesn't know what to do with the document.

## Format mechanics

From Burt Alper and Allison Kluger's "Memo on Memos" (Strategic Communication, GSBGEN 315/515, Stanford GSB) — the layout rules that make a memo skimmable. Content is king, but format decides whether the content gets read:

- **Three-act structure.** Intro, sectioned body, conclusion. The reader should be able to reconstruct the argument from the section headers alone.
- **Informative headers, not labels.** "Recommendation: kill X, reallocate to Y" helps a skimmer; "Recommendation" merely labels. Every header should carry information.
- **Left justification only.** Full justification stretches and scrunches words; business readers expect a ragged right edge.
- **Bullets for lists of three or more short phrases; numbers when order matters** (process steps, priority). Never bullet full paragraphs — a bulleted paragraph loses the set-off effect that makes lists scannable.
- **Readability targets: ~5 sentences per paragraph, ~17 words per sentence,** on average. Not a ceiling per sentence — an average that forces variance.
- **Every recommendation starts with a specific verb.** "Approve the Q3 budget," "Assign two engineers," "Kill the pilot" — a recipe the reader can execute. A recommendation that starts with "It would be beneficial to consider..." is not a recommendation.
- **Verb vividness is the passive-voice detector.** Count your is/are/was/were constructions; too many means you're writing passively. Swap in verbs that name the action.

## Structure cheat sheet

```
# [Title that names the decision, not the topic]

**TL;DR (3-5 sentences):** what / why now / recommendation / risk if no action

## Background
2-3 sentences. Link out for context.

## Recommendation
The named criterion. The option. Why it wins on the criterion.

## Options considered
- Option A (rejected because [criterion])
- Option B (rejected because [criterion])
- Option C — RECOMMENDED

## Risks and the early-failure signal
What could go wrong. What signal would tell us we're wrong, by when.

## Ask
What you need from the reader, by when.
```

## The 60-second test

Hand the memo to someone who's not in the project. Time them. If at 60 seconds they can't tell you (a) what you want them to do, (b) why now, and (c) the biggest risk, the memo is wrong. Rewrite the TL;DR until they can.
