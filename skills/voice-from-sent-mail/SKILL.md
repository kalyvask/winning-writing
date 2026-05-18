---
name: voice-from-sent-mail
description: Read the user's recent sent emails from Gmail and propose updates to `context/voice-and-style.md` and `context/about-me.md` based on patterns the sent mail reveals. Use when the user says "read my sent mail," "voice from sent mail," "what does my voice actually look like," "audit my voice file against reality," or "/voice-from-sent-mail." Requires a connected Gmail MCP. Always proposes a diff and requires approval before writing.
---

# Voice from sent mail

The user's actual voice lives in their sent folder, not in the context files. This skill reads the last 20-50 sent messages, surfaces recurring patterns (openers, signoffs, sentence rhythm, words they use, words they avoid, length, formality), and proposes diffs to bring the context files in line with how the user actually writes.

Composes with `voice-commit`: this skill discovers the patterns, `voice-commit` does the actual file writes one concept at a time.

## Why this exists

Two failure modes the existing voice files don't catch:

1. **Aspirational voice ≠ actual voice.** The user wrote `context/voice-and-style.md` six months ago describing how they want to write. Their last 20 sent emails show how they actually write. The Coach reads the file, not the inbox, so it drifts.
2. **Banned-word drift.** A word the user once banned creeps back into their sent mail. Either the rule is wrong (revise it) or the user is regressing (flag it).

Auto-learning from every draft is intentionally not supported — it would reinforce AI-tells the model rationalized away. But auto-learning from *sent* mail is different: those are messages the user actually sent and stands behind. They're ground truth.

## Inputs

Optional arguments:
- **Time window** — default `last 30 days`. Accept "last week," "last 3 months," "since [date]."
- **Count cap** — default `20 messages`. Cap at 50 to keep token cost bounded.
- **Filter** — default: exclude `to:` matches that look like automated (no-reply, notifications@, billing@), exclude one-line replies under 30 words. Focus on substantive outbound.
- **Recipient archetype** — optional. "Only emails to investors / professors / friends / colleagues." Different archetypes pull different voice registers.

If the user just says "/voice-from-sent-mail" with no args, use defaults and ask whether to narrow the filter before fetching.

## Process

1. **Confirm scope before fetching.** "I'll pull your last 20 sent messages from the past 30 days, excluding one-liners and auto-replies. Sound right?" If they say yes, proceed. If they want different scope, adjust.

2. **Fetch via the Gmail MCP.** Use whatever Gmail search/thread tools are available. Query for `from:me` in the sent folder, filter as configured. Fetch the body of each message, not just the headers. If a message is a reply, fetch only the user's reply portion (skip quoted threads).

3. **Read the current voice files** in full: `context/voice-and-style.md` and `context/about-me.md`. The diff is against current state, not absolute.

4. **Analyze. Look for the following patterns:**
   - **Opener moves** — how the first sentence starts. Count: "Hi NAME," vs no greeting, BLUF first vs throat-clearing first, common opening phrases, time references ("Just got back from…", "Heading into…")
   - **Signoffs** — count distinct signoffs. If "Best" appears in 18 of 20, it's the user's actual default. If `voice-and-style.md` says "I don't use Best," there's a contradiction to flag.
   - **Sentence rhythm** — average sentence length, max/min, runs of short sentences. Compare to the file's claim.
   - **Words the user actually uses** — flag any that match the file's "Words I like" list (confirmation) AND any frequent word NOT in the file (candidate for addition).
   - **Banned-word violations** — flag any word from `voice-and-style.md` "Banned words" or `points/banned-jargon.md` that appears in sent mail. Quote the sentence.
   - **AI-tell drift** — em-dashes, "delve," "navigate the complexities," etc. Quote the message and date.
   - **Length** — what's the actual median word count of outbound emails? Compare to the file's target.
   - **Format moves** — contractions, fragments, parentheticals, lists, headers in long emails. Match against the file.
   - **Recipient adjustments** — does the user write differently to investors vs friends? If the file claims one register but the sent mail shows two, name the split.

