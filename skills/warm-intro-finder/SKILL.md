---
name: warm-intro-finder
description: Finds the human bridges between the writer and a target — mutual contacts, alumni networks, ex-colleagues, podcast connections, board overlaps — and ranks them by how likely they are to make a useful introduction. Different from connection-finder (which finds "like you" content hooks). This one finds *people* who can vouch. Use whenever the user is about to send a cold email and hasn't checked who they know in common with the target. Triggers on "warm intro," "find a connection," "who do I know," "mutual contact," "do I have anyone," "who can introduce me."
---

# Warm-intro finder

Source: `points/cold-email-rules.md` rule 4 ("Find a mutual contact and name them") + the AB test result that the same email sent to `jobs@anthropic.com` got zero response while sent direct via warm intro got a reply at 8:25 AM the next morning.

## The premise

A warm intro from someone the recipient trusts roughly **doubles** open rate and **triples** response rate compared to the same email sent cold. Most cold emails fail not because they're bad, but because the writer never checked their network.

This skill exists because the check is mechanical and almost everyone skips it.

## What "warm" actually means

Not all mutual contacts are useful. The bar is:

- The connector has **engaged with both parties recently** (within the last 12 months) — a forgotten LinkedIn link from 2014 doesn't count
- The connector **has positive standing with the recipient** — a fired ex-employee is worse than a stranger
- The connector is **willing to spend social capital** — being a 1st-degree connection is necessary but not sufficient

Rank candidates by these three filters, not just by connection-degree.

## What to search

Cross-reference the recipient (from `recipient-research`) against the user's profile (from `context/about-me.md`) along nine bridge categories. Highest leverage at top.

### 1. Recent direct collaboration (1st degree)
Anyone the user has shipped a project with or worked closely alongside in the last 24 months who also has a current connection to the target.

### 2. Investor / board overlap
If the target is a founder or exec, who funds them? Who sits on their board? The user's network of investors and advisors is the highest-leverage bridge to founders.

### 3. Same-cohort alumni (operative cohort)
Not just "we both went to Stanford" — same year, same program, same section. *"Section H 2026"* opens doors that *"Stanford alum"* doesn't.

### 4. Ex-colleagues at the recipient's current company
People who have left the recipient's company in the last 24 months and remain on good terms. They know the culture and can frame the email correctly.

### 5. Podcast / media connectors
If the recipient appeared on a podcast, who else has been on that podcast? Who hosts it? Who runs the producer? These are warm-ish but underused.

### 6. Mutual investments / advisor pools
Has the user advised or invested in companies the recipient has also touched? Tangential but real.

### 7. Conference / event co-attendees
Same panel, same dinner, same off-site. Specifically — same *small* event. Big events (TED, Davos) don't qualify.

### 8. Local geography + activity
Both serious cyclists in Marin. Both regulars at the same coffee shop. Specific shared physical context creates an easy "hey, I'm in town" pretext.

### 9. Shared mentor or boss
Not the same school — the same *person*. "We both worked under [name] at [company]" is one of the strongest bridges.

## Output format

```
# Warm-intro candidates for: <recipient name>

## Tier 1 — Strong candidates (use these first)
| Connector | Bridge type | Standing with target | Last interaction with user | Likelihood of helping (1-10) | Action |
|---|---|---|---|---|---|
| <Name> | <e.g., investor in target's company; user worked at portfolio co.> | Strong | March 2026 | 9 | Ask for forwarded email with one-line vouch |

## Tier 2 — Possible candidates (worth a check)
[same table format]

## Tier 3 — Weak / risky (skip unless desperate)
[same table format, with a "why risky" column]

## Suggested approach for each Tier 1 candidate
For each:
- The exact ask (forward an email? do a 3-way intro? mention you in their next chat with the target?)
- The 2-sentence message the user should send the connector (NOT the recipient)
- How long to wait before pinging the recipient directly if no answer

## If no candidates exist
Say so honestly. Recommend three places to look that the skill couldn't see:
- Group chats / Slack workspaces (the skill can't see these)
- Recent LinkedIn 2nd-degree connections (the skill needs the user's LinkedIn)
- The recipient's recent podcast guests (often a 1-call-away bridge)

If the user genuinely has no warm path, recommend whether to send cold anyway, get on their podcast first, or pick a different target.
```

## How to feed candidates

The skill needs at least one of:

1. The user's `context/about-me.md` (with company history, schools, advisor relationships)
2. A LinkedIn URL for the user (for 1st/2nd-degree analysis — the skill flags what it would search if it had access)
3. A pasted list of the user's 50 most-recent meaningful interactions (calendar, Slack, email)

