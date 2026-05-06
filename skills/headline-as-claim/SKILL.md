---
name: headline-as-claim
description: Rewrites section titles, slide titles, op-ed headlines, email subject lines, and chapter headings from category labels into bold arguable claims. Implements Constine's "punchy slide titles that tell the story" rule and Kingsbury's NYT Opinion guidance that headlines should make a bold claim, not a neutral description. Use when the user has titles like "Product," "Market," "Background," "Why this matters" — labels that waste the reader's eye. Triggers on "slide titles," "section headings," "op-ed headline," "subject line," "chapter title," "punchy title," "scannable."
---

# Headline as claim

Source: Josh Constine's *Fundraising Guide* ("punchy slide titles that tell the story of each slide, not just 'Product' or 'Market'") + Katie Kingsbury / NYT Opinion's headline rules + the existing `op-ed-coach` headline guidance.

## The premise

Most documents are built on category labels:

> *"Product" / "Market" / "Team" / "Why Now" / "Background" / "Conclusion"*

These titles waste eye-time. The reader sees "Market" and learns nothing — they have to read the section to find out what the market claim is. A *claim* title, by contrast, IS the section if scanned.

> *"Our AI cuts notarization time 85%"* (Constine example)
> *"Olympians earn the IOC billions. Guess who the IOC almost never pays."* (Kristof headline)
> *"$14B in U.S. recall costs come from connector-seating failures."*

A document with claim-titles is **scannable**. A reader who reads only the titles still gets the argument. A reader who reads the body gets the evidence. Both are served.

## Where this applies

- **Pitch deck slide titles** (Constine's original case)
- **Pitch memo section headings**
- **Op-ed headlines** (NYT Opinion bar)
- **Substack post titles** (decides clickthrough)
- **Email subject lines** (decides open rate)
- **Memo section headings** (decides whether the boss reads past page 1)
- **Chapter titles** in long-form
- **Performance-review section headings**

The same rule everywhere: **a title earns its place by making a claim, not by labeling a category.**

## The four types of bad titles

### 1. Pure category labels
*"Product." "Market." "Background." "About Us."*
The reader's brain registers "section coming" and moves on. Wasted real estate.

### 2. Generic descriptions
*"How AI is transforming education." "Some thoughts on Olympic compensation." "An overview of our Q3."*
Better than labels, still forgettable. No specific claim, nothing arguable.

### 3. Question titles
*"Is AI overhyped?" / "What's wrong with healthcare?"*
Sometimes works, more often dodges. A question lets the writer avoid committing. Replace with the answer.

### 4. Hedge titles
*"Some considerations on…" "A look at…" "Thoughts on…"*
Throat-clearing. Hedge titles are a signal the writer wasn't ready to make a claim yet.

## What earns its place

A claim title has three properties:

1. **It's specific.** Names a number, a person, a place, an outcome.
2. **It's arguable.** Someone could disagree. *"AI is here"* is not arguable. *"The first AI agent in your company will be a junior analyst, not a senior one"* is.
3. **The reader can predict the section's content from the title alone.** If the title says "Sierra agents replace 47% of customer-service tickets at Nordstrom in 4 weeks" — the reader knows what's coming and can decide whether to dig in.

## Rewrite patterns

### Decks and memos

| ❌ Label | ✅ Claim |
|---|---|
| Product | Our AI cuts notarization time by 85% |
| Market | $14B in U.S. recall costs come from connector failures |
| Why Now | The Transformer paper finally made eval pipelines feasible in 2024 |
| Team | Three of us shipped the first eval pipeline for the agent stack at `[prior company]` |
| Competition | Three companies tried this 2018–2022. All died of the same thing: they trained on synthetic data. |
| Traction | 500 signups per week, 70% from outdated incumbents |
| Raise | $1.5M SAFE, lead in from Tier-1 fund |

### Op-eds

| ❌ Description | ✅ Claim |
|---|---|
| Some thoughts on AI in education | AI tutors are widening the gap they were supposed to close |
| The state of options trading | Option trading is rigged against average investors |
| Olympic compensation today | Olympians earn the IOC billions. Guess who the IOC almost never pays. |
| On gender stereotypes in toys | Why women should coach boys' sports |

### Email subject lines

| ❌ Generic | ✅ Personal claim |
|---|---|
| Hoping to connect | Bush pilot turned GSB student |
| Quick question about Sierra | The trust-calibration gap you named — I have 100 interviews on why it keeps breaking |
| Coffee chat? | I'm wearing that hideous bracelet you gave me in 2011 |
| Re: your podcast appearance | From a fellow GSB |

### Memo sections (internal)

| ❌ Label | ✅ Claim |
|---|---|
| Q3 Update | Q3 forecast: cutting by 50%, recommend you call the board |
| Hiring Plan | We need to triple the platform team by April or we miss the renewal window |
| Project Status | Authentication migration is done. The session bug isn't. |

## How to run the pass

### Pass 1 — Inventory
Scan the document. Mark every heading, slide title, subject line, and section break. Mark each one:
- **L** = label (pure category)
- **D** = generic description
- **Q** = question
- **H** = hedge
- **C** = claim (passes)

Anything that isn't C needs a rewrite.

### Pass 2 — Find the claim hidden in the body
For each non-C heading, read the section it titles. The claim title almost always exists in the section's body — usually in paragraph 1 or 2. Promote it to the title. The body is then evidence for the title's claim.

### Pass 3 — If no claim exists in the body
The section was making no argument. Either kill the section or write the missing claim — that's a deeper edit and a signal the document needs more work than just retitling.

### Pass 4 — Read the claim-titles in sequence
Read only the titles, in order. Do they form a coherent argument? If a reader scanned only the titles, would they walk away with your thesis?

If yes, ship. If no, the titles work individually but don't compose — re-order or rewrite for narrative flow.

## Output format

```
## Inventory
[N] headings found.
- L (labels): [count]
- D (descriptions): [count]
- Q (questions): [count]
- H (hedges): [count]
- C (claims): [count]

## Rewrites
| Section | Before | After | Source of the claim |
|---|---|---|---|
| Slide 4 | "Market" | "$14B in recall costs from connector failures" | The body's TAM paragraph |
| Slide 7 | "Team" | "Three of us shipped `[prior company's]` first eval pipeline" | The bio bullets |

## Title-only readthrough
The new titles in sequence:
1. ...
2. ...
3. ...
[End with: does this read as a coherent argument? Y/N + 1 sentence why.]

## Sections where no claim exists
[List sections where the body has no argument the title could capture. These are deeper edits.]
```

## When NOT to rewrite

- **Genre conventions where labels are required.** Legal contracts, regulatory filings, standardized academic-journal sections (Methods, Results, Discussion). Don't make "Methods" claim-shaped.
- **Reference documentation** where users navigate by category, not argument. *"Authentication"* should stay *"Authentication."*
- **Boilerplate sections in standard formats** that readers expect to find by name (Privacy Policy, Terms of Service).

## The Kingsbury rule

NYT Opinion's headline editors reject neutral descriptions. The bar is *"a bold, arguable claim that makes the reader want to argue back."*

The litmus test:

> *"After reading the title alone, would the reader nod, disagree, or want to know more?"*

If they'd shrug, the title is a label. Rewrite.