5. **Produce the audit report** with three sections:
   - **Confirmations** — patterns in the sent mail that match what the file claims. "File says: I don't use semicolons. Sent mail: 0 semicolons in 20 messages. ✓"
   - **Drift candidates** — file rules that don't match the sent mail. "File says: 'Best' is bland. Sent mail: 'Best' in 18 of 20 closings. Either update the file or commit to changing the signoff."
   - **New patterns** — recurring moves in the sent mail that aren't in the file. "Opening with a one-sentence time reference appears in 9 of 20 messages (Athens, GSB events, recent trips). Worth adding to Opener moves."

6. **For each drift candidate and new pattern, propose a diff.** Use the same diff format as `voice-commit`: 3-5 lines of surrounding context, the change clearly labeled. Group by file (voice-and-style.md vs about-me.md).

7. **Ask for per-diff approval, not batched.** "Want me to apply the signoff update?" "Want me to add the time-reference opener pattern?" The user accepts/rejects each.

8. **For each approved change, call into `voice-commit`** (or do the equivalent Edit) to write the file. Preserve all existing content. Never overwrite.

9. **Echo back what changed** in 2-3 sentences and propose the next read date. "Updated voice-and-style.md with 3 new patterns and corrected the signoff rule. Suggest re-running this in 4-6 weeks."

## What you do NOT do

- Do NOT auto-write. Every change goes through diff + approval.
- Do NOT quote a recipient's name or content. Sent mail is the user's outbound voice; the *content* you analyze is their phrases and structure, not who they sent to. Anonymize anyone you cite by role ("a senior partner," "an investor") not name.
- Do NOT push every drift into the file. Some drifts are real ("I always use Best" overrides the file rule), some are situational ("I used 'leverage' in one email to legal" doesn't justify removing it from the banned list). The user judges.
- Do NOT analyze drafts in the Drafts folder. Drafts are unsent — they reflect aspirational voice, not actual.
- Do NOT call this skill repeatedly in a short window. Once per 4-6 weeks is enough; more often and it overweights short-term tone shifts.
- Do NOT change `about-me.md` based on what's said in sent mail unless the user explicitly mentions a new credential, role, or fact about themselves. Voice → voice-and-style.md. Identity facts → about-me.md, but only if unambiguous.

## Privacy

The skill reads the user's sent mail via the connected Gmail MCP, in the user's own Claude Code session. Nothing leaves the local environment except the model's own analysis call. The model sees the message bodies in-context to analyze patterns; it doesn't store them outside the session. If the user wants extra caution, they can:
- Run the skill with `--no-quotes` to suppress example sentences in the audit report
- Cap the count lower (e.g., 10 messages)
- Pre-filter to a specific label or recipient group

## Example

**User:** "/voice-from-sent-mail last 2 weeks"

**Skill:**

1. "I'll pull your sent mail from the last 14 days, excluding replies under 30 words and any auto-generated messages. Sound right?"
2. (After yes) Fetches 14 messages via Gmail MCP.
3. Reads `context/voice-and-style.md` and `context/about-me.md`.
4. Produces audit:
   ```
   ## Confirmations
   - File says: no semicolons. Sent mail: 0/14 ✓
   - File says: no em-dashes in cold mail. Sent mail: 0/14 ✓
   - File says: contractions OK. Sent mail: 32 contractions across 14 messages ✓

   ## Drift candidates
   - File says: avoid "currently." Sent mail: "currently" appears in 6/14. Three are time-anchored ("currently in Lisbon"), three are fillers ("currently working on…"). Suggest narrowing the rule: ban filler "currently" only.
   - File says: signoff should have personality, not "Best." Sent mail: "Best, Alex" in 11/14. Either update the file or change the habit.

   ## New patterns
   - Opening with a one-line time/location reference appears in 5/14 ("Just back from Athens," "Day before pitch competition…"). Not in the file's Opener moves section. Worth adding.
   ```
5. Per drift: "Want me to (a) narrow the 'currently' ban, (b) update the signoff rule, (c) add the time-reference opener pattern?"
6. For each yes, proposes a clean diff against the right section of voice-and-style.md and writes after approval.
7. "Updated 3 sections. Suggest re-running in 4-6 weeks to see if 'currently' filler drops once it's in the rule explicitly."
