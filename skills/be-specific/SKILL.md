---
name: be-specific
description: Replaces generic nouns with concrete, specific ones. "Dog" becomes "German shepherd"; "engineer" becomes "John, the SRE on the payments team"; "company" becomes "Snowflake (12,000 employees, Bozeman HQ)." Implements Kramon's "specific over abstract" rule and Kristof's "real names, real numbers, real interviews" rule. Use when a draft is full of category nouns that the reader has to fill in themselves. Triggers on "be specific," "more concrete," "too abstract," "vague," "category nouns," "real examples."
---

# Be specific

Source: `points/core-rules.md` rule 2 (know your audience), `points/frameworks.md` (op-ed structure), Kristof's columns, Kramon's rule that **stories are 12× more memorable than statistics alone**.

## The premise

Generic nouns are the enemy of memorable writing. They make the reader do work the writer should have done.

> *"A scientist studied dogs."*

Forgettable. The reader pictures nothing.

> *"Dr. Chen at UC Davis studied 47 German shepherds at a sheep-herding farm in Petaluma."*

The reader can see it. Specificity earns attention. **It is the single highest-leverage rewrite a draft ever gets.**

## The rule

For every category noun in your draft, ask: *can I name a specific instance?*

| Generic | Specific |
|---|---|
| dog | German shepherd, Alma my golden retriever, the puppy at the rescue |
| engineer | John, the SRE on the payments team |
| customer | JPMorgan's options-trading desk |
| city | Bozeman (population 56,000, mountain west) |
| big company | Snowflake (12,000 employees, $3B revenue) |
| recent study | the 2024 Stanford HAI paper on agent reliability |
| many people | 47 of the 100 PMs I interviewed |
| a long time | 38 minutes |
| somewhere | the Excelsior Mill in 1989 |
| early | 2:47 a.m. last Wednesday |
| executives | the head of executive recruiting at Anthropic |
| consultant | a McKinsey BA who left to start a SaaS company |
| AI tool | Claude Sonnet 4.6 with the web_search tool |
| school | Stanford GSB's section H |
| job | director of products at a 20-person fintech in Austin |
| money | $64M in net savings |
| feedback | "this is good but the part about latency is wrong" |

## Six categories of specificity

Different drafts need different kinds. The skill fixes them in this priority order:

### 1. People
Replace "a customer," "the team," "a consultant" with **first names + roles + locations** wherever you have permission.

❌ *"A customer told us our latency was a problem."*
✅ *"Sarah at JPMorgan's options-trading desk told us in March: 'every 100ms costs us a million dollars in slippage.'"*

If you don't have permission to name them, use a *specific archetype* with a real-sounding detail: *"a senior options trader at a top-tier investment bank, 12 years in the seat."* The reader pictures someone real.

### 2. Numbers
Replace "many," "few," "most," "a lot," "significant" with **the actual number** or a tight range.

❌ *"We saw a significant drop in errors."*
✅ *"Errors dropped from 4,200/day to 380/day — a 91% reduction."*

If you don't know the number, get it before publishing. If you can't get it, name the closest measurable proxy.

### 3. Places
Replace "a city," "a country," "the office" with **named locations**. Specificity here is free — there's almost never a reason to omit a city name.

❌ *"At a tech company in California…"*
✅ *"At Anthropic's Embarcadero Center office…"*

### 4. Times
Replace "recently," "soon," "a while ago" with **dates and durations**.

❌ *"We launched the new pricing recently."*
✅ *"We launched the new pricing on March 14, 2026 — six weeks ago."*

❌ *"The brief took a long time to generate."*
✅ *"The brief took 38 minutes to generate."*

### 5. Things
Replace category nouns with **make/model/version/brand** wherever it sharpens.

❌ *"a robot," "a coding model," "a phone"*
✅ *"the Meccano MeccaNoid G15," "Claude Sonnet 4.6," "an iPhone 16 Pro"*

This is especially load-bearing in tech writing — *"an LLM"* is so generic it's almost meaningless in 2026.

### 6. Quotes vs. summaries
Replace "they said they liked it" with **the actual sentence they said**, in quotation marks.

❌ *"Customers love the new feature."*
✅ *"Priya at DoorDash, last Thursday: 'The brief is good, but it doesn't save us from the part that hurts.'"*

A summary in quotes is still a summary. Get the actual line.

## When NOT to be specific

There are three cases where the generic version wins:

1. **Privacy / NDA constraints.** When you can't name someone, don't fake it. Use a precise archetype.
2. **Universality is the point.** *"Most people who fall in love"* doesn't need a name — it needs to feel universal. Specificity here would shrink the claim.
3. **The specific would distract from the argument.** In a 200-word op-ed about gender stereotypes in toys, naming "the Meccano MeccaNoid G15" is fine. Naming "the Meccano MeccaNoid G15, MSRP $179.99, 482 reviews on Amazon, 4.2 stars average" is a distraction. Specificity is in service of the point, not a fetish.

## How to run the pass

### Pass 1 — Inventory
Read the draft. Underline every generic noun:
- People words: *user, customer, engineer, executive, founder, employee, candidate*
- Number words: *many, few, most, a lot, significant, several, multiple*
- Time words: *recently, soon, a while ago, in the past, in the future*
- Place words: *a city, a company, the office, a country*
- Thing words: *a tool, a model, an app, a system, a product*

### Pass 2 — Replace
For each, find the most specific replacement you can verify. If you don't know it, write `[lookup: …]` so the user knows what to fill in.

### Pass 3 — Cut the unspecific ones that don't matter
If a generic noun is doing real work (universality), keep it. If it's just throat-clearing, cut the sentence entirely. Don't replace one piece of vague text with a longer piece of vague text.

## Output format

```
## Inventory
[N] generic nouns found.

## Replacements
1. Line X: "the original sentence"
   → "the rewritten sentence with specifics"
   Replaced: <generic> → <specific>
   Verified from: <source — interview, podcast, your own knowledge, lookup needed>

2. ...

## Lookups needed (the user must verify before sending)
- [lookup: customer name in the JPMorgan story]
- [lookup: exact MAU number in March 2026]
- ...

## Clean draft
[The full text with replacements applied. Lookup placeholders preserved as [lookup: ...] so the user can see what's still missing.]
```

## The litmus test

After the rewrite, can the reader **picture** the scene?

- Do they see a specific dog, or a category dog?
- Do they see John at his desk, or "an engineer" floating in space?
- Do they hear Priya's voice, or a paraphrase?

If the answer is still "category" anywhere, run another pass.

## The Kramon rule

> *"Stories are 12× more memorable than statistics alone."* — combine both.

The most memorable writing has both: the named person, doing the specific thing, in the named place, with the actual number. Take any forgettable sentence in the draft and ask: *whose face is in the picture?* If nobody's, name someone.
