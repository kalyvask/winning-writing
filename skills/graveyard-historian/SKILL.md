---
name: graveyard-historian
description: When pitching an idea, researches the graveyard — companies that tried something similar in the past 5–25 years and failed, what specifically killed them, and which operators or investors lived through those failures and would be valuable to talk to. Use before pitching to a VC, a customer, or a hiring manager — the graveyard reframes the pitch from "this is a great idea" to "this is a great idea AND I know why every previous attempt died." Triggers on "research the graveyard," "who tried this before," "previous attempts," "failed companies in this space," "post-mortem," "why did X fail."
---

# Graveyard historian

Source: the Konrad/Hertzberg "do your homework" rule taken seriously, applied to *the entire industry's history* and not just the recipient.

## The premise

Most pitches read as if the idea is unprecedented. It almost never is. Someone tried it in 2014 and ran out of runway. Someone else tried it in 2019 and got acquired into irrelevance. A third tried it in 2022 and pivoted away from the original thesis.

A pitcher who can name the graveyard, explain *why* each previous attempt died, and identify *who survived* to tell the tale signals three things at once:

1. **You did the work.** You aren't reinventing dead startups by accident.
2. **You have a falsifiable thesis** about why this time is different — grounded in specific failure modes, not vibes.
3. **You know who to call.** The operators who lived through the failures are the most valuable advisors any investor can introduce you to.

Investors love this move because it inverts the asymmetry — the pitcher usually knows less industry history than the investor, and showing up with a graveyard reverses that.

## The output of this skill

Two artifacts:

**1. The graveyard table** — added to the user's about-me / pitch context so Coach can use it in dossiers and openers.

**2. A people-to-talk-to list** — operators and investors who lived through specific failures. These become candidate warm-intro targets, advisors, or just inputs to the user's own thinking.

## How to run

### Step 1 — Define the pitch one sentence wide
Have the user state the idea as: *"I'm building [X] for [audience] that solves [problem]."* If the user can't compress it, run `pitch-coach` first.

### Step 2 — Search the graveyard
Use web_search (if available) and your training data to find companies that tried a substantively similar thing in the last 5–25 years.

For each one, capture:

| Field | Detail |
|---|---|
| Company | Name + (founders) + (years active) |
| Funding | Total raised, lead investors |
| Specific approach | One sentence on what they actually built |
| Outcome | Shut down / acquihire / pivoted / zombie |
| Why they died | The specific failure mode, not the generic "no PMF" |
| Lessons | One or two transferable lessons for the user's pitch |

Aim for 3–7 companies. Fewer than 3 means the search wasn't deep enough. More than 7 dilutes — pick the most relevant.

### Step 3 — Map failure modes to a typology
Cluster the companies by *why* they died. Common modes:

- **Too early** — the underlying tech wasn't ready (pets.com 2000, Webvan 2001, AR companies 2014–2019)
- **Wrong wedge** — solved a real problem for the wrong first customer
- **Distribution lost** — built a great product nobody could find
- **Got commoditized** — the moat collapsed when a platform shipped a feature
- **Regulation** — a rule change killed the unit economics
- **Founder ousted / team blew up** — non-product reasons
- **Solved the wrong problem** — turned out customers didn't actually want the solved version
- **Got acquihired before traction** — soft death

Different failure modes call for different rebuttals. The user's pitch needs to explicitly address the mode that killed the closest predecessor.

### Step 4 — Find the survivors
For each dead company, surface:

- **Founders** — where they are now (often the most valuable people to talk to)
- **Early investors** — who saw it up close
- **Senior employees** — VPs and ICs who lived inside the failure
- **Acquirers** — companies that bought the corpse and learned from it

Cite each one with a LinkedIn or public source. These are warm-intro targets, advisors, or interview subjects.

### Step 5 — Frame the "why this time is different"
The graveyard table on its own is just trivia. The thesis sentence the user needs is:

> *"Companies A, B, and C all died because of [failure mode X]. We avoid [X] by doing [Y]. The reason that wasn't possible until now is [Z — usually a tech, regulatory, or distribution shift in the last 18 months]."*

This sentence belongs in the pitch deck *and* in the cold email opener.

## Output format

```
# Graveyard for: <one-sentence pitch>

## Companies that tried this (most recent first)

### 1. <Company> (founders, YYYY-YYYY)
- **Raised:** $X, lead: <investor>
- **What they built:** <one sentence>
- **Outcome:** <shut down | acquihired | pivoted | zombie>
- **Why they died:** <the specific failure mode>
- **Lesson:** <transferable to current pitch>
- **Sources:** <links>

### 2. ...

## Failure mode typology
<2–4 dominant patterns across the graveyard>

## Why this time is different (the user's required thesis)
<one paragraph the user must be able to defend in 30 seconds>

## People worth talking to
| Person | Their role in the graveyard | Why they matter | Source |
|---|---|---|---|
| <Name> | <e.g., founder of failed Co. A> | <e.g., wrote a long post-mortem; will know what we don't> | <link> |

## What to add to your context/about-me.md
A short paragraph the user can paste into their about-me file so Coach has this context on every future run. Frames the user as someone who has done the homework on the entire history of the space, not just the recipient.

## Flags
- <Anything the user must verify before citing>
- <Anyone in the graveyard who is sensitive to mention (still bitter, still litigating, still working at the recipient's company)>
```

## When NOT to run

- **Pure incrementalism.** If the user is launching feature 47 of an existing product, the graveyard is irrelevant. Run `pitch-coach` instead.
- **Greenfield with no analogs.** Genuinely novel ideas (rare) have no graveyard. Don't fabricate one. Say so.
- **Personal essays / op-eds.** Different genre. Use `op-ed-coach`.

## Companion skills

- `recipient-research` — for the specific recipient (this skill is for the *space*, not the *person*)
- `warm-intro-finder` — turns the "people worth talking to" list into a connection map
- `pitch-coach` — owns the pitch itself; this skill feeds it material
- `cold-email-coach` — the opener should reference the graveyard if the recipient is in the space

## The litmus test

After running this skill, the user should be able to answer the investor's hardest question — *"What about [Company X], didn't they try this?"* — in two sentences without flinching. If they still flinch, run another pass.
