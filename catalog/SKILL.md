---
name: winning-writing
description: Mode-aware writing critic. Distilled from Rachel Konrad's Stanford GSB "Winning Writing" course (spring 2026), the 10 rules of cold outreach, Heidi Roizen's mailing rules, and live class critiques. Loads a rule catalog (rules/catalog.json) and a mode definition (rules/modes.json) at invocation. Use whenever drafting or critiquing a cold email, outreach message, LinkedIn intro, exec memo, personal essay, bio, README, or LinkedIn post. Pass a mode argument to filter which rules apply.
---

# Winning Writing — mode-aware

Source: Rachel Konrad's GSB guest lectures, Heidi Roizen's rules, 25 model letters, live student critiques. Rule library is in `rules/catalog.json`; mode definitions in `rules/modes.json`. Full playbook in `references/cold_outreach_playbook.md`.

## Invocation

```
/winning-writing <mode> "paste draft here"
```

Where `<mode>` is one of: `cold-email`, `memo`, `essay`, `profile`, `readme`, `linkedin-post`, or `default`.

If no mode is given, defaults to `default` (every rule in the catalog fires). The mode arg filters the catalog to rules tagged with that mode, applies any per-mode severity overrides from `modes.json`, and applies the mode's target-length check if one is set.

## What this skill does on every invocation

1. **Read `rules/modes.json`** to get the active mode's definition (label, description, target length, severity overrides).
2. **Read `rules/catalog.json`** and filter to rules whose `modes` array includes the active mode (or the active mode is `default`).
3. **Apply per-mode severity overrides** to the filtered rules.
4. **Critique the draft** against the filtered list. For each rule, name the rule, quote the failing span, give the suggested rewrite, and cite the rule id so the user can look it up.
5. **Apply the length check** if the active mode declares a `target_words` value.
6. **Return** a structured critique with critical issues first, then issues, then warns. End with a clean rewrite of the draft.

## Output format (unchanged from prior versions)

```
## Mode
<mode label> — <one-sentence mode description>

## Flags

### Critical
- <rule id>: <one-sentence why this fires> ("<quoted span>")
  Suggested: "<rewrite>"

### Issue
...

### Warn
...

## Length
<word count> / <target>  [if mode has target_words]

## Rewrite
<full clean rewrite>

## What changed (3 bullets)
- ...
```

If no flags fire, say so explicitly: *"No flags from the <mode> catalog. The draft is clean against the rules; verify the substance separately."*

## How mode filtering works

Each rule in `catalog.json` carries a `modes` array like `["cold-email", "memo", "linkedin-post"]`. When you invoke with `--mode cold-email`, only rules whose modes array includes `cold-email` fire. The `default` mode is a catch-all: every rule in the catalog applies.

Severity for a fired rule comes from the rule's `severity` field, unless the active mode declares an override in `severity_overrides`. For example: `em-dash` has base severity `issue`. In mode `cold-email`, the override bumps it to `critical`. In mode `essay`, no override, so it stays `issue`.

## How to add or edit a rule

1. Open `rules/catalog.json`.
2. Append a new object to `rules[]` with `id` (kebab-case, unique), `name`, `description` (the rule itself, plain English), `modes` (the modes it applies to), `severity` (`critical` | `issue` | `warn`), and 1-3 `examples` of before / after.
3. To retire a rule, set `"retired": true` rather than deleting it. Historical eval runs depend on a stable rule set.
4. To make a rule fire harder in a specific mode, add an entry to `modes[<mode>].severity_overrides` in `modes.json`.

## How to add a new mode

1. Open `rules/modes.json`.
2. Add a new key under `modes` with `label`, `description`, `target_words` (or null), and any `severity_overrides`.
3. Tag the relevant rules in `catalog.json` with the new mode name.

## Relationship to other skills

- For cold outreach specifically, this skill is usually invoked from `cold-email-coach` (in `../skills/`), which pulls in `context/about-me.md` (who is sending) and `recipient-research` (who is receiving). The rules here apply to the language and structure; the other two provide the raw material.
- For PRDs and exec memos, this skill works alongside the `pm-evaluation-framework` skills (`pm-prd-drafter`, `pm-evaluator`).
- Surgical-edit subskills like `style-tells`, `vividness`, `compression` (in the public `kalyvask/winning-writing` repo) do single-pass rewrites for one cluster of rules at a time, picked via the skill's own `--target` or `--mode` arg. This skill is the multi-rule critic.

## The 10 rules of cold outreach (reference)

The catalog encodes these as individual rules. Read the originals here for context:

1. **Know something about them and exploit it** — encoded as `generic-opener`, `flattery-opener`.
2. **Begin with something they do not know** — encoded as `ai-template-opener`, `flattery-opener`.
3. **Subject line that cannot be ignored** — encoded as `weak-subject`.
4. **Find a mutual contact and name them** — discovery, not a rule. The `cold-email` orchestrator handles this.
5. **The "like you" move** — encoded as `self-diminishing`.
6. **Tell a story** — encoded as `show-dont-tell`.
7. **Pick a lane** — encoded as `picks-too-many-lanes`.
8. **Confident but humble** — judgment call, not encoded.
9. **Short with a small, easy ask** — encoded as `length-200`, `vague-ask`.
10. **Offer something in return** — encoded as `missing-offer`.

## Pre-send checklist (cold-email mode only)

Run after the critique passes:

- Subject line: would this person actually open it?
- First sentence: tells them something they don't know?
- "Like you": genuine, specific comparison, not generic?
- Story: one vivid scene with sensory detail?
- How you help them: specifically what you can do for them, not what you want?
- Secret about the future: one insight or thesis they haven't heard?
- Ask: small, specific, easy to say yes to? Door open for no?
- Offer: giving something, not just taking?
- Length: under 200 words?
- Jargon: leverage, align, synergize, drive, impact, strategize, empower, enable all cut?
- Names and details: firm name, spelling, title all checked twice?
- Read aloud: sounds like you, not a ChatGPT template?
- Right person: not jobs@ or pitches@ — actual human?
- Sign-off: has personality (not "Best" or "Sincerely")?

## Condensation discipline

When the task is to shorten existing text (not draft new), the move is **subtract, not rewrite**. Each bad sentence has 1-2 specific cancers — a hedge, a throat-clearer, a euphemism, a presumption. The exercise: identify, excise, stop. Reaching for new fragments, em-dashes, or "helpful" additions after the cut refills the space you just opened. **After you cut, don't refill.**

Three failure modes to watch for when condensing:

- **Register drift.** The shortest version isn't the right version if you've moved the reader from a business room to a Slack room. "Want help?" is shorter than "May I help?" but matches a different reader. The catalog rule is `register-mismatch`.
- **Soft-cope substitution.** Stripping "to secure our future" from a layoff sentence is right; replacing it with "to survive" or "to keep the company alive" is the same sin in shorter form. Verb + object. Trust the reader to supply context. The catalog rule is `soft-cope-substitution`.
- **Presumptive next-step.** "Interested?" beats "Interested? I'll send times." The follow-up sentence forces a structure on a reader who hasn't said yes. The catalog rule is `presumptive-next-step`.

If you can't condense without restructuring, the original sentence's problem isn't length — it's that the wrong verb is doing the work. Find the working verb, lead with it, stop.

## When you finish

Hand back: (a) the structured critique in the format above, (b) a clean rewrite, (c) a flag for any factual claim the user needs to verify before sending.

Full playbook with all examples, critiques, and commentary: `references/cold_outreach_playbook.md`.
