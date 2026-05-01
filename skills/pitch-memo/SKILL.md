---
name: pitch-memo
description: Drafts and critiques a text-first investor pitch memo for pre-seed and seed founders, structured around the 15 questions every investor asks. Use as an alternative or complement to a pitch deck — memos are faster to iterate, harder to hide weak thinking inside, and serve as the script for walking through a deck in a meeting. Triggers on "pitch memo," "investment memo," "fundraise memo," "memo for investors," "pitch document," "alternative to deck," "memo not deck."
---

# Pitch memo

Source: Josh Constine's *Fundraising & Pitch Deck Guide* — specifically his 15-question memo template — plus Kramon's BLUF rule, Konrad's "tell me a secret about the future," and the existing `pitch-coach` framework.

## Why a memo (not a deck)

For pre-seed and seed companies, a memo can outperform a deck:

- **No design wrangling.** No fiddling with slide layouts or hiring a designer.
- **Pretty design can hide weak thinking; a memo can't.** If the founder can't write the 15 answers cleanly, they're not ready to pitch.
- **It's the deck script.** Even if you eventually build a deck, the memo is the narrative spine — write it first, design slides to support it, not the other way around.
- **Decks leave investors with questions; memos answer them upfront.** Less follow-up email cycle.

A memo replaces a deck for: pre-seed, founders who think in text more than imagery, and any raise where you're competing on *substance* over *presentation*. A memo complements a deck for everyone else.

## The 15 questions (Constine)

Every investor asks the same 15 things. A memo that answers all of them in order is the most efficient possible pitch artifact.

### 1. Company name
Ideally, if you hear it you can spell it; if you read it you can pronounce it. You should be the top Google or App Store result for your name + a relevant keyword.

### 2. Tagline
One-line description. Plain English. No buzzwords. *"AI co-pilot for notaries."* / *"Forward-deployed engineers, but as software."* / *"Stripe for healthcare data."*

### 3. Problem
- What's wrong with the world?
- How acute is the pain?
- Who specifically has it? (A must-have for a small niche beats a nice-to-have for a wide market.)
- Show emotional resonance — your own first-customer story or a named person's story, not abstractions.

### 4. Solution
- Core functionality of the product
- How did you come up with it (origin story matters)
- How does it make a few people's lives a lot better, or a lot of people's lives a little better?
- One screenshot or a short demo video walking the most common use case
- Why is this *exponentially* better, not linearly better?

### 5. Big vision
- If you succeed, how does the world change?
- What's the path from beachhead → $10B company?
- Why is this your legacy?
- Why do you want to spend the next 10 years on this?

### 6. Team
- Specific roles + companies for each founder (not just logos)
- LinkedIn for each
- Why are you the best team in the world to tackle this?
- The "superhero origin story" — the personal arc that means you'll never quit
- Co-founder dynamic (this is what kills early-stage startups)
- Advisors only if they're high-quality — max 2 or 3, never lean on their credibility

### 7. Market size
- Serviceable Addressable Market — bottom-up, not vague TAM
- TAM only as a layer for adjacent products you'd launch later
- How fast is the market itself growing?
- How much are people spending on or losing because of the problem today?

### 8. Business model
- How do you earn money?
- Pricing model
- Margin
- What's your affordable customer acquisition strategy?

### 9. Go-to-market / customer
- Who specifically do you sell to (named segments, not "SMBs")?
- Demographic
- Channels — direct, partnerships, PLG, etc.
- Who on the team owns sales/growth?
- Marketing strategy
- How does the product grow itself?

### 10. Traction
- Current state — customers, users, revenue, growth rate
- Day-30 / Day-90 retention
- Dollar and logo retention
- Top customers + spend + room for expansion
- Pipeline
- Focus on the **north-star metric**, not vanity metrics

### 11. Competition
- Direct startups attacking the same problem
- Big incumbents who could move in
- Status quo / old-school way customers solve this today
- 2×2 matrix or differentiation checklist
- **The graveyard** — what have you learned from past failures in this space? (See `graveyard-historian` skill.)
- Why is this a winner-take-all or winner-take-most market?
- Your defensible moat / accruing advantage as you grow

