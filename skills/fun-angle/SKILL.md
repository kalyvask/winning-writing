---
name: fun-angle
description: Finds the unexpected, dry, or self-deprecating angle that makes an email memorable. Turns "professional and polite" into "this person sounds like a real human." Use when a draft is technically correct but forgettable, when the user wants humor without slapstick, or when they need a subject line or sign-off with personality. Triggers on "make it funny," "more personality," "less corporate," "humor," "memorable subject line," "sign-off ideas."
---

# Fun angle

Source: `points/core-rules.md` rule 9 (warmth and humor), `points/cold-email-rules.md` rule 3 (subject lines), `points/examples-and-critiques.md` (the model letters that worked).

## Why this exists

Kramon's class rule: *"Humor is non-negotiable. If you think there's too much humor, drop the course."*

The emails that get answered have one moment that makes the recipient smile. Not a joke — a moment. A line, an image, a self-aware aside, a subject line that's slightly weird.

This skill exists because most people are scared to be funny in professional writing, so they default to safe. Safe gets deleted.

## What works

### 1. Self-deprecation that doesn't beg for sympathy

✅ *"I spent last weekend reading your Substack instead of my OB pre-reads, and I'm not sure that was the wrong trade."*
✅ *"I open Google Docs and stare at it like it owes me money."*
✅ *"Collecting degrees like infinity stones."*

What works: the joke is at the writer's expense, but it's confident — not "poor me," more "yes, I see it too."

❌ *"I know I'm probably wasting your time but..."*
❌ *"Sorry to bother you, I'm just a humble student..."*
This is begging. Cut.

### 2. Specific, slightly absurd detail

✅ *"I'm wearing that hideous bracelet you gave me in 2011."*
✅ *"…wearing his dad's ill-fitting combat boots with egg in his hair."*
✅ *"…swimming from Hog Heaven toward Necker Island."*

What works: the detail is so specific it must be true. Specificity is funny on its own.

### 3. The unexpected juxtaposition

✅ *"Bush pilot turned GSB student."*
✅ *"Stanford MBA who manages a boxing World Champion."*
✅ *"Ex Olympic trials swimmer."*

What works: two things you don't expect to coexist. The reader's brain pauses for a second. That second is your foot in the door.

### 4. Dry observational humor

✅ *"Anthropic recently launched Claude Cowork — chat is a conversation, Cowork is delegation."*
✅ *"Centaur writers and recovered consultants."*
✅ *"To centaur writers and recovered consultants,"* (sign-off)

What works: doesn't telegraph the joke. The reader earns the smile by getting it.

### 5. The honest aside

✅ *"I was fortunate enough not to have to live on $4 a day while doing my MBA."*
✅ *"I'll be honest: I've never written a cold email I didn't second-guess."*
✅ *"I know that's a big ask, so no is a perfectly fine answer."*

What works: a moment of honesty about the ask itself. Earns trust.

## What doesn't work

- **Puns** — almost always groan-inducing
- **Pop-culture references** — date your email; the recipient may not know the show
- **Self-effacing humor that begs for sympathy** — see above
- **Forced humor** — if you can't say it without straining, cut it
- **Humor at someone else's expense** — even gentle ribbing of a third party is risky
- **Exclamation points** — humor is dryer without them
- **"LOL," "haha," ":)" or any emoticon** — undermines the line

## Where humor goes

### Subject line
Highest-leverage place. The subject is what gets the email opened.

Examples that worked:
- *"I'm wearing that hideous bracelet you gave me in 2011."*
- *"Coffee chat with Stanford MBA who manages a boxing World Champion."*
- *"From a fellow GSB."*
- *"Ex Olympic trials swimmer."*

### First sentence
A self-aware aside. *"I'll be honest: I…"* / *"I open Google Docs and stare at it like it owes me money."*

### One line in the middle
A specific absurd detail. *"…wearing his dad's ill-fitting combat boots with egg in his hair."*

### The sign-off
The line that proves you're a human, not a template.
- *"To centaur writers and recovered consultants,"*
- *"From a fellow optimist about boring infrastructure,"*
- *"With more questions than answers,"*

Never: *"Best,"* *"Sincerely,"* *"Warm regards,"* *"All the best,"*

## Output format

When invoked, take the user's draft (or context) and return:

```
## Three subject-line candidates with personality
1. "<line>"
2. "<line>"
3. "<line>"

## One self-aware opener
> "<line>"
**Why it works:** <one sentence>

## One absurd / specific detail to seed in the middle
> "<line>"
**Why it works:** <one sentence>

## Three sign-off candidates
1. "<line>"
2. "<line>"
3. "<line>"

## Risk flags
- <Anything that might land flat with this specific recipient — flag it>
```

## How to calibrate

Match the humor to the recipient's tone. A line that lands with a startup CEO will not land with a litigator. Read the recipient dossier (from `recipient-research`) before suggesting humor. If the recipient is famously dour, dial it down to dry observational; skip the absurd detail.

When in doubt: **one moment is enough.** A whole email of jokes is a comedy set, not an email.

## The litmus test

Read the line aloud. If you slightly cringe, cut it. If you slightly smile, ship it.
