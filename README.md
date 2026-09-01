# Winning Writing

[![eval](https://github.com/kalyvask/winning-writing/actions/workflows/eval.yml/badge.svg)](https://github.com/kalyvask/winning-writing/actions/workflows/eval.yml)

> 31 Claude skills for cold outreach, op-eds, pitches, press inquiries, bios, exec memos, performance reviews, spoken-delivery talks, fact-checking, and reply-rate tracking. Distilled from Stanford GSB's *Winning Writing* (Glenn Kramon, GSBGEN 352), Rachel Konrad's cold-outreach lectures, and Andrew Ross Sorkin's reporter playbook. Run them from Claude Code, from Cowork, from a browser Coach, or from a Chrome extension next to your Gmail compose.

## The shortest path

Install as a Claude Code plugin. Two commands, no clone:

```
/plugin marketplace add kalyvask/winning-writing
/plugin install winning-writing
```

Skills become available as `/winning-writing:<skill-name>` and update when the plugin version bumps (see [`CHANGELOG.md`](CHANGELOG.md)). Or install by copying, if you want to edit the skills as your own:

```bash
git clone https://github.com/kalyvask/winning-writing
cp -r winning-writing/skills/* ~/.claude/skills/
```

Either way: open Claude Code (or Cowork), drop a draft into the chat, and say *"critique this cold email"*. Claude auto-triggers `cold-email-coach`, runs the rubric, and calls in `recipient-research`, `connection-finder`, `tell-them-something-new`, `style-tells`, and whichever else applies. The skills compose. No UI to open, nothing to paste between windows.

To try the offline Draft Critic without installing anything: [kalyvask.github.io/winning-writing](https://kalyvask.github.io/winning-writing/). It runs entirely client-side, no API key, and pastes never leave your machine.

## Four ways to use this

The same rule library powers all four. Pick whichever fits where you already work.

1. **Claude Code** (recommended). Install the plugin as above. Skills auto-trigger from what you type.
2. **Cowork** (desktop, no terminal). Point Cowork at a folder, drop `skills/` and `context/` inside, restart the session.
3. **The browser UI** ([`ui/`](ui/README.md)). An offline Draft Critic, and a Claude-powered Coach that drafts through an agentic pipeline or critiques span-by-span with Accept / Reject / Refine.
4. **Chrome extensions.** Composing in Gmail or LinkedIn? [`inline-coach`](inline-coach/) attaches inline. Critiquing a cold email from the Gmail side panel? [`side-panel-coach`](side-panel-coach/). Both hold your API key in `chrome.storage.local` and call `api.anthropic.com` directly. No backend.

## How it works in one sentence

Claude reads the rules in `points/` and the skills in `skills/` as its operating system, runs through them on whatever draft or pitch you bring, and returns a complete package: dossier synthesis → connection angles → subject lines → drafted email → rubric score → flags to verify before sending.

The rules are not in the model's training. They are loaded at runtime, so Glenn Kramon's class stays opinionated, the banned-word list is enforced, and the model follows *those* rules rather than its own median instincts.

## Personalize this for your own use

The toolkit critiques *your* writing against *your* voice. Until you fill in the context files, every output is generic.

1. **Install the skills** (above).
2. **Edit [`context/about-me.md`](context/about-me.md).** Replace every bracketed placeholder: who you are, what you're working on, how you think, how you want pushback. Named companies, real numbers. Generic in, generic out.
3. **Edit [`context/voice-and-style.md`](context/voice-and-style.md).** Keep the structure; replace the sample paragraphs with three or four of your own that you'd be happy to be cloned from.
4. **Tell Claude to read them.** In Claude Code, add to your project `CLAUDE.md`: *"Before every task, read everything in my `context/` files."* In Cowork, put the same line in Settings → Cowork → Edit Global Instructions.
5. **Keep drafts out of git.** `drafts/`, `outputs/`, `*.draft.md`, and `*.private.md` are already gitignored.
6. *(Optional)* **Set an API key** for the browser Coach or an extension. Skip this if you only use Claude Code or Cowork. Get one at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys); the repo ships with no keys.
7. *(Optional)* **Load an extension.** Instructions in [`side-panel-coach/README.md`](side-panel-coach/README.md) and [`inline-coach/README.md`](inline-coach/README.md). The inline extension asks for a sender profile on its options page; it is stored locally and never bundled.

Then try *"draft me a cold email to [person] asking for [thing]"*.

## What's in here

```
points/              Distilled rules and frameworks (the "what"). Canonical source for every rule.
skills/              31 Claude skills, one SKILL.md each (the "how"). This is what the plugin installs.
bundles.json         Which points/ files and skills/ each critic intent loads. Shared by the Coach UI,
                     the side-panel extension, and the eval harness.
context/             Placeholder templates for about-me.md and voice-and-style.md. Fill in, never commit.
ui/                  Offline Draft Critic + Claude-powered Coach. No build step.
side-panel-coach/    Chrome extension: Coach in the Gmail side panel. Vanilla JS. rules/ and lib/agents.js
                     are generated mirrors (node tools/sync-rules.mjs).
inline-coach/        Chrome extension that attaches to Gmail and LinkedIn compose. Vite + React + TS.
eval/                Regression corpus for the inline critic, one case per intent and more. Paid.
tools/               sync-rules.mjs (snapshot + mirror drift check), jargon-coverage.mjs (banned-word drift).
catalog/             A standalone mode-aware skill with its own 42-rule JSON catalog. Not in the critic path;
                     nothing in bundles.json or the extensions loads it. Exercised only by skill-evals/.
skill-evals/         Fixture suite for the catalog skill and cold-email-coach. Paid; free fixture lint in CI.
CLAUDE.md            Contributor map: what is canonical, what is generated, which checks to run.
```

## The points

Fourteen reference docs, each covering one slice of the source material.

| File | Covers |
|------|--------|
| [core-rules.md](points/core-rules.md) | The 15 foundational rules (BLUF, audience, concision, warmth) |
| [banned-jargon.md](points/banned-jargon.md) | Words and phrases to kill on sight, with replacements. Canonical list; the code-side copies are checked against it in CI |
| [frameworks.md](points/frameworks.md) | BLUF, S.H.I.T., 7-part pitch, op-ed structure, gratitude formula |
| [cold-email-rules.md](points/cold-email-rules.md) | Konrad's 10 rules + Heidi Roizen's mailing rules |
| [exec-memo-rules.md](points/exec-memo-rules.md) | Decision-memo rules: TL;DR up front, one ask per memo, sourced numbers, early-failure signal, plus format mechanics from Alper & Kluger's Memo on Memos |
| [performance-review-rules.md](points/performance-review-rules.md) | Kramon's seven review rules: letter to the person not about them, what you like then what you would like, next-job goals, colleague feedback, no psychoanalyzing or ambushing |
| [speech-rules.md](points/speech-rules.md) | Kramon's "Wowing the Crowd": closing line first, one story, the Sparkline, opening and closing archetypes |
| [delivery-rules.md](points/delivery-rules.md) | Spoken-delivery mechanics from Kluger & Alper: the three Vs, the four derailers, Q&A structures, nerve management |
| [kramon-master.md](points/kramon-master.md) | Full Kramon reference, all four sessions |
| [examples-and-critiques.md](points/examples-and-critiques.md) | Model letters, op-ed headlines, before/after rewrites |
| [ai-writing-rules.md](points/ai-writing-rules.md) | How to use AI without sounding like AI ("centaur" mode) |
| [pre-send-checklist.md](points/pre-send-checklist.md) | The single checklist to run before hitting send |
| [named-failure-modes.md](points/named-failure-modes.md) | 14 named cold-email failure modes: what to fix, not just where you scored low |
| [plain-technical-english.md](points/plain-technical-english.md) | **Opt-in, narrow scope.** Precision rules for instructions, runbooks, and risk sections. Deliberately fights the persuasive-writing skills |

## The skills

All 31 are listed with their triggers in [`skills/README.md`](skills/README.md). In outline:

- **Drafting and critique:** `cold-email-coach`, `op-ed-coach`, `pitch-coach`, `pitch-memo`, `speech-coach`, `gratitude-note-coach`, `dealing-with-reporters`, `yourself-story`, `performance-review-coach`, `winning-writing-critic` (the orchestrator), `fact-checker`, `cross-model-review`.
- **Cold-outreach pipeline, in order:** `recipient-research` → `connection-finder` → `warm-intro-finder` → `graveyard-historian` → `fun-angle` → `tell-them-something-new` → draft.
- **Surgical edits:** `style-tells`, `rhythm-killer`, `vividness`, `compression`, `headline-as-claim`, `bluf-rewriter`, `warmth-and-competence`, `pick-a-lane`, `irrelevant-detail-killer`, `humanize`, `feedback-rephraser`.
- **Maintaining your voice:** `voice-update` grows the `context/` files from a dictated rule, from Claude Code's auto-memory, or from your sent mail. Always proposes a diff first.
- **Closing the outcome loop:** `sent-mail-outcome-tracker` reads sent cold outreach over a connected Gmail MCP and reports what the replied-to messages had in common.

One deliberate default: `humanize` never introduces typos unless you pass `--typo`. Typos that landed in finals cost more than the "texture" earned.

## The eval harness

[`eval/`](eval/README.md) replays a golden corpus of ten drafts, at least one per critic intent, against the live Anthropic API with the full rule library loaded, and asserts recall per case. Edit a rule in `points/` or `skills/` and know whether it broke anything.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
node eval/run.mjs            # ~$0.10-0.20 per full run with prompt caching
```

CI ([`.github/workflows/eval.yml`](.github/workflows/eval.yml)) runs four free gates before the paid eval: the extension snapshot and code mirror must match their sources, every canonical AI-tell term must be covered by each code-side list, the `skill-evals` fixtures must lint, and `ui/agents.js` must stay importable from Node because the eval shares its prompt. The badge at the top reflects the latest main-branch run.

## Sources

- Glenn Kramon's *Winning Writing* (GSBGEN 352.1), Stanford GSB
- Allison Kluger and Burt Alper's *Strategic Communication* (GSBGEN 315/515), Stanford GSB: delivery mechanics, derailers, Q&A structures, and the Memo on Memos
- Nancy Duarte's *Resonate* (the Sparkline, structure-before-slides) and *Slidedocs*
- Mary Munter and Lynn Russell's *Guide to Presentations* (the AIM framework)
- Rachel Konrad's guest lectures on cold outreach
- Heidi Roizen's mailing rules
- Adam Bryant on writing about yourself ("desirable confidence") and the *Corner Office* interviews with 500+ CEOs
- Nicholas Kristof's columns and op-ed advice
- Katie Kingsbury (NYT Opinion) on what gets published
- Danny Hertzberg (Base10, ex-Sequoia) on cold outreach
- Josh Constine's *Fundraising & Pitch Deck Guide* (15-question memo, forwardable blurb, slide-titles-as-claims)
- Andrew Ross Sorkin (NYT *DealBook*) on dealing with reporters and crisis comms
- Associated Press attribution definitions (on the record / background / deep background)
- Susan Fiske (Princeton) on warmth + competence
- Lauren Weinstein on the two-axis frame and cinematic narrative ("could a director recreate this scene?")
- Stephen King's *On Writing* on adverbs
- Model bios and class examples discussed in Glenn Kramon's *Winning Writing* (abstracted, not reproduced)

## License

MIT.
