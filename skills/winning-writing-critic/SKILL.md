---
name: winning-writing-critic
description: Grades any draft against the full Winning Writing rubric (Kramon + Konrad + Kingsbury) and rewrites it. The orchestrator skill — invoke when you don't know which specialized skill applies, when the user just says "review this" or "make this better," or when the draft spans multiple forms (e.g., a pitch email that's also kind of an op-ed). Triggers on "review," "critique," "feedback," "make this better," "is this good," "grade this."
---

# Winning Writing critic

Source: every file in `points/`. This skill is the orchestrator — it pulls from all of them.

## What it does

Given any draft, score it against the full *Winning Writing* rubric, then rewrite it. The output is two things: a numbered critique and a clean rewrite.

## The rubric

Score each dimension 0–10. Anything below 7 needs work.

### 1. Main point (0–10)
- Is there a single clear main point?
- Is it in the first sentence?
- Could the reader summarize it in 6 words?

### 2. Audience (0–10)
- Does the writer know who's reading this?
- Is it written *for* them, not *at* them?
- Would the reader feel "one in a million" or "one of a million"?

### 3. BLUF (0–10)
- Is the conclusion up front?
- Or is there organ music — buildup, throat-clearing, qualification?

### 4. Length (0–10)
- Is this as short as it can be without losing substance?
- Cold email under 200 words? Op-ed under 800?

### 5. Story vs. resume (0–10)
- Is there a specific scene with date, place, sensory detail?
- Or is it a list of accomplishments?

### 6. "Like you" / connection (0–10)
- Is there a specific, genuine bridge between writer and reader?
- Not generic ("we both believe in AI")
- Not self-diminishing ("but at a smaller scale")

### 7. Why-you / why-now (0–10)
- What makes this writer uniquely qualified to say this?
- Why is this timely?

### 8. The ask or offer (0–10)
- Is the ask small and specific?
- Is there an offer, or is the writer only taking?
- Door open for no?

### 9. Tone (0–10)
- Conversational, warm, human?
- Confident but humble?
- On their toes, not on their heels?
- Says what they like AND would like — not only what they don't?

### 10. Jargon (0–10, deducting)
- Banned words present? (See [banned-jargon.md](../../points/banned-jargon.md))
- AI tells? (*"It's not just X — it's Y,"* "delve," "tapestry")
- Wordy phrases?

### 11. Specifics (0–10)
- Real names, real numbers, real interviews?
- Or vague abstractions?

### 12. Sentence rhythm (0–10)
- Vary in length?
- Read aloud — does it have music?

### 13. Front-page test (pass/fail)
- Would the writer be okay with this on the front page of the NYT?

## Output format

```
## Score
Main point:           8/10
Audience:             6/10  ← needs work
BLUF:                 4/10  ← needs work
Length:               9/10
Story vs. resume:     5/10  ← needs work
[etc.]

Total: 78/130

## Critique (in order of priority)

1. [The biggest problem, with the specific line that fails and why]
2. [Second biggest]
3. [Third biggest]

## Rewrite

[The clean version]

## What changed (3 bullets)
- [Top change 1]
- [Top change 2]
- [Top change 3]
```

## Routing — when to delegate

If the draft is squarely in one of the specialized skills' lanes, hand it off:

| Draft type | Hand off to |
|------------|-------------|
| Cold email, LinkedIn DM, intro request | `cold-email-coach` |
| Op-ed, opinion piece, long-form post | `op-ed-coach` |
| VC pitch, mission statement, "tell me about yourself" | `pitch-coach` |
| Thank-you note, gratitude letter | `gratitude-note-coach` |
| Memo or update where the lede is buried | `bluf-rewriter` |
| Anything where the user wants it shorter | `concision-drill` |
| Anything full of jargon | `jargon-killer` |

If the draft is mixed (e.g., a cold email that's pitching a thesis, or a memo that's also a personal essay), stay here and grade against the full rubric.

## The litmus question

Before handing back the rewrite, ask yourself:

> *"How will this make the recipient feel?"*

If you can't answer, the rewrite isn't done.

## When the user wants a "second opinion" not a rewrite

Some users want critique without a rewrite. Respect that. In that case, output the score + critique, skip the rewrite, and offer: *"Want me to take a swing at the rewrite, or do you want to take it from here?"*