### 12. Why now
- Tech, behavior, macroeconomic, or regulatory shifts unlocking this
- Why couldn't this have been built 5 years ago?
- What changed in the last 18 months that makes the timing work?

### 13. Raise history
- Total raised to date, round by round
- Lead investors, angels, valuations, SAFE vs. priced
- Most helpful people on the cap table
- Burn rate and runway

### 14. Raise
- How much you're raising
- SAFE or priced round
- Ballpark valuation cap (or no, if you'd rather investors price it)
- What you're looking for in your investors (operator help, recruiting, GTM, regulatory expertise, etc.)

### 15. What's next
- Hiring plan
- Key hires that complement founders' skillsets
- Specific milestones you'll hit before raising the next round
- Common targets: $200K ARR before seed, $1M before A, $9M before B, then doubling

## Writing rules — apply across all 15

These come from `points/` and apply to every section of the memo:

- **BLUF.** Each section opens with the conclusion, not the buildup.
- **Specific over abstract.** "47 of 100 PMs interviewed" beats "many people we talked to." Use `be-specific`.
- **Banned jargon.** No synergy/leverage/drive/strategize/empower/at the intersection of. Use `jargon-killer`.
- **No em-dashes in the deliverable.** Use commas, periods, colons. (See `em-dash-killer`.)
- **Show, don't tell.** Quote a customer with attribution, don't paraphrase. Cite a specific number, don't say "significant."
- **A "secret about the future"** belongs in the Why-Now section. (See `tell-them-something-new`.)
- **Address the strongest counterargument** in Competition, not a strawman.
- **Adverb hygiene.** No empty intensifiers ("very," "really," "actually"). Use `adverb-killer`.

## Length

A pre-seed memo is typically **800–1,500 words.** A seed memo can run 1,500–3,000. Anything beyond 3,000 means the founder is hiding something behind volume.

If you can't compress to 1,500 words at pre-seed, it's a thinking problem, not a length problem. Cut.

## Output format

When invoked from scratch:

```
# [Company name]: [Tagline]

[3-line opener: a "secret about the future" about the market, then the company name, then what you do. Lead with the insight, not the credentials.]

## Problem
...

## Solution
...

[continue through all 15 questions in order]

## Highlights (TL;DR for the impatient investor)
- [Single most important number]
- [Single most important customer or partnership]
- [Single most important "why-now" data point]

## Closing
[2-3 sentences: what you're raising, what kind of investor you want, the small specific ask.]
```

When invoked to critique an existing memo:

1. Score each of the 15 sections on (a) presence, (b) specificity, (c) BLUF
2. Flag the weakest 3 sections — those are where investors will dig
3. Rewrite the weakest one fully, leave the others as bulleted critiques
4. Identify any of the 15 that are *missing entirely* — most early-draft memos skip Competition's graveyard, the moat, or the Why-Now

## Common failure modes

- **Skipping the graveyard in Competition.** Investors love founders who name dead startups in the space and explain why each died. Most memos pretend nobody tried this before.
- **Vague "why now."** "AI is transforming everything" is not a why-now. A specific tech / regulatory / behavioral shift in the last 18 months is.
- **TAM theater.** Listing a $50B TAM with no SAM derivation is a tell. Bottom-up beats top-down.
- **Vanity metrics.** Total downloads, total signups, total impressions. Replace with retention or revenue.
- **No superhero origin story.** Investors back people, not just markets. The team section without a founder arc is dead.
- **Trying to do too much at once.** A memo that lists 4 product lines reads as unfocused. Pick the wedge; show the roadmap.

## Companion skills

- `pitch-coach` — covers the spoken pitch and the deck. Use both: memo first, then deck.
- `graveyard-historian` — feeds the Competition section's graveyard
- `warm-intro-finder` — produces the forwardable blurb that gets the memo in the right inbox
- `winning-writing-critic` — final rubric pass before sending

## The Constine litmus test

> *"It's very difficult to hide [weak thinking] in a memo."*

Read your memo cold a week later. If you can't defend a claim in 30 seconds without checking your notes, the claim is decoration. Cut it or get the data to back it.