If none are provided, ask. Do not fabricate connections.

## The Constine forwardable blurb (template)

Once you have a Tier 1 connector willing to forward, send them a clean, short email they can pass through with a one-line vouch on top. Constine's format:

```
Subject: [Startup name] — [tagline], [traction or momentum highlight], raising [$X]

Hey [Connector],

Thanks for offering to connect us with [target name]. Sounds like they could be a great fit.

As a quick overview, we're building [company name], [one-line description].
[Short background — founder fit, ROI, mission, or big vision in 1–2 sentences].
Deck here: [link].

A few highlights from our recent progress:
- [Build progress / what you've shipped / proof of efficacy]
- [Big customer names, partnerships, market unlocks]
- [Star hires, big-name investors or angels who've joined]

We're [kicking off our raise of $X / having second-round meetings / finalizing the last allocations]. We're particularly interested in partners with [specific connections, operating experience, depth in this industry], so we'd be excited to talk to [target name].

Thanks!
— [Your name]
```

### Rules for the blurb

- **Subject line is the most important part.** It carries the company name, the traction proof, and the raise amount. The connector's vouch goes in the body, but the subject is what gets the email opened in the target's inbox after the forward.
- **Don't write a perfect pitch — write a tease.** The blurb's job is to get a reply from the target asking for a meeting. The full pitch happens in the meeting.
- **3 bullets, never more.** Choose the one most-impressive thing in each of: build/ship, market traction, team/investors. Cut everything else.
- **End with a specific ask** — what kind of investor you want — so the connector can frame their forward.
- **Read it back.** If the connector forwards this in 30 seconds without rewriting anything, you nailed it. If they have to rework it, you cost them time.

### Example (Constine's actual)

> Subj: **Ontraq — AI co-pilot for notaries, 500 signups per week, raising $1.5M**
>
> Hey Josh, thanks for offering to connect us with a few investors you think would be a great fit.
>
> As a quick overview, we're building Ontraq, the AI copilot for notarization. After launching projects as a lead engineer at Apple and senior engineer at State Farm, I teamed up with my brother who spent the last 5 years running a notarization firm with our mom — who was spending $50K/year on remarkably obsolete software. [Deck link]
>
> In just a few months, Ontraq has:
> - Built an AI copilot that automates 85% of intake and 30% of signing
> - Partnered with 70 firms and 700 channel partners with 500 customers joining per week, many from the outdated incumbents
> - Plotted an expansion roadmap from notarization into title and mortgage work
>
> We're raising $1.5M with the first check in from [Tier 1 fund]. We're particularly interested in partners with connections and expertise in GTM for legal and fintech. Let us know who you think would be helpful!

### Follow-up rule

Avoid coming across as desperate. If you need to nudge the connector, arm them with a specific update — *"In the past week the team has shipped X, hired Y, signed customer Z, started final-round meetings"* — not *"Just wanted to see if this sounds interesting?"*

## The forwarding rule

When the user lands a warm intro, the right format is:

1. Ask the connector if they're open to forwarding
2. If yes, send the connector a **fully-drafted email** ready to forward — the connector adds a one-line vouch on top, not the whole introduction
3. The email should make sense if the recipient reads it without the connector's vouch (in case the vouch gets stripped)
4. Heidi Roizen's rule: if you need three forwards, send three individually-tailored emails — never one with "please forward to A, B, and C"

This skill produces both the candidate list AND the forwardable email template.

## When NOT to run

- **Public application portals** (apply through the careers page; warm intros help most for direct outreach)
- **The recipient is famously transactional** (some people only reply cold; their network knows they don't pull strings)
- **You have a much stronger contrarian opener** that earns the email cold — sometimes the best cold email is stronger than a weak warm intro

## Companion skills

- `recipient-research` — must run first, since this skill cross-references the recipient's network
- `connection-finder` — finds *content* hooks ("like you, I…"); this skill finds *people* hooks
- `cold-email-coach` — once a warm path exists, the email's opener changes (rule 4 takes priority over rule 2)
- `graveyard-historian` — operators from the graveyard table are often warm-intro candidates the user hadn't considered

## The litmus test

For every Tier 1 candidate, the user should be able to answer: *"If [connector] forwarded my email to [recipient] tomorrow, would [recipient] open it?"* If yes, ship the request. If "maybe," ask the connector for permission to use their name in a cold email instead. If "probably not," that's a Tier 3 candidate and you should look elsewhere.

## The Konrad rule

> *"X suggested I reach out."* The bar is higher than a LinkedIn connection. Must be someone the user has actually engaged with.

A name-drop without engagement is worse than no name-drop — the recipient will check, and the misalignment is visible immediately.
