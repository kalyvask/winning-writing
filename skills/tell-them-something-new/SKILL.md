---
name: tell-them-something-new
description: Cuts opening sentences that recap what the recipient already knows about themselves, their company, or their own work. Implements Konrad's rule 2 ("begin with something they don't know — tell me a secret about the future") and Kramon's rule 4. Use when a draft opens with flattery, a summary of the reader's accomplishments, restating their stated thesis, or reciting biographical facts they already have. Triggers on "they already know," "rewrite the opener," "stop with the flattery," "first sentence is weak," "secret about the future," "tell them something new."
---

# Tell them something new

Source: `points/cold-email-rules.md` rule 2, `points/core-rules.md` rule 4, Konrad's "tell me a secret about the future" guidance.

## The premise

The most-failed sentence in cold writing is the opener. The default move is to recap something the recipient already knows: their job, their accomplishments, their stated thesis, their company's recent press release. **They lived it.** Telling them about themselves wastes the 15 seconds you have.

The fix isn't a different recap. The fix is a sentence that contains *new information* — a secret about the future, a number they don't have, a contradiction in their own data, a connection between two things they hadn't linked.

## What "they already know" looks like

These are the seven flavors of opener-failure. Cut them all:

### 1. Flattery about their accomplishments
> ❌ *"You've transformed industry after industry — Google Maps, the Like button, Salesforce, OpenAI."*

He knows. He lived it. The reader's first thought is: *get to the point.*

### 2. Their own stated thesis, recited back
> ❌ *"I've been thinking a lot about your point that 'agents are the new product surface' — it really resonated."*

He said it. He doesn't need to hear it again, with adverbs.

### 3. Public biographical recap
> ❌ *"As the CEO of a $2B AI company and the chair of OpenAI's board…"*

His title is in his email signature. His company's valuation was the lede of last week's TechCrunch piece. Useless.

### 4. Recent news they were the subject of
> ❌ *"Congratulations on the Fragment acquisition!"*

He was on the press release. The all-hands was Tuesday. *"Congratulations on X"* is what every other cold email opens with that week.

### 5. Generic industry truisms
> ❌ *"As we all know, AI is transforming enterprise software."*

True for everyone, news to no one. Dead on arrival.

### 6. Self-introduction
> ❌ *"My name is `[your name]` and I'm a `[your school / role]` passionate about AI."*

His email client put your name and address at the top of the message. The introduction is structural, not sentence-level.

### 7. Throat-clearing about the email itself
> ❌ *"I hope this email finds you well. I'm reaching out because…"*

He doesn't care how the email finds him. The reason for reaching out should *be* the first sentence.

## What earns the opener

A first sentence earns its place when it contains at least one of:

### A. A "secret about the future"
A one-sentence thesis they haven't heard about where their world is going. Slightly wrong is fine. Generic ("AI will transform everything") is fatal.

> ✅ *"The hardest agent UX problem isn't trust calibration — it's that engineers learn to trust their own evals more than they trust their customers, and the day a model misbehaves they discover the eval was wrong."*

### B. A specific number they don't have
Your own data, your own research, a fact from your work that contradicts or extends something they've said publicly.

> ✅ *"Only 14% of enterprise AI practitioners reach measurable impact in under a month. 50% expect to by 2027. That 4× gap is the reason most agent deployments die quietly."*

### C. A contradiction in their public position
Carefully — not a gotcha. A genuine tension you've noticed. They want to know you've read them.

> ✅ *"Sierra publicly hires 'builders who ship, not optimizers who deck.' But your enterprise sales motion is the most deck-heavy in agent infrastructure right now. There's a tension here I think you're aware of."*

### D. A specific scene with a date and detail
Konrad's rule 6, applied to the opener.

> ✅ *"At 2:47 a.m. last Wednesday our incident bot diagnosed an outage in 90 seconds. The on-call engineer then spent 38 minutes clicking through tools to run the rollback. A Tier-1 customer filed a ticket asking why our product 'watched it happen.'"*

### E. An offer they want
Konrad's rule 10, applied to the opener.

> ✅ *"I'd like to invite you to keynote the GSB AI Conference on May 14. 600 MBAs, three other AI CEOs already confirmed."*

A genuine offer can lead. A fake offer ("I have a great idea I'd love to share") cannot.

## The two questions to ask

For every opener, run both:

1. **Does this person know this already?** If yes — about themselves, their company, their stated views, their recent press — cut it.
2. **Does the recipient learn something in the first 15 words?** If no, the sentence isn't earning its place. Rewrite.

## How to run the pass

### Pass 1 — Diagnose
Read the first three sentences of the draft. Mark every claim:
- Does the recipient know this? (recap)
- Did the writer just learn this in the last 30 days? (potentially new)
- Is this a stated public position of the recipient? (recap)

### Pass 2 — Find the candidate "secret"
Look in the rest of the draft. Is there a number, a scene, a thesis, or a contradiction buried in paragraph 3 that should be at the top? The writer often *has* the right opener — they just put it in the wrong place. Move it up.

If nothing in the draft qualifies, the opener doesn't exist yet. Tell the user. Suggest going back to their research and finding one (a podcast quote nobody else has noticed, a number from their own work, a thesis they can defend in one sentence).

### Pass 3 — Rewrite
Replace the recap with the secret. One sentence, max two.

### Pass 4 — Test
Read the rewritten opener aloud. Then ask:
- *If the recipient stopped reading after sentence 1, did they get something they couldn't have gotten anywhere else?*

If yes, ship. If no, the opener still doesn't earn its place.

## Output format

```
## Diagnosis
Original opener: "the first 1–3 sentences"
Failure mode: <flattery | thesis-recap | bio-recap | news-recap | truism | self-intro | throat-clearing>
Why it fails: <one sentence>

## The buried secret (if found)
A candidate "tell-them-something-new" sentence pulled from later in the draft:
"<the sentence>"

## Rewrite
"<the new opener — one or two sentences max>"

## What changed
- Removed: <recap content>
- Added: <new content — and where it came from in the draft, or where the user needs to source it>

## If no opener candidate exists
Tell the user honestly. Recommend three places to look: their own recent research, a specific podcast or post by the recipient, or a contradiction in the recipient's public position.
```

## When NOT to apply

- **The recipient genuinely doesn't know who you are**, and a brief context line is the most efficient way to ground them. (One sentence, max — and only if you can't lead with a stronger hook.)
- **A warm-intro forward** where the introducer has already established who you are. The opener can lean on that.
- **Replies to a thread** the recipient started. Mirroring their language back to them is the right move there.
- **Gratitude notes.** They're allowed to recap a shared moment — that's the whole point of the genre.

## The Konrad rule

> *"Tell me a secret about the future."*

You don't have to be right. You have to be **specific** and **interesting** and **not something they already knew**. Slightly wrong is fine. Dazzling and unique is required.

## The litmus test

Send your opener to a friend who knows the recipient. Ask: *"Would they roll their eyes reading this, or would they pause?"* If "roll," rewrite. If "pause," ship.
