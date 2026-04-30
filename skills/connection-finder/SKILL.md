---
name: connection-finder
description: Finds specific, genuine "like you" hooks between the writer and a cold-outreach target — the bridges that turn a generic email into one that feels hand-written. Takes the recipient dossier and the writer's profile (about-me.md) and surfaces ranked angles. Use after recipient-research is done, before drafting. Triggers on "like you," "find a connection," "what do we have in common," "common ground."
---

# Connection finder

Source: `points/cold-email-rules.md` rule 5 — *"Compare yourself to the recipient — the 'like you' move."*

## Why this exists

Rachel Konrad's rule 5 is the most-failed rule in the playbook. Most "like you" lines are either:

- **Generic** — *"Like you, I believe AI will transform the future."* (Everyone believes that. Cut.)
- **Self-diminishing** — *"Like you, but at a vastly smaller scale."* (They already know that. Cut.)
- **Boastful** — *"Like you, I'm super smart and super successful."* (Backfires. Cut.)

What works: **specific, genuine, slightly unexpected.** *"Like you, I grew up eating Korean food lovingly prepared by a single mom."* That sentence cannot be sent to anyone else. That's the whole point.

## What you need

This skill takes two inputs:

1. **Recipient dossier** (from `recipient-research`)
2. **Writer's profile** (`context/about-me.md` or equivalent)

If either is missing, run `recipient-research` first or ask the user to point you at their about-me file.

## What to look for

Cross-reference the two profiles for overlap in these eight categories. The further down the list, the higher the leverage.

### 1. Career parallel (medium — common)
Worked at the same company, in the same industry, in similar roles. Use only if there's a *specific* overlap — same product, same team, same era.

### 2. Educational parallel (low — overused)
Same school. Useful only with a specific shared experience (same professor, same class, same dorm). "Stanford MBA" alone is too generic.

### 3. Geographic / origin parallel (medium — strong if specific)
Same hometown. Same immigration story. Lived in the same unusual place. Visited the same specific spot.

### 4. Formative experience parallel (high)
Both military veterans. Both first-generation immigrants. Both built something from zero. Both worked a manual-labor job before a desk job. Specific date or place beats abstract category.

### 5. Hobby / passion parallel (high — disarming)
Both Ironman triathletes. Both jazz pianists. Both run ultras. Both bake bread. Specificity matters: *"like you, I'm 6 marathons in"* beats *"like you, I'm a runner."*

### 6. Contrarian opinion parallel (highest — most memorable)
You both believe an unfashionable thing about the same topic. *"Like you, I think the LLM-evals space is wildly under-priced. The Anthropic paper from March made the case better than I could."* This signals you've read them carefully and you have your own brain.

### 7. Unusual / coincidental detail (highest — disarming + memorable)
Both wear the same obscure watch brand. Both reference the same indie film. Both quote the same Greek philosopher. The more unusual, the better — these are the lines people screenshot.

### 8. Shared friction / shared frustration (high — earns trust)
Both have wrestled with the same hard problem. *"Like you, I tried to ship X with Y constraint. I lost three months on it. I'd love your scar tissue."* Vulnerability + specificity.

## What to avoid (the wall of shame)

- *"Like you, I believe in [generic industry truism]"*
- *"Like you, but at a smaller scale"*
- *"Like you, I'm passionate about complex problems"*
- *"Like you, I think AI will change the world"*
- *"Like you, I went to a top school"*
- *"Like you, I'm a builder"* — what does that even mean

If your candidate hook fits any of these patterns, throw it out and look harder.

## Output format

```
## Top 5 connection angles, ranked

### 1. <One-line hook> [category, leverage score 1–10]
**The line as it could appear in the email:**
> "Like you, <specific genuine connection>."

**Why it works:** <one sentence>
**Source for the recipient detail:** <link>
**Source for the writer's detail:** <about-me.md line or equivalent>

### 2. <…>
### 3. <…>
### 4. <…>
### 5. <…>

## Notes
- <If two of the angles are close to each other, flag it — pick one>
- <If the writer's profile is thin in an area where the recipient is rich, name it as a gap>
- <If you can't find five strong angles, say so. Better one great hook than five weak ones.>
```

## How to use

1. User says: *"Find connections between me and [target]"* or invokes after `recipient-research`.
2. Read `context/about-me.md` (or equivalent).
3. Read the dossier.
4. Cross-reference for the eight categories above.
5. Rank by leverage — contrarian opinions and unusual coincidences at the top.
6. Hand off to `cold-email-coach` or `fun-angle`.

## When to flag a problem

If the only overlap you can find is generic ("we both went to Stanford"), tell the user honestly. That's a signal they should:

- Get a warm intro instead of going cold
- Pick a different target where the connection is stronger
- Lead with the offer rather than the connection (skip rule 5, double down on rule 10)

A weak connection forced into the email is worse than no connection.
