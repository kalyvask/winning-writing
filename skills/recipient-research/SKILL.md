---
name: recipient-research
description: Builds a research dossier on a cold-outreach target before drafting. Pulls LinkedIn, podcasts, blog posts, news, portfolio (if VC), and any specific personal details that would let an email feel hand-written rather than templated. Use when the user says "I want to email X" or "research Y before I write to them" or "build a dossier on Z." Triggers on "research," "dossier," "before I email," "background on," "find out about."
---

# Recipient research

Source: `points/cold-email-rules.md` (rule 1 — know something about the person and exploit it).

## Why this exists

Konrad's first rule of cold outreach: **research is non-negotiable.** People drop personal details in 20-minute podcast interviews. Recent blog posts. Portfolio company pages. Conference talks. The specificity is what separates a real email from a template.

You have 15 seconds when the recipient opens your email. Three concrete personal details earn those 15 seconds. A LinkedIn summary doesn't.

## What to find

For every cold-email target, build a dossier with these sections:

### 1. Public role and trajectory
- Current title and company
- Last 2–3 roles and how long they stayed (signals: founder vs. operator, builder vs. acquirer)
- The pivot points — what made them leave each role, what made them join the next
- Anything they've publicly said about *why* they're at the current job

### 2. Public writing and speaking
- Substack, Medium, personal blog, company blog
- Podcasts they've appeared on (especially long-form — 60+ minutes)
- Conference talks on YouTube
- Twitter/X — pinned tweets, recent threads
- LinkedIn posts (ignore the corporate ones; surface the personal ones)
- Books they've recommended or written

### 3. Distinctive personal details
This is the gold. Pull anything that is:
- **A specific anecdote** they've told publicly (the year, the place, the name)
- **An unusual hobby** (Ironman, jiu-jitsu, beekeeping, jazz piano)
- **A geographic origin or move** (immigrated from X, grew up in Y)
- **A formative experience** (military service, an early failure, a mentor)
- **A strong opinion** (especially one that's contrarian or unexpected)
- **A specific number** they've cited about their work

### 4. Their current focus / what they're hunting for
- If a VC: their portfolio, their public thesis, what they've said they want to fund
- If a CEO: hiring posts, their company's strategic moves, recent product launches
- If a hiring manager: open roles on their team, public posts about culture or hiring bar
- If a journalist: their last 5 stories, what they're sourcing for next

### 5. Mutual contacts and "wing-people"
- LinkedIn 2nd-degree connections — flag the ones you've actually engaged with
- Anyone in the user's network who has worked with the target
- Anyone who's interviewed them, written about them, or been quoted alongside them

### 6. Recent news (Google News non-negotiable)
- Last 30 days of their name in the press
- Last 90 days of their company in the press
- Anything they've publicly reacted to on social

## What to skip

- Generic résumé items (the LinkedIn header is in their LinkedIn header — don't repeat it back to them)
- Anything that would make them think "yeah, I know"
- Anything that requires a paid Rocket Reach / Apollo lookup unless the user explicitly authorizes it

## Output format

```
# Dossier: <Name>

## Headline
<One-sentence positioning — what's interesting and current about this person>

## Trajectory
<2–3 bullet career arc, signaling read>

## Three things they've said publicly
1. <Specific quote or anecdote, with source link>
2. <…>
3. <…>

## What they seem to want right now
<Read of their current focus, with citation>

## Hooks for "like you" lines
- <Specific, genuine, NOT generic>
- <…>

## Mutual contacts
- <Name — the user's actual relationship to them>

## Recent news (last 30 days)
- <Date · headline · why it matters>

## Three subject-line candidates
- "<Personal, timely, unusual>"
- "<…>"
- "<…>"

## Flags / risks
- <Anything potentially sensitive — recent firing, public controversy, job change in flight>
```

## How to use

1. User gives you a target name + (optional) company + (optional) link to LinkedIn or website.
2. Run the WebSearch and WebFetch tools to pull from the sources listed above.
3. Build the dossier. **Cite every claim with a link.**
4. If you find a thin profile (very limited public footprint), say so explicitly — don't pad. Recommend asking for a warm intro instead.
5. Hand the dossier to `cold-email-coach` (or use it directly to draft).

## Companion skills

- **connection-finder** — turns the dossier into specific "like you" hooks
- **fun-angle** — finds the humor / unusual detail you can lead with
- **cold-email-coach** — drafts the email
